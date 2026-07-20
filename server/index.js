require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
const commerceRoutes = require('./routes/commerceRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const {
  globalLimiter,
  requestId,
  requireJson,
  securityHeaders,
} = require('./middleware/security');

const app = express();
const port = Number(process.env.PORT) || 3000;
const trustProxy = Number(process.env.TRUST_PROXY_HOPS ?? (process.env.NODE_ENV === 'production' ? 1 : 0));

if (Number.isInteger(trustProxy) && trustProxy > 0) app.set('trust proxy', trustProxy);

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
app.use(requestId);
app.use(securityHeaders());
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
  maxAge: 86400,
}));
app.use('/api', (_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('Pragma', 'no-cache');
  next();
});
app.use('/api', globalLimiter);
app.use(express.json({ limit: '32kb', strict: true }));
app.use(requireJson);

app.use('/', healthRoutes);
app.use('/api', authRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/commerce', commerceRoutes);
app.use('/api/onboarding', onboardingRoutes);

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
  const isBodyTooLarge = error.type === 'entity.too.large';
  const isInvalidJson = error instanceof SyntaxError && error.status === 400 && 'body' in error;
  if (!isCorsError && !isBodyTooLarge && !isInvalidJson) {
    console.error(`[${request.id || 'sem-request-id'}] Erro não tratado:`, error);
  }
  const status = isCorsError ? 403 : isBodyTooLarge ? 413 : isInvalidJson ? 400 : 500;
  response.status(status).json({
    erro: isCorsError
      ? error.message
      : isBodyTooLarge
        ? 'Corpo da requisição excede o limite permitido.'
        : isInvalidJson
          ? 'JSON inválido.'
          : 'Erro interno do servidor.',
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
