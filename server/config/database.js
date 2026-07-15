const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error('DATABASE_URL é obrigatória e deve conter a URI do PostgreSQL.');
}

if (!/^postgres(?:ql)?:\/\//i.test(databaseUrl)) {
  throw new Error('DATABASE_URL deve começar com postgres:// ou postgresql://.');
}

const parsedDatabaseUrl = new URL(databaseUrl);
const isLocalDatabase = ['localhost', '127.0.0.1', '::1'].includes(parsedDatabaseUrl.hostname);
const sslDisabled = process.env.PGSSL === 'false' || parsedDatabaseUrl.searchParams.get('sslmode') === 'disable';

/**
 * Pool compartilhado pela aplicação. Neon e Supabase exigem TLS; em um
 * PostgreSQL local ele é desativado automaticamente, salvo configuração da URI.
 */
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabase || sslDisabled ? false : { rejectUnauthorized: false },
  max: Number(process.env.PG_POOL_MAX) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  keepAlive: true,
});

pool.on('error', (error) => {
  console.error('[PostgreSQL] Erro inesperado em conexão ociosa:', error.message);
});

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
    ];
    for (const migration of userMigrations) {
      await client.query(`ALTER TABLE users ${migration}`);
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        waves_sobrevivendo INTEGER NOT NULL DEFAULT 0 CHECK (waves_sobrevivendo >= 0),
        data_recorde TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
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

    await client.query('CREATE INDEX IF NOT EXISTS idx_leaderboard_waves ON leaderboard (waves_sobrevivendo DESC, data_recorde ASC)');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username))');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_expiration ON sessions (data_expiracao)');
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
