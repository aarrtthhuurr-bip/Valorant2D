const database = require('../config/database');

class Leaderboard {
  static async create(userId, wavesSobrevivendo) {
    const result = await database.run(
      'INSERT INTO leaderboard (user_id, waves_sobrevivendo) VALUES (?, ?)',
      [userId, wavesSobrevivendo],
    );

    return database.get('SELECT * FROM leaderboard WHERE id = ?', [result.lastID]);
  }

  static list(limit = 100) {
    return database.all(
      `SELECT leaderboard.id, leaderboard.user_id, users.username,
              leaderboard.waves_sobrevivendo, leaderboard.data_recorde
       FROM leaderboard
       INNER JOIN users ON users.id = leaderboard.user_id
       ORDER BY leaderboard.waves_sobrevivendo DESC, leaderboard.data_recorde ASC
       LIMIT ?`,
      [limit],
    );
  }
}

module.exports = Leaderboard;
