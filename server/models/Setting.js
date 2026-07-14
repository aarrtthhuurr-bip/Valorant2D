const database = require('../config/database');

class Setting {
  static findByUserId(userId) {
    return database.get('SELECT * FROM settings WHERE user_id = ?', [userId]);
  }

  static async saveForUser(userId, hudConfig) {
    const hudConfigJson = JSON.stringify(hudConfig);

    await database.run(
      `INSERT INTO settings (user_id, hud_config_json)
       VALUES (?, ?)
       ON CONFLICT(user_id) DO UPDATE SET hud_config_json = excluded.hud_config_json`,
      [userId, hudConfigJson],
    );

    return this.findByUserId(userId);
  }
}

module.exports = Setting;
