const database = require('../config/database');

/**
 * Camada de acesso aos usuários.
 * A senha recebida por este modelo deve estar previamente criptografada.
 */
class User {
  static async create(username, senhaHash, perguntaSeguranca, respostaSegurancaHash) {
    return database.get(
      `INSERT INTO users
       (username, senha_hash, pergunta_seguranca, resposta_seguranca,
        onboarding_completed, menu_tour_completed)
       VALUES ($1, $2, $3, $4, FALSE, FALSE)
       RETURNING id, username, core_balance, is_admin,
                 onboarding_completed, menu_tour_completed, data_criacao`,
      [username, senhaHash, perguntaSeguranca, respostaSegurancaHash],
    );
  }

  static findById(id) {
    return database.get(
      `SELECT id, username, core_balance, is_admin,
              onboarding_completed, menu_tour_completed, data_criacao
       FROM users WHERE id = $1`,
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
      `SELECT id, username, core_balance, is_admin,
              onboarding_completed, menu_tour_completed, data_criacao
       FROM users WHERE id = $1`,
      [id],
    );
  }

  static updatePassword(id, senhaHash) {
    return database.run('UPDATE users SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);
  }

  /**
   * O estado só avança. Uma requisição repetida nunca reabre nem regride
   * etapas concluídas, tornando o endpoint seguro e idempotente.
   */
  static completeOnboarding(id, { welcomeCompleted, menuTourCompleted }) {
    return database.get(
      `UPDATE users
       SET onboarding_completed = onboarding_completed OR $2,
           menu_tour_completed = menu_tour_completed OR $3
       WHERE id = $1
       RETURNING onboarding_completed, menu_tour_completed`,
      [id, Boolean(welcomeCompleted), Boolean(menuTourCompleted)],
    );
  }

  static registerFailedLogin(id) {
    return database.run(
      `UPDATE users
       SET tentativas_login = tentativas_login + 1,
           bloqueado_ate = CASE
             WHEN tentativas_login + 1 >= 8 THEN CURRENT_TIMESTAMP + INTERVAL '60 minutes'
             WHEN tentativas_login + 1 >= 5 THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes'
             ELSE bloqueado_ate
           END
       WHERE id = $1`,
      [id],
    );
  }

  static clearFailedLogins(id) {
    return database.run(
      `UPDATE users
       SET tentativas_login = 0, bloqueado_ate = NULL, ultimo_login = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id],
    );
  }
}

module.exports = User;
