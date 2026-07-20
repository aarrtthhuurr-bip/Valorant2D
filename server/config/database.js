const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error('DATABASE_URL é obrigatória e deve conter a URI do PostgreSQL.');
}

if (!/^postgres(?:ql)?:\/\//i.test(databaseUrl)) {
  throw new Error('DATABASE_URL deve começar com postgres:// ou postgresql://.');
}

const parsedDatabaseUrl = new URL(databaseUrl);

// O pg interpreta opções SSL presentes na connection string depois de ler a
// configuração do Pool. Removê-las evita que `sslmode=verify-full` ou
// parâmetros equivalentes reativem a validação do certificado do Supabase.
[
  'ssl',
  'sslmode',
  'sslcert',
  'sslkey',
  'sslrootcert',
].forEach((parameter) => parsedDatabaseUrl.searchParams.delete(parameter));
const postgresConnectionString = parsedDatabaseUrl.toString();
const sslCa = process.env.PG_SSL_CA_BASE64
  ? Buffer.from(process.env.PG_SSL_CA_BASE64, 'base64').toString('utf8')
  : undefined;
// Mantém compatibilidade com o pooler atual do Supabase. Ative a validação no
// Render assim que PG_SSL_CA_BASE64 contiver a CA fornecida pelo projeto.
const rejectUnauthorized = process.env.PG_SSL_REJECT_UNAUTHORIZED === 'true';

/**
 * Pool compartilhado pela aplicação. A configuração SSL é compatível com
 * certificados autoassinados utilizados por provedores PostgreSQL gerenciados.
 */
const pool = new Pool({
  connectionString: postgresConnectionString,
  ssl: {
    rejectUnauthorized,
    ...(sslCa ? { ca: sslCa } : {}),
  },
  max: Number(process.env.PG_POOL_MAX) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  keepAlive: true,
});

pool.on('error', (error) => {
  console.error('[PostgreSQL] Erro inesperado em conexão ociosa:', error.message);
});

if (!rejectUnauthorized) {
  console.warn('[PostgreSQL] AVISO: validação do certificado SSL desativada por configuração explícita.');
}

async function query(sql, params = []) {
  return pool.query(sql, params);
}

async function run(sql, params = []) {
  const result = await query(sql, params);
  return { changes: result.rowCount, rows: result.rows };
}

async function get(sql, params = []) {
  const result = await query(sql, params);
  return result.rows[0];
}

async function all(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

/**
 * Inicializa e migra o esquema sem apagar registros. Todos os comandos usam
 * IF NOT EXISTS para que reinícios e novos deploys sejam idempotentes.
 */
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(24) NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        pergunta_seguranca TEXT,
        resposta_seguranca TEXT,
        partidas_jogadas INTEGER NOT NULL DEFAULT 0,
        vitorias INTEGER NOT NULL DEFAULT 0,
        abates_totais INTEGER NOT NULL DEFAULT 0,
        pontuacao_maxima INTEGER NOT NULL DEFAULT 0,
        mostrar_dicas BOOLEAN NOT NULL DEFAULT TRUE,
        volume_geral INTEGER NOT NULL DEFAULT 40 CHECK (volume_geral BETWEEN 0 AND 100),
        preferencias_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        core_balance INTEGER NOT NULL DEFAULT 300 CHECK (core_balance >= 0),
        is_admin BOOLEAN NOT NULL DEFAULT FALSE,
        data_criacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const userMigrations = [
      'ADD COLUMN IF NOT EXISTS pergunta_seguranca TEXT',
      'ADD COLUMN IF NOT EXISTS resposta_seguranca TEXT',
      'ADD COLUMN IF NOT EXISTS partidas_jogadas INTEGER NOT NULL DEFAULT 0',
      'ADD COLUMN IF NOT EXISTS vitorias INTEGER NOT NULL DEFAULT 0',
      'ADD COLUMN IF NOT EXISTS abates_totais INTEGER NOT NULL DEFAULT 0',
      'ADD COLUMN IF NOT EXISTS pontuacao_maxima INTEGER NOT NULL DEFAULT 0',
      'ADD COLUMN IF NOT EXISTS mostrar_dicas BOOLEAN NOT NULL DEFAULT TRUE',
      'ADD COLUMN IF NOT EXISTS volume_geral INTEGER NOT NULL DEFAULT 40',
      "ADD COLUMN IF NOT EXISTS preferencias_json JSONB NOT NULL DEFAULT '{}'::jsonb",
      'ADD COLUMN IF NOT EXISTS tentativas_login INTEGER NOT NULL DEFAULT 0',
      'ADD COLUMN IF NOT EXISTS bloqueado_ate TIMESTAMPTZ',
      'ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMPTZ',
      'ADD COLUMN IF NOT EXISTS core_balance INTEGER NOT NULL DEFAULT 300',
      'ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE',
    ];
    for (const migration of userMigrations) {
      await client.query(`ALTER TABLE users ${migration}`);
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        player_name VARCHAR(24) NOT NULL,
        score INTEGER NOT NULL CHECK (score >= 0),
        max_wave INTEGER NOT NULL DEFAULT 0 CHECK (max_wave >= 0),
        core_reward INTEGER NOT NULL DEFAULT 0 CHECK (core_reward >= 0),
        game_mode VARCHAR(24) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Migração não destrutiva da leaderboard antiga, baseada apenas em waves.
    await client.query('ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS player_name VARCHAR(24)');
    await client.query('ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS score INTEGER');
    await client.query('ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS max_wave INTEGER NOT NULL DEFAULT 0');
    await client.query('ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS core_reward INTEGER NOT NULL DEFAULT 0');
    await client.query('ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS game_mode VARCHAR(24)');
    await client.query('ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ');
    await client.query(`
      UPDATE leaderboard AS ranking
      SET player_name = COALESCE(ranking.player_name, users.username)
      FROM users
      WHERE ranking.user_id = users.id AND ranking.player_name IS NULL
    `);
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'leaderboard'
            AND column_name = 'waves_sobrevivendo'
        ) THEN
          EXECUTE 'UPDATE leaderboard SET score = COALESCE(score, waves_sobrevivendo * 1000) WHERE score IS NULL';
          EXECUTE 'UPDATE leaderboard SET max_wave = GREATEST(max_wave, COALESCE(waves_sobrevivendo, 0))';
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'leaderboard'
            AND column_name = 'data_recorde'
        ) THEN
          EXECUTE 'UPDATE leaderboard SET created_at = COALESCE(created_at, data_recorde) WHERE created_at IS NULL';
        END IF;
      END $$
    `);
    await client.query("UPDATE leaderboard SET player_name = 'Jogador' WHERE player_name IS NULL");
    await client.query('UPDATE leaderboard SET score = 0 WHERE score IS NULL');
    await client.query("UPDATE leaderboard SET game_mode = 'outbreak' WHERE game_mode IS NULL");
    // Resultados gravados antes da coluna max_wave não possuem a wave isolada.
    // A aproximação abaixo preserva esses registros até novas partidas exatas.
    await client.query(`
      UPDATE leaderboard
      SET max_wave = FLOOR(score / 1000.0)::INTEGER
      WHERE game_mode = 'outbreak' AND max_wave = 0 AND score > 0
    `);
    await client.query('UPDATE leaderboard SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL');
    await client.query('ALTER TABLE leaderboard ALTER COLUMN player_name SET NOT NULL');
    await client.query('ALTER TABLE leaderboard ALTER COLUMN score SET NOT NULL');
    await client.query('ALTER TABLE leaderboard ALTER COLUMN game_mode SET NOT NULL');
    await client.query('ALTER TABLE leaderboard ALTER COLUMN created_at SET NOT NULL');
    await client.query('ALTER TABLE leaderboard ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP');
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leaderboard_score_nonnegative') THEN
          ALTER TABLE leaderboard
          ADD CONSTRAINT leaderboard_score_nonnegative CHECK (score >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leaderboard_game_mode_valid') THEN
          ALTER TABLE leaderboard
          ADD CONSTRAINT leaderboard_game_mode_valid CHECK (game_mode IN ('default', 'blackout', 'outbreak'));
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leaderboard_max_wave_nonnegative') THEN
          ALTER TABLE leaderboard
          ADD CONSTRAINT leaderboard_max_wave_nonnegative CHECK (max_wave >= 0);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leaderboard_core_reward_nonnegative') THEN
          ALTER TABLE leaderboard
          ADD CONSTRAINT leaderboard_core_reward_nonnegative CHECK (core_reward >= 0);
        END IF;
      END $$
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        hud_config_json JSONB NOT NULL DEFAULT '{}'::jsonb
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        data_criacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        data_expiracao TIMESTAMPTZ NOT NULL,
        ultimo_acesso TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_challenges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        tentativas INTEGER NOT NULL DEFAULT 0,
        data_expiracao TIMESTAMPTZ NOT NULL,
        utilizado_em TIMESTAMPTZ,
        data_criacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        modo VARCHAR(24) NOT NULL,
        iniciado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        data_expiracao TIMESTAMPTZ NOT NULL,
        utilizado_em TIMESTAMPTZ
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_skins (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        skin_id VARCHAR(100) NOT NULL,
        acquired_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, skin_id)
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS equipped_skins (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        weapon_id VARCHAR(32) NOT NULL,
        skin_id VARCHAR(100) NOT NULL,
        equipped_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, weapon_id),
        UNIQUE (user_id, skin_id),
        FOREIGN KEY (user_id, skin_id) REFERENCES user_skins(user_id, skin_id) ON DELETE CASCADE
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_mission_progress (
        id BIGSERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        mission_date DATE NOT NULL,
        mission_id VARCHAR(32) NOT NULL,
        progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0),
        claimed_at TIMESTAMPTZ,
        UNIQUE (user_id, mission_date, mission_id)
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id BIGSERIAL PRIMARY KEY,
        code_hash CHAR(64) NOT NULL UNIQUE,
        code_display VARCHAR(32) NOT NULL,
        core_amount INTEGER NOT NULL CHECK (core_amount BETWEEN 1 AND 10000),
        created_by INTEGER NOT NULL REFERENCES users(id),
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS code_redemptions (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        code_id BIGINT NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
        redeemed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, code_id)
      )
    `);

    // Compatibilidade com a conta administrativa criada antes da flag is_admin.
    // Novos cadastros com esse nome são bloqueados pelo controlador, portanto a
    // migração não permite que uma conta pública futura obtenha privilégios.
    await client.query("UPDATE users SET is_admin = TRUE WHERE username = 'Admin'");

    // Permite selecionar outro administrador por variável de ambiente. Depois
    // da promoção, toda autorização continua baseada somente em is_admin.
    const bootstrapAdmin = process.env.ADMIN_USERNAME?.trim();
    if (bootstrapAdmin) {
      await client.query('UPDATE users SET is_admin = TRUE WHERE LOWER(username) = LOWER($1)', [bootstrapAdmin]);
    }
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_core_balance_nonnegative') THEN
          ALTER TABLE users ADD CONSTRAINT users_core_balance_nonnegative CHECK (core_balance >= 0);
        END IF;
      END $$
    `);

    await client.query('DROP INDEX IF EXISTS idx_leaderboard_waves');
    await client.query('CREATE INDEX IF NOT EXISTS idx_leaderboard_mode_score ON leaderboard (game_mode, score DESC, created_at ASC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_leaderboard_user_mode ON leaderboard (user_id, game_mode, score DESC)');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username))');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_expiration ON sessions (data_expiracao)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_password_reset_expiration ON password_reset_challenges (data_expiracao)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_match_submissions_user ON match_submissions (user_id, iniciado_em DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_user_skins_user ON user_skins (user_id, acquired_at DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_daily_missions_user_date ON daily_mission_progress (user_id, mission_date)');
    await client.query('COMMIT');

    console.log(`[PostgreSQL] Conectado a ${parsedDatabaseUrl.hostname}.`);
    console.log('[PostgreSQL] Esquema verificado sem recriar tabelas ou apagar registros.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function closeDatabase() {
  await pool.end();
}

module.exports = { all, closeDatabase, get, initializeDatabase, pool, query, run };
