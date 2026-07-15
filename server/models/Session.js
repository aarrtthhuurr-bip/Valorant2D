const crypto = require('crypto');
const database = require('../config/database');

const SESSION_DURATION_DAYS = 30;

/**
 * Gera o hash persistido no banco. O token original nunca é armazenado.
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

class Session {
  /**
   * Cria uma sessão de 30 dias e devolve o token somente uma vez.
   */
  static async create(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    const expirationDate = new Date(
      Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    await database.run(
      `INSERT INTO sessions (user_id, token_hash, data_expiracao)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expirationDate],
    );

    return { token, expirationDate };
  }

  /**
   * Localiza uma sessão válida e atualiza o horário do último acesso.
   */
  static async findValid(token) {
    if (typeof token !== 'string' || token.length < 32 || token.length > 256) {
      return undefined;
    }

    const tokenHash = hashToken(token);
    const session = await database.get(
      `SELECT sessions.id AS session_id, sessions.data_expiracao,
              users.id, users.username, users.data_criacao
       FROM sessions
       INNER JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = $1
         AND sessions.data_expiracao > CURRENT_TIMESTAMP`,
      [tokenHash],
    );

    if (!session) return undefined;

    await database.run(
      'UPDATE sessions SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = $1',
      [session.session_id],
    );

    return session;
  }

  static revoke(token) {
    if (typeof token !== 'string' || token.length < 32 || token.length > 256) {
      return Promise.resolve({ changes: 0 });
    }

    return database.run('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
  }

  static removeExpired() {
    return database.run('DELETE FROM sessions WHERE data_expiracao <= CURRENT_TIMESTAMP');
  }

  static revokeAllForUser(userId) {
    return database.run('DELETE FROM sessions WHERE user_id = $1', [userId]);
  }
}

module.exports = Session;
