const crypto = require('crypto');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');

function numericEnvironment(name, fallback, minimum, maximum) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

function rateLimitHandler(request, response, _next, options) {
  response.status(options.statusCode).json({
    error: 'Muitas solicitações. Aguarde antes de tentar novamente.',
    code: 'RATE_LIMITED',
  });
}

function createLimiter({ windowMs, limit, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: rateLimitHandler,
  });
}

const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: numericEnvironment('RATE_LIMIT_GLOBAL', 300, 20, 5000),
});

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: numericEnvironment('RATE_LIMIT_LOGIN', 10, 3, 100),
  skipSuccessfulRequests: true,
});

const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: numericEnvironment('RATE_LIMIT_REGISTER', 5, 1, 50),
});

const recoveryQuestionLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: numericEnvironment('RATE_LIMIT_RECOVERY_QUESTION', 10, 2, 100),
});

const passwordResetLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: numericEnvironment('RATE_LIMIT_PASSWORD_RESET', 5, 1, 50),
});

const authenticatedWriteLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: numericEnvironment('RATE_LIMIT_AUTH_WRITE', 30, 5, 300),
});

function securityHeaders() {
  const production = process.env.NODE_ENV === 'production';
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'no-referrer' },
    strictTransportSecurity: production
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  });
}

function requestId(request, response, next) {
  const incoming = request.get('x-request-id');
  const id = typeof incoming === 'string' && /^[a-zA-Z0-9._-]{8,80}$/.test(incoming)
    ? incoming
    : crypto.randomUUID();
  request.id = id;
  response.setHeader('X-Request-Id', id);
  next();
}

function requireJson(request, response, next) {
  if (['POST', 'PUT', 'PATCH'].includes(request.method) && !request.is('application/json')) {
    response.status(415).json({ error: 'Envie o corpo como application/json.', code: 'JSON_REQUIRED' });
    return;
  }
  next();
}

module.exports = {
  authenticatedWriteLimiter,
  globalLimiter,
  loginLimiter,
  passwordResetLimiter,
  recoveryQuestionLimiter,
  registerLimiter,
  requestId,
  requireJson,
  securityHeaders,
  createLimiter,
};
