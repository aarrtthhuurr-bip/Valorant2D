const database = require('../config/database');

/**
 * Camada de acesso aos usuários.
 * A senha recebida por este modelo deve estar previamente criptografada.
 */
class User {
  static async create(username, senhaHash, perguntaSeguranca, respostaSegurancaHash) {
    const result = await database.run(
      `INSERT INTO users
       (username, senha_hash, pergunta_seguranca, resposta_seguranca)
       VALUES (?, ?, ?, ?)`,
      [username, senhaHash, perguntaSeguranca, respostaSegurancaHash],
    );

    return this.findById(result.lastID);
  }

  static findById(id) {
    return database.get(
      'SELECT id, username, data_criacao FROM users WHERE id = ?',
      [id],
    );
  }

  static findByUsername(username) {
    return database.get(
      'SELECT * FROM users WHERE username = ? COLLATE NOCASE',
      [username],
    );
  }

  static findPublicById(id) {
    return database.get(
      'SELECT id, username, data_criacao FROM users WHERE id = ?',
      [id],
    );
  }

  static updatePassword(id, senhaHash) {
    return database.run('UPDATE users SET senha_hash = ? WHERE id = ?', [senhaHash, id]);
  }
}

module.exports = User;
