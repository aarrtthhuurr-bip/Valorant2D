const database = require('../config/database');

/** Consultas consolidadas do perfil público do próprio jogador. */
class PlayerProfile {
  static async findByUserId(userId) {
    const row = await database.get(
      `SELECT id, username, email, auth_provider, avatar_url,
              core_balance, core_earned_total, data_criacao,
              matches_default, wins_default, kills_default, deaths_default,
              matches_blackout, wins_blackout, kills_blackout,
              highest_wave_outbreak
       FROM users
       WHERE id = $1`,
      [userId],
    );
    if (!row) return null;

    const kills = Number(row.kills_default) || 0;
    const deaths = Number(row.deaths_default) || 0;
    return {
      id: row.id,
      username: row.username,
      email: row.email || null,
      accountProvider: row.auth_provider || 'local',
      avatarUrl: row.avatar_url || null,
      coreBalance: Number(row.core_balance) || 0,
      coreEarnedTotal: Number(row.core_earned_total) || 0,
      createdAt: row.data_criacao,
      statistics: {
        default: {
          matches: Number(row.matches_default) || 0,
          wins: Number(row.wins_default) || 0,
          kills,
          deaths,
          kd: deaths > 0 ? Number((kills / deaths).toFixed(2)) : kills,
        },
        blackout: {
          matches: Number(row.matches_blackout) || 0,
          wins: Number(row.wins_blackout) || 0,
          kills: Number(row.kills_blackout) || 0,
        },
        outbreak: {
          highestWave: Number(row.highest_wave_outbreak) || 0,
        },
      },
    };
  }
}

module.exports = PlayerProfile;
