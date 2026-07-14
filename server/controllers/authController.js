const crypto = require('crypto');
const { promisify } = require('util');
const Session = require('../models/Session');
const User = require('../models/User');

const scryptAsync = promisify(crypto.scrypt);
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;
const MINIMUM_PASSWORD_LENGTH = 8;
const MAXIMUM_PASSWORD_LENGTH = 72;
const SECURITY_QUESTIONS = new Set([
  'Qual sua cor favorita?',
  'Qual o nome do seu primeiro animal de estimação?',
  'Em qual cidade você nasceu?',
  'Qual era seu apelido de infância?',
]);

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
async function hashSecret(secret) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(secret, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Compara hashes em tempo constante para reduzir vazamentos por temporização.
 */
async function verifySecret(secret, storedSecret) {
  const [algorithm, salt, storedKeyHex] = String(storedSecret || '').split(':');
  if (algorithm !== 'scrypt' || !salt || !storedKeyHex) return false;

  const storedKey = Buffer.from(storedKeyHex, 'hex');
  const suppliedKey = await scryptAsync(secret, salt, storedKey.length);
  return storedKey.length === suppliedKey.length
    && crypto.timingSafeEqual(storedKey, suppliedKey);
}

function normalizeSecurityAnswer(value) {
  return typeof value === 'string'
    ? value.normalize('NFKC').trim().toLocaleLowerCase('pt-BR')
    : '';
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
    const securityQuestion = typeof request.body?.securityQuestion === 'string'
      ? request.body.securityQuestion.trim()
      : '';
    const securityAnswer = normalizeSecurityAnswer(request.body?.securityAnswer);
    const validationError = validateCredentials(username, password);

    if (validationError) {
      response.status(400).json({ error: validationError, code: 'INVALID_CREDENTIALS' });
      return;
    }

    if (!SECURITY_QUESTIONS.has(securityQuestion) || securityAnswer.length < 2 || securityAnswer.length > 100) {
      response.status(400).json({
        error: 'Selecione uma pergunta e informe uma resposta de segurança válida.',
        code: 'INVALID_SECURITY_ANSWER',
      });
      return;
    }

    if (await User.findByUsername(username)) {
      response.status(409).json({ error: 'Usuário já cadastrado.', code: 'USERNAME_IN_USE' });
      return;
    }

    const passwordHash = await hashSecret(password);
    const securityAnswerHash = await hashSecret(securityAnswer);
    let user;

    try {
      user = await User.create(username, passwordHash, securityQuestion, securityAnswerHash);
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
    const passwordMatches = user && await verifySecret(password, user.senha_hash);

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

async function getSecurityQuestion(request, response, next) {
  try {
    const username = normalizeUsername(request.body?.username);
    const user = username ? await User.findByUsername(username) : undefined;

    if (!user?.pergunta_seguranca || !user?.resposta_seguranca) {
      response.status(404).json({
        error: 'Conta não encontrada ou sem recuperação configurada.',
        code: 'RECOVERY_UNAVAILABLE',
      });
      return;
    }

    response.status(200).json({ username: user.username, securityQuestion: user.pergunta_seguranca });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(request, response, next) {
  try {
    const username = normalizeUsername(request.body?.username);
    const securityAnswer = normalizeSecurityAnswer(request.body?.securityAnswer);
    const newPassword = request.body?.newPassword;
    const user = username ? await User.findByUsername(username) : undefined;

    if (!user?.resposta_seguranca
      || !securityAnswer
      || !await verifySecret(securityAnswer, user.resposta_seguranca)) {
      response.status(401).json({
        error: 'Resposta de segurança incorreta.',
        code: 'INVALID_SECURITY_ANSWER',
      });
      return;
    }

    const passwordError = validateCredentials(user.username, newPassword);
    if (passwordError) {
      response.status(400).json({ error: passwordError, code: 'INVALID_PASSWORD' });
      return;
    }

    await User.updatePassword(user.id, await hashSecret(newPassword));
    await Session.revokeAllForUser(user.id);
    response.status(200).json({ message: 'Senha redefinida. Entre novamente com a nova senha.' });
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

module.exports = { getSecurityQuestion, login, logout, register, resetPassword, verify };
