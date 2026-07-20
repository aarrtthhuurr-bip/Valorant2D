const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@127.0.0.1:5432/test';

const { app } = require('../index');
const { createLimiter } = require('../middleware/security');
const { _test: authSecurity } = require('../controllers/authController');
const RecoveryChallenge = require('../models/RecoveryChallenge');
const Session = require('../models/Session');
const User = require('../models/User');
const MatchSubmission = require('../models/MatchSubmission');
const Statistic = require('../models/Statistic');
const Leaderboard = require('../models/Leaderboard');
const PlayerProfile = require('../models/PlayerProfile');
const database = require('../config/database');

test('health check aplica headers de segurança e identificador', async () => {
  const response = await request(app).get('/').expect(200);
  assert.equal(response.headers['x-powered-by'], undefined);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.match(response.headers['content-security-policy'], /default-src 'none'/);
  assert.match(response.headers['x-request-id'], /^[a-zA-Z0-9-]{8,80}$/);
});

test('CORS permite o GitHub Pages e rejeita origem desconhecida', async () => {
  await request(app)
    .get('/')
    .set('Origin', 'https://aarrtthhuurr-bip.github.io')
    .expect('Access-Control-Allow-Origin', 'https://aarrtthhuurr-bip.github.io')
    .expect(200);

  const rejected = await request(app).get('/').set('Origin', 'https://malicioso.example').expect(403);
  assert.equal(rejected.body.erro, 'Origem não permitida pela política de CORS.');
});

test('API exige JSON e rejeita JSON malformado', async () => {
  const wrongType = await request(app).post('/api/login').type('text').send('x').expect(415);
  assert.equal(wrongType.body.code, 'JSON_REQUIRED');

  const malformed = await request(app)
    .post('/api/login')
    .set('Content-Type', 'application/json')
    .send('{"username":')
    .expect(400);
  assert.equal(malformed.body.erro, 'JSON inválido.');
});

test('respostas da API não podem ser armazenadas em cache', async () => {
  const response = await request(app)
    .post('/api/verify')
    .set('Content-Type', 'application/json')
    .send({})
    .expect(401);
  assert.match(response.headers['cache-control'], /no-store/);
  assert.equal(response.headers.pragma, 'no-cache');
});

test('corpos acima de 32 KB são recusados', async () => {
  const response = await request(app)
    .post('/api/login')
    .set('Content-Type', 'application/json')
    .send({ username: 'usuario', password: 'x'.repeat(40000) })
    .expect(413);
  assert.match(response.body.erro, /excede o limite/i);
});

test('rate limiter bloqueia rajadas acima do limite', async () => {
  const limitedApp = express();
  limitedApp.use(createLimiter({ windowMs: 60000, limit: 3 }));
  limitedApp.get('/', (_request, response) => response.json({ ok: true }));

  await request(limitedApp).get('/').expect(200);
  await request(limitedApp).get('/').expect(200);
  await request(limitedApp).get('/').expect(200);
  const blocked = await request(limitedApp).get('/').expect(429);
  assert.equal(blocked.body.code, 'RATE_LIMITED');
});

test('senhas usam salt individual e comparação segura', async () => {
  const first = await authSecurity.hashSecret('senha-forte-123');
  const second = await authSecurity.hashSecret('senha-forte-123');
  assert.notEqual(first, second);
  assert.equal(await authSecurity.verifySecret('senha-forte-123', first), true);
  assert.equal(await authSecurity.verifySecret('senha-incorreta', first), false);
});

test('credenciais e respostas de segurança são normalizadas e limitadas', () => {
  assert.equal(authSecurity.validateCredentials('usuario_1', 'senha-forte-123'), null);
  assert.match(authSecurity.validateCredentials("x' OR 1=1--", 'senha-forte-123'), /usuário/i);
  assert.match(authSecurity.validateCredentials('usuario_1', 'x'.repeat(73)), /senha/i);
  assert.equal(authSecurity.normalizeSecurityAnswer('  AÇUL  '), 'açul');
  const newPlayer = authSecurity.publicUser({
    id: 1,
    username: 'novato',
    onboarding_completed: false,
    menu_tour_completed: false,
  });
  assert.equal(newPlayer.onboardingCompleted, false);
  assert.equal(newPlayer.menuTourCompleted, false);
});

test('login Google valida o ID token e cria conta sem saldo inicial', async () => {
  const originals = {
    verifyIdToken: authSecurity.googleClient.verifyIdToken,
    findByGoogleSub: User.findByGoogleSub,
    findByEmail: User.findByEmail,
    findByUsername: User.findByUsername,
    createGoogle: User.createGoogle,
    sessionCreate: Session.create,
  };
  let created;
  authSecurity.googleClient.verifyIdToken = async () => ({
    getPayload: () => ({
      sub: 'google-sub-123',
      email: 'agente@example.com',
      email_verified: true,
      name: 'Agente Google',
      picture: 'https://lh3.googleusercontent.com/avatar',
    }),
  });
  User.findByGoogleSub = async () => undefined;
  User.findByEmail = async () => undefined;
  User.findByUsername = async () => undefined;
  User.createGoogle = async (data) => {
    created = data;
    return {
      id: 41,
      username: data.username,
      email: data.email,
      auth_provider: 'google',
      core_balance: 0,
      core_earned_total: 0,
      onboarding_completed: false,
      menu_tour_completed: false,
    };
  };
  Session.create = async () => ({ token: 'f'.repeat(64), expirationDate: new Date().toISOString() });

  try {
    const response = await request(app)
      .post('/api/auth/google')
      .set('Content-Type', 'application/json')
      .send({ idToken: 'g'.repeat(200) })
      .expect(200);
    assert.equal(created.email, 'agente@example.com');
    assert.equal(created.googleSub, 'google-sub-123');
    assert.match(created.passwordSentinel, /^google-only:/);
    assert.equal(response.body.user.coreBalance, 0);
    assert.equal(response.body.user.accountProvider, 'google');
    assert.equal(response.body.token, 'f'.repeat(64));
  } finally {
    authSecurity.googleClient.verifyIdToken = originals.verifyIdToken;
    User.findByGoogleSub = originals.findByGoogleSub;
    User.findByEmail = originals.findByEmail;
    User.findByUsername = originals.findByUsername;
    User.createGoogle = originals.createGoogle;
    Session.create = originals.sessionCreate;
  }
});

test('login Google prioriza o e-mail e vincula a identidade à conta Admin existente', async () => {
  const originals = {
    verifyIdToken: authSecurity.googleClient.verifyIdToken,
    findByGoogleSub: User.findByGoogleSub,
    findByEmail: User.findByEmail,
    linkGoogleIdentity: User.linkGoogleIdentity,
    createGoogle: User.createGoogle,
    sessionCreate: Session.create,
  };
  const adminEmail = 'arthurdealmeida124@gmail.com';
  let linkedIdentity;
  let googleSubLookups = 0;
  let createdAccounts = 0;

  authSecurity.googleClient.verifyIdToken = async () => ({
    getPayload: () => ({
      sub: 'google-admin-sub-456',
      email: adminEmail,
      email_verified: true,
      name: 'Arthur A',
      picture: 'https://lh3.googleusercontent.com/admin-avatar',
    }),
  });
  User.findByEmail = async (email) => ({
    id: 1,
    username: 'Admin',
    email,
    google_sub: null,
    auth_provider: 'local',
    is_admin: true,
    core_balance: 300,
    core_earned_total: 0,
    onboarding_completed: true,
    menu_tour_completed: true,
  });
  User.findByGoogleSub = async () => {
    googleSubLookups += 1;
    return undefined;
  };
  User.linkGoogleIdentity = async (id, identity) => {
    linkedIdentity = { id, ...identity };
    return {
      id,
      username: 'Admin',
      email: identity.email,
      google_sub: identity.googleSub,
      auth_provider: 'local+google',
      avatar_url: identity.avatarUrl,
      is_admin: true,
      core_balance: 300,
      core_earned_total: 0,
      onboarding_completed: true,
      menu_tour_completed: true,
    };
  };
  User.createGoogle = async () => {
    createdAccounts += 1;
    return undefined;
  };
  Session.create = async () => ({ token: 'e'.repeat(64), expirationDate: new Date().toISOString() });

  try {
    const response = await request(app)
      .post('/api/auth/google')
      .set('Content-Type', 'application/json')
      .send({ idToken: 'g'.repeat(200) })
      .expect(200);

    assert.equal(linkedIdentity.id, 1);
    assert.equal(linkedIdentity.email, adminEmail);
    assert.equal(linkedIdentity.googleSub, 'google-admin-sub-456');
    assert.equal(googleSubLookups, 0);
    assert.equal(createdAccounts, 0);
    assert.equal(response.body.user.username, 'Admin');
    assert.equal(response.body.user.isAdmin, true);
    assert.equal(response.body.user.accountProvider, 'local+google');
  } finally {
    authSecurity.googleClient.verifyIdToken = originals.verifyIdToken;
    User.findByGoogleSub = originals.findByGoogleSub;
    User.findByEmail = originals.findByEmail;
    User.linkGoogleIdentity = originals.linkGoogleIdentity;
    User.createGoogle = originals.createGoogle;
    Session.create = originals.sessionCreate;
  }
});

test('perfil consolidado exige sessão e mantém estatísticas separadas por modo', async () => {
  const originals = { session: Session.findValid, profile: PlayerProfile.findByUserId };
  try {
    Session.findValid = async () => undefined;
    await request(app).get('/api/profile').expect(401);

    Session.findValid = async () => ({ id: 9, username: 'agente_perfil' });
    PlayerProfile.findByUserId = async () => ({
      id: 9,
      username: 'agente_perfil',
      email: 'perfil@example.com',
      coreEarnedTotal: 180,
      statistics: {
        totals: { matches: 16, kills: 56, deaths: 14, kd: 4 },
        default: { matches: 8, wins: 5, kills: 27, deaths: 9, kd: 3 },
        blackout: { matches: 3, wins: 1, kills: 8 },
        outbreak: { highestWave: 14 },
      },
    });
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .expect(200);
    assert.equal(response.body.profile.statistics.default.wins, 5);
    assert.equal(response.body.profile.statistics.totals.matches, 16);
    assert.equal(response.body.profile.statistics.totals.kd, 4);
    assert.equal(response.body.profile.statistics.outbreak.highestWave, 14);
    assert.equal(response.body.profile.coreEarnedTotal, 180);
  } finally {
    Session.findValid = originals.session;
    PlayerProfile.findByUserId = originals.profile;
  }
});

test('modelo de perfil calcula partidas, kills e K/D totais', async () => {
  const originalGet = database.get;
  database.get = async () => ({
    id: 5,
    username: 'perfil_total',
    total_matches: 20,
    total_kills: 75,
    total_deaths: 25,
    wins_default: 7,
    wins_blackout: 3,
    highest_wave_outbreak: 19,
  });
  try {
    const profile = await PlayerProfile.findByUserId(5);
    assert.equal(profile.statistics.totals.matches, 20);
    assert.equal(profile.statistics.totals.kills, 75);
    assert.equal(profile.statistics.totals.kd, 3);
    assert.equal(profile.statistics.default.wins, 7);
    assert.equal(profile.statistics.outbreak.highestWave, 19);
  } finally {
    database.get = originalGet;
  }
});

test('ranking usa vitórias no competitivo e maior wave no Outbreak', () => {
  assert.equal(Leaderboard._test.rankingConfiguration('default').metric, 'wins_default');
  assert.equal(Leaderboard._test.rankingConfiguration('blackout').metric, 'wins_blackout');
  assert.equal(Leaderboard._test.rankingConfiguration('outbreak').metric, 'highest_wave_outbreak');
  assert.equal(Leaderboard._test.rankingConfiguration('desconhecido'), null);
});

test('nome da conta administrativa não pode ser reivindicado pelo cadastro público', async () => {
  const response = await request(app)
    .post('/api/register')
    .set('Content-Type', 'application/json')
    .send({
      username: 'Admin',
      password: 'senha-forte-123',
      securityQuestion: 'Qual sua cor favorita?',
      securityAnswer: 'azul',
    })
    .expect(403);
  assert.equal(response.body.code, 'USERNAME_RESERVED');
});

test('progresso da apresentação é atualizado apenas para a sessão autenticada', async () => {
  const originalSession = Session.findValid;
  const originalComplete = User.completeOnboarding;
  let saved;
  User.completeOnboarding = async (userId, state) => {
    saved = { userId, ...state };
    return { onboarding_completed: true, menu_tour_completed: false };
  };
  try {
    Session.findValid = async () => undefined;
    const unauthorized = await request(app)
      .put('/api/onboarding')
      .set('Authorization', `Bearer ${'d'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({ welcomeCompleted: true })
      .expect(401);
    assert.equal(unauthorized.body.code, 'INVALID_SESSION');

    Session.findValid = async () => ({ id: 14, username: 'novato' });
    const response = await request(app)
      .put('/api/onboarding')
      .set('Authorization', `Bearer ${'e'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({ welcomeCompleted: true })
      .expect(200);
    assert.deepEqual(saved, { userId: 14, welcomeCompleted: true, menuTourCompleted: false });
    assert.equal(response.body.onboardingCompleted, true);
    assert.equal(response.body.menuTourCompleted, false);

    const invalid = await request(app)
      .put('/api/onboarding')
      .set('Authorization', `Bearer ${'e'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({ welcomeCompleted: false })
      .expect(400);
    assert.equal(invalid.body.code, 'INVALID_ONBOARDING_STEP');
  } finally {
    Session.findValid = originalSession;
    User.completeOnboarding = originalComplete;
  }
});

test('login malicioso recebe resposta genérica sem consultar username inválido', async () => {
  const originalFind = User.findByUsername;
  let queried = false;
  User.findByUsername = async () => { queried = true; return undefined; };
  try {
    const response = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send({ username: "x' OR 1=1--", password: 'senha-forte-123' })
      .expect(401);
    assert.equal(response.body.code, 'INVALID_LOGIN');
    assert.equal(queried, false);
  } finally {
    User.findByUsername = originalFind;
  }
});

test('recuperação inexistente mantém formato uniforme e token descartável', async () => {
  const originalFind = User.findByUsername;
  const originalChallengeFind = RecoveryChallenge.findValid;
  User.findByUsername = async () => undefined;
  RecoveryChallenge.findValid = async () => undefined;
  try {
    const question = await request(app)
      .post('/api/security-question')
      .set('Content-Type', 'application/json')
      .send({ username: 'conta_inexistente' })
      .expect(200);
    assert.equal(typeof question.body.securityQuestion, 'string');
    assert.match(question.body.recoveryToken, /^[a-f0-9]{64}$/);

    const reset = await request(app)
      .post('/api/reset-password')
      .set('Content-Type', 'application/json')
      .send({ recoveryToken: question.body.recoveryToken, securityAnswer: 'x', newPassword: 'senha-nova-123' })
      .expect(401);
    assert.equal(reset.body.code, 'INVALID_RECOVERY_CHALLENGE');
  } finally {
    User.findByUsername = originalFind;
    RecoveryChallenge.findValid = originalChallengeFind;
  }
});

test('desafio válido redefine a senha uma única vez e revoga sessões', async () => {
  const answerHash = await authSecurity.hashSecret('azul');
  const originals = {
    findValid: RecoveryChallenge.findValid,
    consume: RecoveryChallenge.consume,
    updatePassword: User.updatePassword,
    clearFailedLogins: User.clearFailedLogins,
    revokeAllForUser: Session.revokeAllForUser,
  };
  let passwordUpdated = false;
  let sessionsRevoked = false;
  RecoveryChallenge.findValid = async () => ({
    id: 7,
    user_id: 11,
    username: 'usuario_teste',
    resposta_seguranca: answerHash,
  });
  RecoveryChallenge.consume = async () => ({ changes: 1 });
  User.updatePassword = async (_id, hash) => { passwordUpdated = hash.startsWith('scrypt:'); };
  User.clearFailedLogins = async () => ({ changes: 1 });
  Session.revokeAllForUser = async () => { sessionsRevoked = true; };
  try {
    await request(app)
      .post('/api/reset-password')
      .set('Content-Type', 'application/json')
      .send({ recoveryToken: 'a'.repeat(64), securityAnswer: 'Azul', newPassword: 'senha-nova-123' })
      .expect(200);
    assert.equal(passwordUpdated, true);
    assert.equal(sessionsRevoked, true);
  } finally {
    RecoveryChallenge.findValid = originals.findValid;
    RecoveryChallenge.consume = originals.consume;
    User.updatePassword = originals.updatePassword;
    User.clearFailedLogins = originals.clearFailedLogins;
    Session.revokeAllForUser = originals.revokeAllForUser;
  }
});

test('estatísticas exigem comprovante plausível e de uso único', async () => {
  const originals = {
    session: Session.findValid,
    match: MatchSubmission.findValid,
    consume: MatchSubmission.consume,
    record: Statistic.recordMatch,
  };
  Session.findValid = async () => ({ id: 3, username: 'usuario_teste' });
  MatchSubmission.findValid = async () => ({ id: 9, duracao_segundos: 60, modo: 'default' });
  MatchSubmission.consume = async () => ({ changes: 1 });
  Statistic.recordMatch = async () => ({ partidas_jogadas: 1, vitorias: 1, abates_totais: 8, pontuacao_maxima: 1800 });
  try {
    const accepted = await request(app)
      .post('/api/statistics/match')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({ matchToken: 'b'.repeat(64), victory: true, kills: 8, score: 1800 })
      .expect(200);
    assert.equal(accepted.body.statistics.partidas_jogadas, 1);

    MatchSubmission.consume = async () => ({ changes: 0 });
    const replay = await request(app)
      .post('/api/statistics/match')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({ matchToken: 'b'.repeat(64), victory: true, kills: 8, score: 1800 })
      .expect(409);
    assert.equal(replay.body.code, 'MATCH_ALREADY_RECORDED');
  } finally {
    Session.findValid = originals.session;
    MatchSubmission.findValid = originals.match;
    MatchSubmission.consume = originals.consume;
    Statistic.recordMatch = originals.record;
  }
});

test('leaderboard lista modo válido e rejeita filtros desconhecidos', async () => {
  const originalList = Leaderboard.listByMode;
  Leaderboard.listByMode = async (mode, limit) => [{
    id: 1,
    player_name: 'usuario_teste',
    score: 2500,
    max_wave: mode === 'outbreak' ? 7 : 0,
    game_mode: mode,
    created_at: new Date().toISOString(),
    limit,
  }];
  try {
    const response = await request(app).get('/api/leaderboard?mode=default').expect(200);
    assert.equal(response.body.gameMode, 'default');
    assert.equal(response.body.limit, 50);
    assert.equal(response.body.leaderboard.length, 1);
    assert.equal(response.body.leaderboard[0].player_name, 'usuario_teste');
    assert.equal(response.body.leaderboard[0].limit, 50);

    const invalid = await request(app).get('/api/leaderboard/modo-inexistente').expect(400);
    assert.equal(invalid.body.code, 'INVALID_GAME_MODE');
  } finally {
    Leaderboard.listByMode = originalList;
  }
});

test('leaderboard autenticada retorna estatísticas pessoais do modo selecionado', async () => {
  const originals = {
    session: Session.findValid,
    list: Leaderboard.listByMode,
    personal: Leaderboard.personalStats,
  };
  let requestedUserId;
  let requestedMode;
  Session.findValid = async () => ({ id: 7, username: 'agente_teste' });
  Leaderboard.listByMode = async () => [];
  Leaderboard.personalStats = async (userId, mode) => {
    requestedUserId = userId;
    requestedMode = mode;
    return {
      total_matches: 4,
      personal_best: 9200,
      average_score: 6100,
      personal_max_wave: 12,
      global_position: 3,
      account_total_matches: 18,
      account_total_wins: 11,
      account_total_kills: 147,
      last_played_at: new Date().toISOString(),
    };
  };
  try {
    const response = await request(app)
      .get('/api/leaderboard?mode=outbreak')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .expect(200);

    assert.equal(requestedUserId, 7);
    assert.equal(requestedMode, 'outbreak');
    assert.equal(response.body.playerStats.player_name, 'agente_teste');
    assert.equal(response.body.playerStats.personal_best, 9200);
    assert.equal(response.body.playerStats.global_position, 3);
    assert.equal(response.body.playerStats.personal_max_wave, 12);
    assert.equal(response.body.playerStats.account_total_matches, 18);
    assert.equal(response.body.playerStats.account_total_wins, 11);
    assert.equal(response.body.currentPlayer.rank_position, 3);
    assert.equal(response.body.currentPlayer.ranking_value, 0);
    assert.equal(response.body.currentPlayer.is_top_50, false);
  } finally {
    Session.findValid = originals.session;
    Leaderboard.listByMode = originals.list;
    Leaderboard.personalStats = originals.personal;
  }
});

test('leaderboard salva pontuação autenticada com comprovante e nome da sessão', async () => {
  const originals = {
    session: Session.findValid,
    match: MatchSubmission.findValid,
    record: Leaderboard.recordCompletedMatch,
  };
  let recordedPayload;
  Session.findValid = async () => ({ id: 3, username: 'usuario_teste' });
  MatchSubmission.findValid = async () => ({ id: 17, duracao_segundos: 90, modo: 'default' });
  Leaderboard.recordCompletedMatch = async (payload) => {
    recordedPayload = payload;
    return {
      entry: { id: 8, player_name: payload.playerName, score: payload.score, game_mode: payload.gameMode },
      statistics: { partidas_jogadas: 1, vitorias: 1, abates_totais: 8, pontuacao_maxima: 1800 },
      coreReward: payload.gameMode === 'blackout' ? 14 : payload.gameMode === 'outbreak' ? payload.maxWave : 9,
      coreBalance: 309,
    };
  };
  try {
    const accepted = await request(app)
      .post('/api/leaderboard/save')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({
        player_name: 'nome_falsificado',
        matchToken: 'b'.repeat(64),
        game_mode: 'default',
        victory: true,
        kills: 8,
        score: 1800,
      })
      .expect(201);
    assert.equal(recordedPayload.playerName, 'usuario_teste');
    assert.equal(accepted.body.entry.player_name, 'usuario_teste');
    assert.equal(accepted.body.coreReward, 9);

    MatchSubmission.findValid = async () => ({ id: 18, duracao_segundos: 90, modo: 'blackout' });
    const mismatchedMode = await request(app)
      .post('/api/leaderboard/save')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({ matchToken: 'c'.repeat(64), game_mode: 'default', victory: true, kills: 8, score: 1800 })
      .expect(400);
    assert.equal(mismatchedMode.body.code, 'INVALID_LEADERBOARD_SCORE');

    MatchSubmission.findValid = async () => ({ id: 19, duracao_segundos: 90, modo: 'outbreak' });
    const outbreak = await request(app)
      .post('/api/leaderboard/save')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({
        matchToken: 'd'.repeat(64),
        game_mode: 'outbreak',
        victory: false,
        kills: 3,
        wave: 12,
        survival_seconds: 45,
        score: 12345,
      })
      .expect(201);
    assert.equal(recordedPayload.maxWave, 12);
    assert.equal(outbreak.body.entry.game_mode, 'outbreak');
  } finally {
    Session.findValid = originals.session;
    MatchSubmission.findValid = originals.match;
    Leaderboard.recordCompletedMatch = originals.record;
  }
});

test('repetição do envio devolve o resultado anterior sem premiar novamente', async () => {
  const originals = {
    session: Session.findValid,
    match: MatchSubmission.findValid,
    recorded: Leaderboard.findRecordedMatch,
    record: Leaderboard.recordCompletedMatch,
  };
  let newRecordCalls = 0;
  Session.findValid = async () => ({ id: 3, username: 'usuario_teste' });
  MatchSubmission.findValid = async () => ({
    id: 27,
    modo: 'outbreak',
    duracao_segundos: 90,
    utilizado_em: new Date().toISOString(),
  });
  Leaderboard.findRecordedMatch = async () => ({
    entry: {
      id: 12,
      player_name: 'usuario_teste',
      score: 12345,
      max_wave: 12,
      victory: false,
      kills: 3,
      deaths: 1,
      core_reward: 12,
      game_mode: 'outbreak',
    },
    statistics: { total_matches: 4 },
    coreReward: 12,
    coreBalance: 321,
    alreadyRecorded: true,
  });
  Leaderboard.recordCompletedMatch = async () => {
    newRecordCalls += 1;
    throw new Error('Não deveria criar outro registro.');
  };

  try {
    const response = await request(app)
      .post('/api/leaderboard/save')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({
        matchToken: 'e'.repeat(64),
        game_mode: 'outbreak',
        victory: false,
        kills: 3,
        deaths: 1,
        wave: 12,
        survival_seconds: 45,
        score: 12345,
      })
      .expect(200);

    assert.equal(response.body.alreadyRecorded, true);
    assert.equal(response.body.coreReward, 12);
    assert.equal(response.body.coreBalance, 321);
    assert.equal(newRecordCalls, 0);
  } finally {
    Session.findValid = originals.session;
    MatchSubmission.findValid = originals.match;
    Leaderboard.findRecordedMatch = originals.recorded;
    Leaderboard.recordCompletedMatch = originals.record;
  }
});

test('recompensa Core respeita as faixas de cada modo e as waves do Outbreak', () => {
  const reward = Leaderboard._test.coreRewardForMatch;
  assert.equal(reward('default', 0, (minimum) => minimum), 5);
  assert.equal(reward('default', 0, (_minimum, maximum) => maximum - 1), 15);
  assert.equal(reward('blackout', 0, (minimum) => minimum), 10);
  assert.equal(reward('blackout', 0, (_minimum, maximum) => maximum - 1), 20);
  assert.equal(reward('outbreak', 17), 17);
});
