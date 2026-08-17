const database = require('../config/database');
const { SKINS_BY_ID } = require('../data/skinCatalog');
const { BLACK_MARKET_BY_ID } = require('../data/blackMarketCatalog');

const TARGET_PREDICATE = `(admin_uuid::text = $1 OR id::text = $1
  OR LOWER(COALESCE(email, '')) = LOWER($1)
  OR LOWER(username) = LOWER($1))`;

class AdminTerminal {
  static async listAccounts(limit = 15) {
    return database.all(
      `SELECT admin_uuid AS uuid, username, email, auth_provider,
              is_admin, is_banned, core_balance, data_criacao
       FROM users
       ORDER BY data_criacao DESC
       LIMIT $1`,
      [Math.min(15, Math.max(1, Number(limit) || 15))],
    );
  }

  static async findAccount(identifier) {
    return database.get(
      `SELECT id, admin_uuid AS uuid, username, email, auth_provider,
              avatar_url, is_admin, is_banned, core_balance,
              core_earned_total, total_matches, total_kills, total_deaths,
              wins_default, wins_blackout, highest_wave_outbreak, data_criacao
       FROM users
       WHERE ${TARGET_PREDICATE}`,
      [String(identifier || '').trim()],
    );
  }

  static async inventory(userId) {
    const [skins, gadgets] = await Promise.all([
      database.all(
        `SELECT skin_id, paid_price, acquired_at
         FROM user_skins WHERE user_id = $1 ORDER BY acquired_at DESC`,
        [userId],
      ),
      database.all(
        `SELECT gadget_id, paid_price, acquired_at
         FROM user_gadgets WHERE user_id = $1 ORDER BY acquired_at DESC`,
        [userId],
      ),
    ]);
    return { skins, gadgets };
  }

  static async createAccount({ username, email, passwordHash, isAdmin }) {
    return database.get(
      `INSERT INTO users
       (username, email, senha_hash, auth_provider, pergunta_seguranca,
        resposta_seguranca, is_admin, onboarding_completed, menu_tour_completed)
       VALUES ($1, $2, $3, 'local', 'Conta administrativa', $3, $4, FALSE, FALSE)
       RETURNING admin_uuid AS uuid, username, email, is_admin, is_banned, core_balance, data_criacao`,
      [username, email, passwordHash, Boolean(isAdmin)],
    );
  }

  static async usernameExists(username) {
    return database.get('SELECT 1 FROM users WHERE LOWER(username) = LOWER($1)', [username]);
  }

  static async emailExists(email) {
    return database.get('SELECT 1 FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  }

  static async banAccount(identifier) {
    return database.get(
      `UPDATE users SET is_banned = TRUE
       WHERE ${TARGET_PREDICATE} AND is_admin = FALSE
       RETURNING id, admin_uuid AS uuid, username, is_banned`,
      [String(identifier || '').trim()],
    );
  }

  static async revokeSessions(userId) {
    return database.run('DELETE FROM sessions WHERE user_id = $1', [userId]);
  }

  static async setCore(identifier, amount, { add = false } = {}) {
    const operation = add ? 'core_balance + $2' : '$2';
    const earned = add ? ', core_earned_total = core_earned_total + $2' : '';
    return database.get(
      `UPDATE users
       SET core_balance = ${operation}${earned}
       WHERE ${TARGET_PREDICATE}
       RETURNING admin_uuid AS uuid, username, core_balance`,
      [String(identifier || '').trim(), amount],
    );
  }

  static resolveItem(identifier) {
    const value = String(identifier || '').trim();
    const normalized = value.toLowerCase().replace(/[\s_-]+/g, '');
    const skin = [...SKINS_BY_ID.values()].find((entry) => (
      entry.id.toLowerCase() === value.toLowerCase()
      || entry.id.toLowerCase().replace(/[\s_:-]+/g, '') === normalized
      || `${entry.weaponName}_${entry.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '') === normalized
    ));
    if (skin) return { kind: 'skin', id: skin.id, name: `${skin.weaponName} | ${skin.name}` };
    const gadget = [...BLACK_MARKET_BY_ID.values()].find((entry) => (
      entry.id.toLowerCase() === value.toLowerCase()
      || entry.id.toLowerCase().replace(/[\s_-]+/g, '') === normalized
      || entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '') === normalized
    ));
    return gadget ? { kind: 'gadget', id: gadget.id, name: gadget.name } : null;
  }

  static async mutateInventory(identifier, item, grant) {
    const account = await this.findAccount(identifier);
    if (!account) return null;
    if (item.kind === 'skin') {
      if (grant) await database.run(
        `INSERT INTO user_skins (user_id, skin_id, paid_price) VALUES ($1, $2, NULL)
         ON CONFLICT (user_id, skin_id) DO NOTHING`, [account.id, item.id],
      );
      else await database.run('DELETE FROM user_skins WHERE user_id = $1 AND skin_id = $2', [account.id, item.id]);
    } else {
      if (grant) await database.run(
        `INSERT INTO user_gadgets (user_id, gadget_id, paid_price) VALUES ($1, $2, 0)
         ON CONFLICT (user_id, gadget_id) DO NOTHING`, [account.id, item.id],
      );
      else await database.run('DELETE FROM user_gadgets WHERE user_id = $1 AND gadget_id = $2', [account.id, item.id]);
    }
    return { account, item };
  }

  static async createEvent({ type, targetUserId = null, message, createdBy }) {
    return database.get(
      `INSERT INTO admin_events (event_type, target_user_id, message, created_by, expires_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP + INTERVAL '10 minutes')
       RETURNING id, event_type, message, created_at`,
      [type, targetUserId, message, createdBy],
    );
  }

  static async eventsFor(userId, after = 0) {
    return database.all(
      `SELECT id, event_type, message, created_at FROM admin_events
       WHERE id > $1 AND expires_at > CURRENT_TIMESTAMP
         AND (target_user_id IS NULL OR target_user_id = $2)
       ORDER BY id ASC LIMIT 20`, [after, userId],
    );
  }

  static async ping() {
    return database.get('SELECT CURRENT_TIMESTAMP AS database_time');
  }
}

module.exports = AdminTerminal;
