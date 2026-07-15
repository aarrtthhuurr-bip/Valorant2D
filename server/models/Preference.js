const database = require('../config/database');

class Preference {
  static async findByUserId(userId) {
    const row = await database.get(
      `SELECT mostrar_dicas, volume_geral, preferencias_json
       FROM users
       WHERE id = $1`,
      [userId],
    );
    if (!row) return null;

    let preferences = {};
    try {
      preferences = typeof row.preferencias_json === 'string'
        ? JSON.parse(row.preferencias_json || '{}')
        : (row.preferencias_json || {});
    } catch {
      preferences = {};
    }

    return {
      ...preferences,
      showTips: Boolean(row.mostrar_dicas),
      masterVolume: Number(row.volume_geral),
    };
  }

  static async saveForUser(userId, preferences) {
    await database.run(
      `UPDATE users
       SET mostrar_dicas = $1, volume_geral = $2, preferencias_json = $3::jsonb
       WHERE id = $4`,
      [preferences.showTips, preferences.masterVolume, JSON.stringify(preferences), userId],
    );
    return this.findByUserId(userId);
  }
}

module.exports = Preference;
