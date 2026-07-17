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
    game_mode: mode,
    created_at: new Date().toISOString(),
    limit,
  }];
  try {
    const response = await request(app).get('/api/leaderboard/default').expect(200);
    assert.equal(response.body.gameMode, 'default');
    assert.equal(response.body.leaderboard.length, 1);
    assert.equal(response.body.leaderboard[0].player_name, 'usuario_teste');

    const invalid = await request(app).get('/api/leaderboard/modo-inexistente').expect(400);
    assert.equal(invalid.body.code, 'INVALID_GAME_MODE');
  } finally {
    Leaderboard.listByMode = originalList;
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

    MatchSubmission.findValid = async () => ({ id: 18, duracao_segundos: 90, modo: 'blackout' });
    const mismatchedMode = await request(app)
      .post('/api/leaderboard/save')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .set('Content-Type', 'application/json')
      .send({ matchToken: 'c'.repeat(64), game_mode: 'default', victory: true, kills: 8, score: 1800 })
      .expect(400);
    assert.equal(mismatchedMode.body.code, 'INVALID_LEADERBOARD_SCORE');
  } finally {
    Session.findValid = originals.session;
    MatchSubmission.findValid = originals.match;
    Leaderboard.recordCompletedMatch = originals.record;
  }
});
