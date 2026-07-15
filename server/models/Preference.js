const database = require('../config/database');

class Preference {
  static async findByUserId(userId) {
    const row = await database.get(
      `SELECT mostrar_dicas, volume_geral, preferencias_json
       FROM users
       WHERE id = ?`,
      [userId],
    );
    if (!row) return null;

    let preferences = {};
    try {
      preferences = JSON.parse(row.preferencias_json || '{}');
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
       SET mostrar_dicas = ?, volume_geral = ?, preferencias_json = ?
       WHERE id = ?`,
      [preferences.showTips ? 1 : 0, preferences.masterVolume, JSON.stringify(preferences), userId],
    );
    return this.findByUserId(userId);
  }
}

module.exports = Preference;
