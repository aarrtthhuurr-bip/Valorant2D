const BLACK_MARKET_CATALOG = Object.freeze([
  Object.freeze({ id: 'pulseBomb', name: 'Bomba de Pulso', price: 45 }),
  Object.freeze({ id: 'cryoMine', name: 'Mina Cryo', price: 80 }),
  Object.freeze({ id: 'adrenaline', name: 'Adrenalina', price: 95 }),
  Object.freeze({ id: 'decoyTurret', name: 'Torreta Chamariz', price: 120 }),
]);

const BLACK_MARKET_BY_ID = new Map(BLACK_MARKET_CATALOG.map((item) => [item.id, item]));
const STARTER_GADGET_ID = 'pulseBomb';

module.exports = { BLACK_MARKET_BY_ID, BLACK_MARKET_CATALOG, STARTER_GADGET_ID };
