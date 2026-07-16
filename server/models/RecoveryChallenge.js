const crypto = require('crypto');
const database = require('../config/database');

function hashToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

class RecoveryChallenge {
  static async create(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    await database.run(
      'DELETE FROM password_reset_challenges WHERE user_id = $1 OR data_expiracao <= CURRENT_TIMESTAMP',
      [userId],
    );
    await database.run(
      `INSERT INTO password_reset_challenges (user_id, token_hash, data_expiracao)
       VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '10 minutes')`,
      [userId, tokenHash],
    );
    return token;
  }

  static findValid(token) {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return undefined;
    return database.get(
      `SELECT password_reset_challenges.id, password_reset_challenges.user_id,
              password_reset_challenges.tentativas, users.username, users.resposta_seguranca
       FROM password_reset_challenges
       INNER JOIN users ON users.id = password_reset_challenges.user_id
       WHERE token_hash = $1
         AND utilizado_em IS NULL
         AND tentativas < 5
         AND data_expiracao > CURRENT_TIMESTAMP`,
      [hashToken(token)],
    );
  }

  static registerFailure(id) {
    return database.run(
      `UPDATE password_reset_challenges
       SET tentativas = tentativas + 1,
           utilizado_em = CASE WHEN tentativas + 1 >= 5 THEN CURRENT_TIMESTAMP ELSE utilizado_em END
       WHERE id = $1`,
      [id],
    );
  }

  static consume(id) {
    return database.run(
      'UPDATE password_reset_challenges SET utilizado_em = CURRENT_TIMESTAMP WHERE id = $1 AND utilizado_em IS NULL',
      [id],
    );
  }
}

module.exports = RecoveryChallenge;
