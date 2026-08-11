const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@127.0.0.1:5432/test';

const { SKIN_CATALOG, dailyOffers } = require('../data/skinCatalog');
const { DAILY_MISSIONS, missionsForUser } = require('../data/dailyMissions');
const { BLACK_MARKET_CATALOG, STARTER_GADGET_ID } = require('../data/blackMarketCatalog');
const { app } = require('../index');
const Commerce = require('../models/Commerce');
const Session = require('../models/Session');
const database = require('../config/database');

test('catálogo contém skins únicas e respeita o teto de 240 Core', () => {
  assert.equal(SKIN_CATALOG.length, 83);
  assert.equal(new Set(SKIN_CATALOG.map((skin) => skin.id)).size, SKIN_CATALOG.length);
  assert.ok(SKIN_CATALOG.every((skin) => skin.price > 0 && skin.price <= 240));
});

test('Black Market possui preços únicos, positivos e utilitário inicial válido', () => {
  assert.deepEqual(
    Object.fromEntries(BLACK_MARKET_CATALOG.map((item) => [item.id, item.price])),
    {
      pulseBomb: 45,
      cryoMine: 80,
      adrenaline: 95,
      decoyTurret: 120,
      supplyDrop: 135,
      cloakingDevice: 150,
    },
  );
  assert.equal(new Set(BLACK_MARKET_CATALOG.map((item) => item.id)).size, BLACK_MARKET_CATALOG.length);
  assert.ok(BLACK_MARKET_CATALOG.some((item) => item.id === STARTER_GADGET_ID));
  assert.ok(BLACK_MARKET_CATALOG.every((item) => Number.isInteger(item.price) && item.price > 0));
});

test('todas as skins do catálogo possuem arquivo de imagem publicado', () => {
  for (const skin of SKIN_CATALOG) {
    const imagePath = path.resolve(__dirname, '..', '..', skin.imagePath.replace(/^\.\//, ''));
    assert.equal(fs.existsSync(imagePath), true, `Imagem ausente para ${skin.id}: ${skin.imagePath}`);
    assert.ok(fs.statSync(imagePath).size > 0, `Imagem vazia para ${skin.id}: ${skin.imagePath}`);
  }
});

test('skins aposentadas não permanecem disponíveis para novas compras', () => {
  const catalogIds = new Set(SKIN_CATALOG.map((skin) => skin.id));
  for (const retiredId of [
    'carbine:convex',
    'pistol:cryostasis',
    'shotgun:chronovoid',
    'shotgun:holo-meridian',
    'revolver:doombringer',
    'revolver:protocol-781-a',
  ]) {
    assert.equal(catalogIds.has(retiredId), false, `${retiredId} ainda está no catálogo`);
  }
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

test('login diário avança por data local e reinicia somente depois do dia 7', async () => {
  const originalGet = database.get;
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const missedDate = new Date(`${localToday}T12:00:00Z`);
  missedDate.setUTCDate(missedDate.getUTCDate() - 3);
  database.get = async () => ({ streak: 3, last_claim_date: missedDate.toISOString().slice(0, 10) });
  try {
    const continued = await Commerce.dailyLoginStatus(7, localToday);
    assert.equal(continued.available, true);
    assert.equal(continued.currentDay, 4);

    database.get = async () => ({ streak: 7, last_claim_date: missedDate.toISOString().slice(0, 10) });
    const restarted = await Commerce.dailyLoginStatus(7, localToday);
    assert.equal(restarted.currentDay, 1);
  } finally {
    database.get = originalGet;
  }
});

test('primeiro login libera o Dia 1 imediatamente', async () => {
  const originalGet = database.get;
  database.get = async () => undefined;
  try {
    const status = await Commerce.dailyLoginStatus(91, new Date().toISOString().slice(0, 10));
    assert.deepEqual(status, {
      available: true,
      currentDay: 1,
      streak: 0,
      lastClaimDate: null,
    });
  } finally {
    database.get = originalGet;
  }
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

test('API do Black Market compra e equipa somente pela sessão autenticada', async () => {
  const originalSession = Session.findValid;
  const originalPurchase = Commerce.purchaseGadget;
  const originalEquip = Commerce.equipGadget;
  Session.findValid = async () => ({ id: 7, username: 'agente' });
  Commerce.purchaseGadget = async (userId, gadgetId) => ({
    gadget: { id: gadgetId, name: 'Mina Cryo', price: 80 },
    paid: 80,
    coreBalance: 220,
    userId,
  });
  Commerce.equipGadget = async (userId, gadgetId) => ({ userId, gadgetId });
  try {
    const purchase = await request(app)
      .post('/api/commerce/gadgets/cryoMine/purchase')
      .set('Authorization', `Bearer ${'b'.repeat(64)}`)
      .send({})
      .expect(201);
    assert.equal(purchase.body.paid, 80);
    assert.equal(purchase.body.coreBalance, 220);

    const equip = await request(app)
      .put('/api/commerce/gadgets/cryoMine/equip')
      .set('Authorization', `Bearer ${'b'.repeat(64)}`)
      .send({})
      .expect(200);
    assert.equal(equip.body.gadgetId, 'cryoMine');
  } finally {
    Session.findValid = originalSession;
    Commerce.purchaseGadget = originalPurchase;
    Commerce.equipGadget = originalEquip;
  }
});

test('concessão administrativa de skin exige sessão e devolve o item sorteado', async () => {
  const originalSession = Session.findValid;
  const originalGrant = Commerce.grantAdminSkin;
  Session.findValid = async () => ({ id: 12, username: 'Teste', is_admin: true });
  Commerce.grantAdminSkin = async (userId, skinId) => ({
    skin: { id: skinId, name: 'Skin de Teste', weaponId: 'pistol', imagePath: '/skin.png' },
    added: true,
    userId,
  });
  try {
    const response = await request(app)
      .post('/api/commerce/admin/skins/pistol%3Ateste/grant')
      .set('Authorization', `Bearer ${'c'.repeat(64)}`)
      .send({})
      .expect(201);
    assert.equal(response.body.added, true);
    assert.equal(response.body.skin.id, 'pistol:teste');
    assert.equal(response.body.userId, 12);
  } finally {
    Session.findValid = originalSession;
    Commerce.grantAdminSkin = originalGrant;
  }
});
