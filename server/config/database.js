const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const sqlite3 = require('sqlite3').verbose();

/**
 * Converte DATABASE_URL em um caminho aceito pelo SQLite.
 *
 * Formatos aceitos:
 * - /var/data/database.sqlite
 * - ./database.sqlite
 * - sqlite:///var/data/database.sqlite
 * - file:///var/data/database.sqlite
 */
function resolveDatabasePath(databaseUrl) {
  const defaultPath = path.join(__dirname, '..', 'database.sqlite');
  if (!databaseUrl) return defaultPath;

  const configuredValue = databaseUrl.trim();
  if (!configuredValue) return defaultPath;

  if (configuredValue.startsWith('file:')) {
    return fileURLToPath(configuredValue);
  }

  if (configuredValue.startsWith('sqlite://')) {
    const sqlitePath = configuredValue.slice('sqlite://'.length);
    if (!sqlitePath) throw new Error('DATABASE_URL não contém um caminho SQLite válido.');
    return path.resolve(sqlitePath);
  }

  // Impede que uma URL de outro mecanismo seja interpretada como arquivo local.
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(configuredValue)) {
    throw new Error('DATABASE_URL deve apontar para um arquivo SQLite.');
  }

  return path.resolve(configuredValue);
}

const databasePath = resolveDatabasePath(process.env.DATABASE_URL);

// O diretório do disco persistente precisa existir antes da conexão.
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const database = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Falha ao conectar ao banco de dados SQLite:', error.message);
    return;
  }

  console.log(`Banco de dados SQLite conectado em: ${databasePath}`);
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function handleResult(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    database.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    database.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

/**
 * Cria as tabelas e os índices iniciais da aplicação.
 * As chaves estrangeiras e o modo WAL aumentam a integridade do banco.
 */
async function initializeDatabase() {
  await run('PRAGMA foreign_keys = ON');
  await run('PRAGMA journal_mode = WAL');

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      waves_sobrevivendo INTEGER NOT NULL DEFAULT 0 CHECK (waves_sobrevivendo >= 0),
      data_recorde DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      hud_config_json TEXT NOT NULL DEFAULT '{}',
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      data_expiracao DATETIME NOT NULL,
      ultimo_acesso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_leaderboard_waves
    ON leaderboard (waves_sobrevivendo DESC, data_recorde ASC)
  `);

  await run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_nocase
    ON users (username COLLATE NOCASE)
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id
    ON sessions (user_id)
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_sessions_expiration
    ON sessions (data_expiracao)
  `);
}

module.exports = {
  all,
  database,
  databasePath,
  get,
  initializeDatabase,
  resolveDatabasePath,
  run,
};
