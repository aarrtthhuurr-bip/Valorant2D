const crypto = require('crypto');
const { promisify } = require('util');
const { OAuth2Client } = require('google-auth-library');
const Session = require('../models/Session');
const User = require('../models/User');
const RecoveryChallenge = require('../models/RecoveryChallenge');
const { securityAudit } = require('../utils/securityAudit');

const scryptAsync = promisify(crypto.scrypt);
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;
const MINIMUM_PASSWORD_LENGTH = 8;
const MAXIMUM_PASSWORD_LENGTH = 72;
const DUMMY_SECRET_HASH = 'scrypt:00000000000000000000000000000000:ece03d28a43ca02d59faa435d4c165215dd2112d18e68750be9c6253c339608ff38bcf5e4a384b0ed5fd01e56f89b5917197dec545d45d22a666e65960fe37c5';
const SECURITY_QUESTIONS = new Set([
  'Qual sua cor favorita?',
  'Qual o nome do seu primeiro animal de estimação?',
  'Em qual cidade você nasceu?',
  'Qual era seu apelido de infância?',
]);
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim()
  || '505204049055-coi0pepsfsfeqp20kdq96uel3gt8aqh9.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

function normalizeUsername(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email || null,
    accountProvider: user.auth_provider || 'local',
    avatarUrl: user.avatar_url || null,
    coreBalance: Number(user.core_balance) || 0,
    coreEarnedTotal: Number(user.core_earned_total) || 0,
    isAdmin: Boolean(user.is_admin),
    onboardingCompleted: Boolean(user.onboarding_completed),
    menuTourCompleted: Boolean(user.menu_tour_completed),
    createdAt: user.data_criacao,
  };
}

function googleUsernameCandidate(payload) {
  const source = String(payload?.name || payload?.given_name || payload?.email?.split('@')[0] || 'Agente');
  let normalized = source
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 20);
  if (normalized.length < 3) normalized = `Agente_${normalized || 'Google'}`.slice(0, 20);
  if (normalized.toLowerCase() === 'admin') normalized = 'Agente_Admin';
  return normalized;
}

function trustedGoogleAvatar(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

async function uniqueGoogleUsername(payload) {
  const base = googleUsernameCandidate(payload);
  if (!await User.findByUsername(base)) return base;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = crypto.randomInt(1000, 10000).toString();
    const candidate = `${base.slice(0, 19)}_${suffix}`.slice(0, 24);
    if (!await User.findByUsername(candidate)) return candidate;
  }
  return `Agente_${crypto.randomBytes(7).toString('hex')}`.slice(0, 24);
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
  return '';
}

async function register(request, response, next) {
  try {
    const username = normalizeUsername(request.body?.username);
    const password = request.body?.password;
    const securityQuestion = typeof request.body?.securityQuestion === 'string'
      ? request.body.securityQuestion.trim()
      : '';
    const rawSecurityAnswer = normalizeSecurityAnswer(request.body?.securityAnswer);
    const securityAnswer = rawSecurityAnswer.slice(0, 100);
    const validationError = validateCredentials(username, password);

    if (validationError) {
      response.status(400).json({ error: validationError, code: 'INVALID_CREDENTIALS' });
      return;
    }

    // A conta administrativa legada já existe no banco. Reservar seu nome
    // impede que ele seja reivindicado pelo cadastro público em uma instalação
    // nova antes da configuração do administrador no PostgreSQL.
    if (username.toLocaleLowerCase('pt-BR') === 'admin') {
      response.status(403).json({
        error: 'Este nome de usuário não está disponível.',
        code: 'USERNAME_RESERVED',
      });
      return;
    }

    if (!SECURITY_QUESTIONS.has(securityQuestion) || securityAnswer.length < 2 || rawSecurityAnswer.length > 100) {
      response.status(400).json({
        error: 'Selecione uma pergunta e informe uma resposta de segurança válida.',
        code: 'INVALID_SECURITY_ANSWER',
      });
      return;
    }

    if (await User.findByUsername(username)) {
      response.status(409).json({ error: 'Este nome de usuário já está em uso.', code: 'USERNAME_IN_USE' });
      return;
    }

    const passwordHash = await hashSecret(password);
    const securityAnswerHash = await hashSecret(securityAnswer);
    let user;

    try {
      user = await User.create(username, passwordHash, securityQuestion, securityAnswerHash);
    } catch (error) {
      // Protege também contra cadastros simultâneos com o mesmo nome.
      if (error.code === '23505') {
        response.status(409).json({ error: 'Este nome de usuário já está em uso.', code: 'USERNAME_IN_USE' });
        return;
      }
      throw error;
    }

    const session = await Session.create(user.id);
    securityAudit('register', request, { username, success: true });
    response.status(201).json({
      message: 'Conta criada com sucesso.',
      token: session.token,
      expiresAt: session.expirationDate,
      user: publicUser(user),
    });
  } catch (error) {
    securityAudit('register', request, { username: request.body?.username, success: false });
    next(error);
  }
}

async function login(request, response, next) {
  try {
    const username = normalizeUsername(request.body?.username);
    const password = request.body?.password;

    if (!username || typeof password !== 'string' || password.length > MAXIMUM_PASSWORD_LENGTH) {
      response.status(400).json({ error: 'Informe o usuário e a senha.', code: 'MISSING_CREDENTIALS' });
      return;
    }

    const user = USERNAME_PATTERN.test(username) ? await User.findByUsername(username) : undefined;
    const locked = user?.bloqueado_ate && new Date(user.bloqueado_ate).getTime() > Date.now();
    const passwordMatches = await verifySecret(password, user?.senha_hash || DUMMY_SECRET_HASH);

    if (!passwordMatches || locked) {
      if (user && !locked) await User.registerFailedLogin(user.id);
      securityAudit('login', request, { username, success: false });
      // A mensagem única evita revelar quais nomes estão cadastrados.
      response.status(401).json({ error: 'Usuário ou senha incorretos.', code: 'INVALID_LOGIN' });
      return;
    }

    await User.clearFailedLogins(user.id);
    const session = await Session.create(user.id);
    securityAudit('login', request, { userId: user.id, success: true });
    response.status(200).json({
      message: 'Login realizado com sucesso.',
      token: session.token,
      expiresAt: session.expirationDate,
      user: publicUser(user),
    });
  } catch (error) {
    securityAudit('login_error', request, { username: request.body?.username, success: false });
    next(error);
  }
}

/**
 * Valida o ID token diretamente com o Google e só então cria ou localiza a
 * conta. O token recebido do navegador nunca é tratado como dado confiável.
 */
async function googleLogin(request, response, next) {
  try {
    const idToken = typeof request.body?.idToken === 'string' ? request.body.idToken.trim() : '';
    if (idToken.length < 100 || idToken.length > 12000) {
      response.status(400).json({ error: 'Credencial do Google inválida.', code: 'INVALID_GOOGLE_CREDENTIAL' });
      return;
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } catch {
      securityAudit('google_login', request, { success: false });
      response.status(401).json({ error: 'Não foi possível validar sua conta Google.', code: 'INVALID_GOOGLE_TOKEN' });
      return;
    }

    const googleSub = typeof payload?.sub === 'string' ? payload.sub : '';
    const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
    if (!googleSub || googleSub.length > 128 || !payload?.email_verified
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
      response.status(401).json({ error: 'A conta Google não possui um e-mail verificado.', code: 'UNVERIFIED_GOOGLE_EMAIL' });
      return;
    }

    const avatarUrl = trustedGoogleAvatar(payload.picture);
    // O e-mail verificado é a primeira chave de reconciliação. Assim, uma
    // conta local preexistente (incluindo Admin) recebe a identidade Google em
    // vez de originar um segundo usuário.
    const existingEmail = await User.findByEmail(email);
    let user;
    if (existingEmail) {
      if (existingEmail.google_sub && existingEmail.google_sub !== googleSub) {
        securityAudit('google_login_identity_conflict', request, { userId: existingEmail.id, success: false });
        response.status(409).json({ error: 'Este e-mail já está vinculado a outra identidade.', code: 'GOOGLE_IDENTITY_CONFLICT' });
        return;
      }
      user = await User.linkGoogleIdentity(existingEmail.id, { email, googleSub, avatarUrl });
    } else {
      const existingGoogleIdentity = await User.findByGoogleSub(googleSub);
      if (existingGoogleIdentity) {
        user = await User.refreshGoogleProfile(existingGoogleIdentity.id, { email, avatarUrl });
      } else {
        const username = await uniqueGoogleUsername(payload);
        try {
          user = await User.createGoogle({
            username,
            email,
            googleSub,
            avatarUrl,
            passwordSentinel: `google-only:${crypto.randomBytes(48).toString('hex')}`,
          });
        } catch (error) {
          // Uma autenticação simultânea pode ter criado a identidade entre a
          // consulta e o INSERT. Nesse caso, reutilizamos a conta já validada.
          if (error.code !== '23505') throw error;
          user = await User.findByEmail(email) || await User.findByGoogleSub(googleSub);
          if (!user) throw error;
        }
      }
    }

    if (!user) {
      response.status(409).json({ error: 'Não foi possível vincular a conta Google.', code: 'GOOGLE_LINK_FAILED' });
      return;
    }

    const session = await Session.create(user.id);
    securityAudit('google_login', request, { userId: user.id, success: true });
    response.status(200).json({
      message: 'Login com Google realizado com sucesso.',
      token: session.token,
      expiresAt: session.expirationDate,
      user: publicUser(user),
    });
  } catch (error) {
    securityAudit('google_login_error', request, { success: false });
    if (error.code === '23505') {
      response.status(409).json({
        error: 'Esta identidade Google já está vinculada a outra conta.',
        code: 'GOOGLE_IDENTITY_CONFLICT',
      });
      return;
    }
    next(error);
  }
}

async function getSecurityQuestion(request, response, next) {
  try {
    const username = normalizeUsername(request.body?.username);
    const user = USERNAME_PATTERN.test(username) ? await User.findByUsername(username) : undefined;
    const questions = [...SECURITY_QUESTIONS];
    const fakeIndex = crypto.createHash('sha256').update(username || 'anonymous').digest()[0] % questions.length;
    const challengeToken = user?.pergunta_seguranca && user?.resposta_seguranca
      ? await RecoveryChallenge.create(user.id)
      : crypto.randomBytes(32).toString('hex');

    // A resposta tem o mesmo formato para contas existentes e inexistentes.
    response.status(200).json({
      securityQuestion: user?.pergunta_seguranca || questions[fakeIndex],
      recoveryToken: challengeToken,
      expiresInSeconds: 600,
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(request, response, next) {
  try {
    const recoveryToken = typeof request.body?.recoveryToken === 'string' ? request.body.recoveryToken.trim() : '';
    const rawSecurityAnswer = normalizeSecurityAnswer(request.body?.securityAnswer);
    const securityAnswer = rawSecurityAnswer.slice(0, 100);
    const newPassword = request.body?.newPassword;
    const challenge = await RecoveryChallenge.findValid(recoveryToken);

    const answerMatches = await verifySecret(
      securityAnswer || 'invalid-answer',
      challenge?.resposta_seguranca || DUMMY_SECRET_HASH,
    );
    if (!challenge || rawSecurityAnswer.length > 100 || !answerMatches) {
      if (challenge) await RecoveryChallenge.registerFailure(challenge.id);
      securityAudit('password_reset', request, { userId: challenge?.user_id, success: false });
      response.status(401).json({
        error: 'Não foi possível validar a recuperação.',
        code: 'INVALID_RECOVERY_CHALLENGE',
      });
      return;
    }

    const passwordError = validateCredentials(challenge.username, newPassword);
    if (passwordError) {
      response.status(400).json({ error: passwordError, code: 'INVALID_PASSWORD' });
      return;
    }

    const consumed = await RecoveryChallenge.consume(challenge.id);
    if (consumed.changes !== 1) {
      response.status(409).json({ error: 'Este desafio já foi utilizado.', code: 'RECOVERY_ALREADY_USED' });
      return;
    }
    await User.updatePassword(challenge.user_id, await hashSecret(newPassword));
    await User.clearFailedLogins(challenge.user_id);
    await Session.revokeAllForUser(challenge.user_id);
    securityAudit('password_reset', request, { userId: challenge.user_id, success: true });
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

module.exports = {
  getSecurityQuestion,
  googleLogin,
  login,
  logout,
  register,
  resetPassword,
  verify,
  _test: {
    googleClient,
    googleUsernameCandidate,
    hashSecret,
    normalizeSecurityAnswer,
    publicUser,
    trustedGoogleAvatar,
    validateCredentials,
    verifySecret,
  },
};
