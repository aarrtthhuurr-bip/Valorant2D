const database = require('../config/database');

class AdminTerminal {
  static async listAccounts(limit = 20) {
    return database.all(
      `SELECT admin_uuid AS uuid, username, email, auth_provider,
              is_admin, is_banned, core_balance, data_criacao
       FROM users
       ORDER BY data_criacao DESC
       LIMIT $1`,
      [Math.min(20, Math.max(1, Number(limit) || 20))],
    );
  }

  static async findAccount(identifier) {
    return database.get(
      `SELECT id, admin_uuid AS uuid, username, email, auth_provider,
              avatar_url, is_admin, is_banned, core_balance,
              core_earned_total, total_matches, total_kills, total_deaths,
              wins_default, wins_blackout, highest_wave_outbreak, data_criacao
       FROM users
       WHERE admin_uuid::text = $1 OR id::text = $1`,
      [String(identifier || '').trim()],
    );
  }

  static async inventory(userId) {
    const [skins, gadgets] = await Promise.all([
      database.all(
        `SELECT skin_id, paid_price, acquired_at
         FROM user_skins WHERE user_id = $1 ORDER BY acquired_at DESC`,
        [userId],
      ),
      database.all(
        `SELECT gadget_id, paid_price, acquired_at
         FROM user_gadgets WHERE user_id = $1 ORDER BY acquired_at DESC`,
        [userId],
      ),
    ]);
    return { skins, gadgets };
  }

  static async createAccount({ username, email, passwordHash, isAdmin }) {
    return database.get(
      `INSERT INTO users
       (username, email, senha_hash, auth_provider, pergunta_seguranca,
        resposta_seguranca, is_admin, onboarding_completed, menu_tour_completed)
       VALUES ($1, $2, $3, 'local', 'Conta administrativa', $3, $4, FALSE, FALSE)
       RETURNING admin_uuid AS uuid, username, email, is_admin, is_banned, core_balance, data_criacao`,
      [username, email, passwordHash, Boolean(isAdmin)],
    );
  }

  static async usernameExists(username) {
    return database.get('SELECT 1 FROM users WHERE LOWER(username) = LOWER($1)', [username]);
  }

  static async emailExists(email) {
    return database.get('SELECT 1 FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  }

  static async banAccount(identifier) {
    return database.get(
      `UPDATE users SET is_banned = TRUE
       WHERE (admin_uuid::text = $1 OR id::text = $1) AND is_admin = FALSE
       RETURNING id, admin_uuid AS uuid, username, is_banned`,
      [String(identifier || '').trim()],
    );
  }

  static async revokeSessions(userId) {
    return database.run('DELETE FROM sessions WHERE user_id = $1', [userId]);
  }

  static async setCore(identifier, amount, { add = false } = {}) {
    const operation = add ? 'core_balance + $2' : '$2';
    const earned = add ? ', core_earned_total = core_earned_total + $2' : '';
    return database.get(
      `UPDATE users
       SET core_balance = ${operation}${earned}
       WHERE admin_uuid::text = $1 OR id::text = $1
       RETURNING admin_uuid AS uuid, username, core_balance`,
      [String(identifier || '').trim(), amount],
    );
  }
}

module.exports = AdminTerminal;
