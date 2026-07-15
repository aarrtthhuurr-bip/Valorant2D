const database = require('../config/database');

/**
 * Camada de acesso aos usuários.
 * A senha recebida por este modelo deve estar previamente criptografada.
 */
class User {
  static async create(username, senhaHash, perguntaSeguranca, respostaSegurancaHash) {
    return database.get(
      `INSERT INTO users
       (username, senha_hash, pergunta_seguranca, resposta_seguranca)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, data_criacao`,
      [username, senhaHash, perguntaSeguranca, respostaSegurancaHash],
    );
  }

  static findById(id) {
    return database.get(
      'SELECT id, username, data_criacao FROM users WHERE id = $1',
      [id],
    );
  }

  static findByUsername(username) {
    return database.get(
      'SELECT * FROM users WHERE LOWER(username) = LOWER($1)',
      [username],
    );
  }

  static findPublicById(id) {
    return database.get(
      'SELECT id, username, data_criacao FROM users WHERE id = $1',
      [id],
    );
  }

  static updatePassword(id, senhaHash) {
    return database.run('UPDATE users SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);
  }
}

module.exports = User;
