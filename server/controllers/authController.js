const crypto = require('crypto');
const { promisify } = require('util');
const Session = require('../models/Session');
const User = require('../models/User');

const scryptAsync = promisify(crypto.scrypt);
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;
const MINIMUM_PASSWORD_LENGTH = 8;
const MAXIMUM_PASSWORD_LENGTH = 72;

function normalizeUsername(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.data_criacao,
  };
}

function validateCredentials(username, password) {
  if (!USERNAME_PATTERN.test(username)) {
    return 'O usuário deve ter entre 3 e 24 caracteres, usando apenas letras, números ou sublinhado.';
  }

  if (typeof password !== 'string'
    || password.length < MINIMUM_PASSWORD_LENGTH
    || password.length > MAXIMUM_PASSWORD_LENGTH) {
    return 'A senha deve ter entre 8 e 72 caracteres.';
  }

  return null;
}

/**
 * Produz um hash scrypt com salt individual para cada senha.
 */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Compara hashes em tempo constante para reduzir vazamentos por temporização.
 */
async function verifyPassword(password, storedPassword) {
  const [algorithm, salt, storedKeyHex] = String(storedPassword || '').split(':');
  if (algorithm !== 'scrypt' || !salt || !storedKeyHex) return false;

  const storedKey = Buffer.from(storedKeyHex, 'hex');
  const suppliedKey = await scryptAsync(password, salt, storedKey.length);
  return storedKey.length === suppliedKey.length
    && crypto.timingSafeEqual(storedKey, suppliedKey);
}

function extractToken(request) {
  const authorization = request.get('authorization') || '';
  if (authorization.startsWith('Bearer ')) return authorization.slice(7).trim();
  return typeof request.body?.token === 'string' ? request.body.token.trim() : '';
}

async function register(request, response, next) {
  try {
    const username = normalizeUsername(request.body?.username);
    const password = request.body?.password;
    const validationError = validateCredentials(username, password);

    if (validationError) {
      response.status(400).json({ error: validationError, code: 'INVALID_CREDENTIALS' });
      return;
    }

    if (await User.findByUsername(username)) {
      response.status(409).json({ error: 'Usuário já cadastrado.', code: 'USERNAME_IN_USE' });
      return;
    }

    const passwordHash = await hashPassword(password);
    let user;

    try {
      user = await User.create(username, passwordHash);
    } catch (error) {
      // Protege também contra cadastros simultâneos com o mesmo nome.
      if (error.code === 'SQLITE_CONSTRAINT') {
        response.status(409).json({ error: 'Usuário já cadastrado.', code: 'USERNAME_IN_USE' });
        return;
      }
      throw error;
    }

    const session = await Session.create(user.id);
    response.status(201).json({
      message: 'Conta criada com sucesso.',
      token: session.token,
      expiresAt: session.expirationDate,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function login(request, response, next) {
  try {
    const username = normalizeUsername(request.body?.username);
    const password = request.body?.password;

    if (!username || typeof password !== 'string') {
      response.status(400).json({ error: 'Informe o usuário e a senha.', code: 'MISSING_CREDENTIALS' });
      return;
    }

    const user = await User.findByUsername(username);
    const passwordMatches = user && await verifyPassword(password, user.senha_hash);

    if (!passwordMatches) {
      // A mensagem única evita revelar quais nomes estão cadastrados.
      response.status(401).json({ error: 'Usuário ou senha incorretos.', code: 'INVALID_LOGIN' });
      return;
    }

    await Session.removeExpired();
    const session = await Session.create(user.id);
    response.status(200).json({
      message: 'Login realizado com sucesso.',
      token: session.token,
      expiresAt: session.expirationDate,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function verify(request, response, next) {
  try {
    const token = extractToken(request);
    const session = await Session.findValid(token);

    if (!session) {
      response.status(401).json({ error: 'Sessão inválida ou expirada.', code: 'INVALID_SESSION' });
      return;
    }

    response.status(200).json({
      valid: true,
      expiresAt: session.data_expiracao,
      user: publicUser(session),
    });
  } catch (error) {
    next(error);
  }
}

async function logout(request, response, next) {
  try {
    await Session.revoke(extractToken(request));
    response.status(200).json({ message: 'Sessão encerrada.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, logout, register, verify };
