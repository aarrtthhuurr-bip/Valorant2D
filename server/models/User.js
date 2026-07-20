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
       RETURNING id, username, email, auth_provider, avatar_url,
                 core_balance, core_earned_total, is_admin,
                 onboarding_completed, menu_tour_completed, data_criacao`,
      [username, senhaHash, perguntaSeguranca, respostaSegurancaHash],
    );
  }

  /** Cria uma identidade Google sem senha reutilizável e sem Core inicial. */
  static createGoogle({ username, email, googleSub, avatarUrl, passwordSentinel }) {
    return database.get(
      `INSERT INTO users
       (username, senha_hash, email, google_sub, auth_provider, avatar_url,
        core_balance, core_earned_total, onboarding_completed, menu_tour_completed)
       VALUES ($1, $2, $3, $4, 'google', $5, 0, 0, FALSE, FALSE)
       RETURNING id, username, email, auth_provider, avatar_url,
                 core_balance, core_earned_total, is_admin,
                 onboarding_completed, menu_tour_completed, data_criacao`,
      [username, passwordSentinel, email, googleSub, avatarUrl || null],
    );
  }

  static findById(id) {
    return database.get(
      `SELECT id, username, email, auth_provider, avatar_url,
              core_balance, core_earned_total, is_admin,
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

  static findByEmail(email) {
    return database.get('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  }

  static findByGoogleSub(googleSub) {
    return database.get('SELECT * FROM users WHERE google_sub = $1', [googleSub]);
  }

  /**
   * Vincula somente uma identidade Google validada pelo servidor. A condição
   * impede que uma conta já ligada a outro `sub` seja sobrescrita.
   */
  static linkGoogleIdentity(id, { email, googleSub, avatarUrl }) {
    return database.get(
      `UPDATE users
       SET email = COALESCE(email, $2),
           google_sub = $3,
           auth_provider = CASE WHEN auth_provider = 'local' THEN 'local+google' ELSE auth_provider END,
           avatar_url = COALESCE($4, avatar_url)
       WHERE id = $1 AND (google_sub IS NULL OR google_sub = $3)
       RETURNING *`,
      [id, email, googleSub, avatarUrl || null],
    );
  }

  static refreshGoogleProfile(id, { email, avatarUrl }) {
    return database.get(
      `UPDATE users
       SET email = $2, avatar_url = COALESCE($3, avatar_url), ultimo_login = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, email, avatarUrl || null],
    );
  }

  static findPublicById(id) {
    return database.get(
      `SELECT id, username, email, auth_provider, avatar_url,
              core_balance, core_earned_total, is_admin,
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
