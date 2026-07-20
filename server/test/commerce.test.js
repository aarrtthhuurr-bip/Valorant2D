const assert = require('node:assert/strict');
const test = require('node:test');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@127.0.0.1:5432/test';

const { SKIN_CATALOG, dailyOffers } = require('../data/skinCatalog');
const { DAILY_MISSIONS, missionsForUser } = require('../data/dailyMissions');
const { app } = require('../index');
const Commerce = require('../models/Commerce');
const Session = require('../models/Session');

test('catálogo contém skins únicas e respeita o teto de 240 Core', () => {
  assert.equal(SKIN_CATALOG.length, 40);
  assert.equal(new Set(SKIN_CATALOG.map((skin) => skin.id)).size, SKIN_CATALOG.length);
  assert.ok(SKIN_CATALOG.every((skin) => skin.price > 0 && skin.price <= 240));
});

test('ofertas permanecem estáveis no dia e sempre aplicam desconto', () => {
  const date = new Date('2026-07-19T12:00:00.000Z');
  const first = dailyOffers(date);
  const second = dailyOffers(date);
  assert.deepEqual(first, second);
  assert.equal(first.length, 4);
  assert.equal(new Set(first.map((skin) => skin.id)).size, 4);
  assert.ok(first.every((skin) => skin.price < skin.originalPrice));
});

test('banco de missões possui 30 objetivos em cada nível interno', () => {
  assert.equal(DAILY_MISSIONS.length, 90);
  for (const difficulty of ['easy', 'medium', 'hard']) {
    assert.equal(DAILY_MISSIONS.filter((mission) => mission.difficulty === difficulty).length, 30);
  }
  const daily = missionsForUser(7, new Date('2026-07-19T12:00:00.000Z'));
  assert.equal(daily.length, 3);
  assert.deepEqual(daily.map((mission) => mission.difficulty), ['easy', 'medium', 'hard']);
});

test('perfil comercial exige uma sessão válida', async () => {
  const original = Session.findValid;
  Session.findValid = async () => undefined;
  try {
    const response = await request(app).get('/api/commerce').expect(401);
    assert.equal(response.body.code, 'INVALID_SESSION');
  } finally {
    Session.findValid = original;
  }
});

test('API comercial entrega somente o saldo retornado pelo servidor', async () => {
  const originalSession = Session.findValid;
  const originalProfile = Commerce.profile;
  Session.findValid = async () => ({ id: 7, username: 'agente' });
  Commerce.profile = async () => ({
    coreBalance: 345,
    isAdmin: false,
    catalog: [],
    dailyOffers: [],
    ownedSkinIds: [],
    equippedSkins: {},
    missions: [],
    easterEggCodes: ['CODIGO_OCULTO'],
  });
  try {
    const response = await request(app)
      .get('/api/commerce')
      .set('Authorization', `Bearer ${'a'.repeat(64)}`)
      .expect(200);
    assert.equal(response.body.coreBalance, 345);
    assert.equal(response.body.isAdmin, false);
    assert.deepEqual(response.body.easterEggCodes, ['CODIGO_OCULTO']);
  } finally {
    Session.findValid = originalSession;
    Commerce.profile = originalProfile;
  }
});
