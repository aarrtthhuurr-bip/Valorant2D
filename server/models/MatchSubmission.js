const crypto = require('crypto');
const database = require('../config/database');

function hashToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

class MatchSubmission {
  static async create(userId, mode) {
    const token = crypto.randomBytes(32).toString('hex');
    await database.run(
      `DELETE FROM match_submissions
       WHERE data_expiracao <= CURRENT_TIMESTAMP
          OR (user_id = $1 AND utilizado_em IS NULL)`,
      [userId],
    );
    await database.run(
      `INSERT INTO match_submissions (user_id, token_hash, modo, data_expiracao)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP + INTERVAL '2 hours')`,
      [userId, hashToken(token), mode],
    );
    return token;
  }

  static findValid(userId, token) {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return undefined;
    return database.get(
      `SELECT id, modo, iniciado_em,
              EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - iniciado_em)) AS duracao_segundos
       FROM match_submissions
       WHERE user_id = $1 AND token_hash = $2
         AND utilizado_em IS NULL AND data_expiracao > CURRENT_TIMESTAMP`,
      [userId, hashToken(token)],
    );
  }

  static consume(id) {
    return database.run(
      'UPDATE match_submissions SET utilizado_em = CURRENT_TIMESTAMP WHERE id = $1 AND utilizado_em IS NULL',
      [id],
    );
  }
}

module.exports = MatchSubmission;
