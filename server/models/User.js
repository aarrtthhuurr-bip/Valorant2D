const database = require('../config/database');

/**
 * Camada de acesso aos usuários.
 * A senha recebida por este modelo deve estar previamente criptografada.
 */
class User {
  static async create(username, senhaHash) {
    const result = await database.run(
      'INSERT INTO users (username, senha_hash) VALUES (?, ?)',
      [username, senhaHash],
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
}

module.exports = User;
