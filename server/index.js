require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');

const app = express();
const port = Number(process.env.PORT) || 3000;

// Aceita o GitHub Pages oficial e origens adicionais separadas por vírgula.
const defaultOrigins = [
  'https://aarrtthhuurr-bip.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];
const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors({
  origin(origin, callback) {
    // Requisições sem Origin incluem health checks e clientes não navegadores.
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origem não permitida pela política de CORS.'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/', healthRoutes);
app.use('/api', authRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/preferences', preferencesRoutes);

app.use((request, response) => {
  response.status(404).json({ erro: 'Rota não encontrada.' });
});

// Centraliza erros dos middlewares e das futuras rotas da API.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const isCorsError = error.message === 'Origem não permitida pela política de CORS.';
  if (!isCorsError) console.error('Erro não tratado:', error);
  response.status(isCorsError ? 403 : 500).json({
    erro: isCorsError ? error.message : 'Erro interno do servidor.',
  });
});

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor online na porta ${port}.`);
    });
  } catch (error) {
    console.error('Não foi possível iniciar o servidor:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
