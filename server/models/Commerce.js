const crypto = require('crypto');
const database = require('../config/database');
const { SKIN_CATALOG, SKINS_BY_ID, dailyOffers } = require('../data/skinCatalog');
const { MISSIONS_BY_ID, missionsForUser } = require('../data/dailyMissions');

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeCode(value) {
  return typeof value === 'string' ? value.normalize('NFKC').trim().toUpperCase() : '';
}

function hashCode(code) {
  return crypto.createHash('sha256').update(code, 'utf8').digest('hex');
}

async function ensureDailyMissions(client, userId, date = todayUtc()) {
  for (const mission of missionsForUser(userId, new Date(`${date}T12:00:00.000Z`))) {
    await client.query(
      `INSERT INTO daily_mission_progress (user_id, mission_date, mission_id)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [userId, date, mission.id],
    );
  }
}

function serializeMission(row) {
  const definition = MISSIONS_BY_ID.get(row.mission_id);
  if (!definition) return null;
  const progress = Math.min(definition.target, Number(row.progress) || 0);
  return {
    assignmentId: String(row.id),
    missionId: definition.id,
    description: definition.description,
    reward: definition.reward,
    progress,
    target: definition.target,
    completed: progress >= definition.target,
    claimed: Boolean(row.claimed_at),
  };
}

class Commerce {
  static async profile(userId) {
    const client = await database.pool.connect();
    try {
      await client.query('BEGIN');
      await ensureDailyMissions(client, userId);
      const [userResult, ownedResult, equippedResult, missionResult, easterEggResult] = await Promise.all([
        client.query('SELECT core_balance, is_admin FROM users WHERE id = $1', [userId]),
        client.query('SELECT skin_id, acquired_at FROM user_skins WHERE user_id = $1 ORDER BY acquired_at DESC', [userId]),
        client.query('SELECT weapon_id, skin_id FROM equipped_skins WHERE user_id = $1', [userId]),
        client.query(
          `SELECT id, mission_id, progress, claimed_at
           FROM daily_mission_progress WHERE user_id = $1 AND mission_date = CURRENT_DATE ORDER BY id`,
          [userId],
        ),
        client.query(
          `SELECT code_display FROM promo_codes
           WHERE active = TRUE ORDER BY created_at DESC, id DESC LIMIT 5`,
        ),
      ]);
      await client.query('COMMIT');
      const user = userResult.rows[0];
      return {
        coreBalance: Number(user?.core_balance) || 0,
        isAdmin: Boolean(user?.is_admin),
        catalog: SKIN_CATALOG,
        dailyOffers: dailyOffers(),
        ownedSkinIds: ownedResult.rows.map((row) => row.skin_id),
        equippedSkins: Object.fromEntries(equippedResult.rows.map((row) => [row.weapon_id, row.skin_id])),
        missions: missionResult.rows.map(serializeMission).filter(Boolean),
        easterEggCodes: easterEggResult.rows.map((row) => row.code_display),
        nextRotationAt: `${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}T00:00:00.000Z`,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async purchaseSkin(userId, skinId) {
    const skin = SKINS_BY_ID.get(skinId);
    if (!skin) return { error: 'SKIN_NOT_FOUND' };
    const offer = dailyOffers().find((entry) => entry.id === skinId);
    const price = offer?.price ?? skin.price;
    const client = await database.pool.connect();
    try {
      await client.query('BEGIN');
      const userResult = await client.query('SELECT core_balance FROM users WHERE id = $1 FOR UPDATE', [userId]);
      const balance = Number(userResult.rows[0]?.core_balance) || 0;
      const owned = await client.query('SELECT 1 FROM user_skins WHERE user_id = $1 AND skin_id = $2', [userId, skinId]);
      if (owned.rowCount) { await client.query('ROLLBACK'); return { error: 'SKIN_ALREADY_OWNED' }; }
      if (balance < price) { await client.query('ROLLBACK'); return { error: 'INSUFFICIENT_CORE', coreBalance: balance }; }
      await client.query('INSERT INTO user_skins (user_id, skin_id) VALUES ($1, $2)', [userId, skinId]);
      const updated = await client.query(
        'UPDATE users SET core_balance = core_balance - $1 WHERE id = $2 RETURNING core_balance',
        [price, userId],
      );
      await client.query('COMMIT');
      return { skin, paid: price, coreBalance: Number(updated.rows[0].core_balance) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  static async equipSkin(userId, weaponId, skinId) {
    if (!/^[a-z-]{2,32}$/.test(weaponId)) return { error: 'INVALID_WEAPON' };
    if (skinId === null) {
      await database.run('DELETE FROM equipped_skins WHERE user_id = $1 AND weapon_id = $2', [userId, weaponId]);
      return { weaponId, skinId: null };
    }
    const skin = SKINS_BY_ID.get(skinId);
    if (!skin || skin.weaponId !== weaponId) return { error: 'INVALID_SKIN_FOR_WEAPON' };
    const owned = await database.get('SELECT 1 FROM user_skins WHERE user_id = $1 AND skin_id = $2', [userId, skinId]);
    if (!owned) return { error: 'SKIN_NOT_OWNED' };
    await database.run(
      `INSERT INTO equipped_skins (user_id, weapon_id, skin_id) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, weapon_id) DO UPDATE SET skin_id = EXCLUDED.skin_id, equipped_at = CURRENT_TIMESTAMP`,
      [userId, weaponId, skinId],
    );
    return { weaponId, skinId, skin };
  }

  static async claimMission(userId, assignmentId) {
    if (!/^\d{1,20}$/.test(String(assignmentId))) return { error: 'MISSION_NOT_FOUND' };
    const client = await database.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `SELECT id, mission_id, progress, claimed_at FROM daily_mission_progress
         WHERE id = $1 AND user_id = $2 AND mission_date = CURRENT_DATE FOR UPDATE`,
        [assignmentId, userId],
      );
      const row = result.rows[0];
      const mission = row && MISSIONS_BY_ID.get(row.mission_id);
      if (!mission) { await client.query('ROLLBACK'); return { error: 'MISSION_NOT_FOUND' }; }
      if (row.claimed_at) { await client.query('ROLLBACK'); return { error: 'MISSION_ALREADY_CLAIMED' }; }
      if (Number(row.progress) < mission.target) { await client.query('ROLLBACK'); return { error: 'MISSION_INCOMPLETE' }; }
      await client.query('UPDATE daily_mission_progress SET claimed_at = CURRENT_TIMESTAMP WHERE id = $1', [row.id]);
      const balance = await client.query(
        'UPDATE users SET core_balance = core_balance + $1 WHERE id = $2 RETURNING core_balance',
        [mission.reward, userId],
      );
      await client.query('COMMIT');
      return { reward: mission.reward, coreBalance: Number(balance.rows[0].core_balance) };
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  }

  static async createCode(userId, rawCode, coreAmount) {
    const code = normalizeCode(rawCode);
    if (!/^[A-Z0-9_-]{4,32}$/.test(code) || !Number.isInteger(coreAmount) || coreAmount < 1 || coreAmount > 10000) {
      return { error: 'INVALID_CODE' };
    }
    const admin = await database.get('SELECT is_admin FROM users WHERE id = $1', [userId]);
    if (!admin?.is_admin) return { error: 'ADMIN_REQUIRED' };
    try {
      const result = await database.get(
        `INSERT INTO promo_codes (code_hash, code_display, core_amount, created_by)
         VALUES ($1, $2, $3, $4) RETURNING id, code_display, core_amount, created_at`,
        [hashCode(code), code, coreAmount, userId],
      );
      return { code: result };
    } catch (error) {
      if (error.code === '23505') return { error: 'CODE_ALREADY_EXISTS' };
      throw error;
    }
  }

  static async redeemCode(userId, rawCode) {
    const code = normalizeCode(rawCode);
    if (!/^[A-Z0-9_-]{4,32}$/.test(code)) return { error: 'INVALID_CODE' };
    const client = await database.pool.connect();
    try {
      await client.query('BEGIN');
      const codeResult = await client.query(
        'SELECT id, core_amount FROM promo_codes WHERE code_hash = $1 AND active = TRUE FOR UPDATE',
        [hashCode(code)],
      );
      const promo = codeResult.rows[0];
      if (!promo) { await client.query('ROLLBACK'); return { error: 'CODE_NOT_FOUND' }; }
      const inserted = await client.query(
        `INSERT INTO code_redemptions (user_id, code_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING RETURNING user_id`,
        [userId, promo.id],
      );
      if (!inserted.rowCount) { await client.query('ROLLBACK'); return { error: 'CODE_ALREADY_REDEEMED' }; }
      const balance = await client.query(
        'UPDATE users SET core_balance = core_balance + $1 WHERE id = $2 RETURNING core_balance',
        [promo.core_amount, userId],
      );
      await client.query('COMMIT');
      return { reward: Number(promo.core_amount), coreBalance: Number(balance.rows[0].core_balance) };
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  }

  static async updateMissionProgress(client, userId, match) {
    await ensureDailyMissions(client, userId);
    const assignments = await client.query(
      `SELECT id, mission_id, progress FROM daily_mission_progress
       WHERE user_id = $1 AND mission_date = CURRENT_DATE AND claimed_at IS NULL FOR UPDATE`,
      [userId],
    );
    for (const row of assignments.rows) {
      const mission = MISSIONS_BY_ID.get(row.mission_id);
      if (!mission) continue;
      let value = 0;
      if (mission.metric === 'matches') value = 1;
      if (mission.metric === 'kills') value = match.kills;
      if (mission.metric === 'score') value = match.score;
      if (mission.metric === 'wins') value = match.victory ? 1 : 0;
      if (mission.metric === 'outbreak_wave') {
        await client.query('UPDATE daily_mission_progress SET progress = GREATEST(progress, $1) WHERE id = $2', [match.maxWave || 0, row.id]);
      } else if (value > 0) {
        await client.query('UPDATE daily_mission_progress SET progress = LEAST($1, progress + $2) WHERE id = $3', [mission.target, value, row.id]);
      }
    }
  }
}

module.exports = Commerce;
