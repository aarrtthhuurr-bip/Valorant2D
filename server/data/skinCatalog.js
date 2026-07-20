const crypto = require('crypto');

const SKIN_GROUPS = {
  Bulldog: ['Araxys', 'Aristocrat', 'Convex', 'Protocol 781-A'],
  Classic: ['Cryostasis', 'VCT25 x 100T', 'VCT25 x BBL', 'VCT25 x FUT'],
  Guardian: ['CYRAX', 'Fortunes Hand', 'Kuronami', 'Reverie'],
  Judge: ['ChronoVoid', 'Doombringer', 'Holo Meridian', 'Smite'],
  Odin: ['Comet', 'EXE', 'Evori Dreamwings', 'Solarex'],
  Operator: ['Endeavour', 'Haloform', 'Luxe', 'ORA by OneTap'],
  Phantom: ['Doombringer', 'ORA by OneTap', 'Ruination', 'Winterwunderland'],
  Sheriff: ['Doombringer', 'Ion', 'Kuronami', 'Protocol 781-A'],
  Shorty: ['Aquatica', 'Gaias Vengeance', 'Genesis', 'Guardrail'],
  Spectre: ['Horizon', 'NO LIMITS', 'Prism', 'Singularity'],
};

const WEAPON_IDS = {
  Bulldog: 'carbine', Classic: 'pistol', Guardian: 'dmr', Judge: 'shotgun', Odin: 'lmg',
  Operator: 'sniper', Phantom: 'rifle', Sheriff: 'revolver', Shorty: 'light-pistol', Spectre: 'smg',
};

const EXCLUSIVE = new Set(['Araxys', 'Protocol 781-A', 'Kuronami', 'ChronoVoid', 'Evori Dreamwings', 'Haloform', 'Ruination', 'Singularity']);
const PREMIUM = new Set(['Cryostasis', 'CYRAX', 'Doombringer', 'Ion', 'ORA by OneTap', 'Gaias Vengeance']);
const DELUXE = new Set(['Aristocrat', 'Comet', 'Endeavour', 'Holo Meridian', 'Luxe', 'Prism', 'Solarex', 'VCT25 x 100T', 'VCT25 x BBL', 'VCT25 x FUT']);

function rarityFor(name) {
  if (EXCLUSIVE.has(name)) return 'exclusive';
  if (PREMIUM.has(name)) return 'premium';
  if (DELUXE.has(name)) return 'deluxe';
  return 'select';
}

const PRICE_BY_RARITY = { select: 80, deluxe: 125, premium: 180, exclusive: 230 };

function fileName(name, weapon) {
  return `${name.replaceAll(' ', '_')}_${weapon}.webp`;
}

const SKIN_CATALOG = Object.entries(SKIN_GROUPS).flatMap(([weapon, names]) => names.map((name, index) => {
  const rarity = rarityFor(name);
  return {
    id: `${WEAPON_IDS[weapon]}:${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    weaponId: WEAPON_IDS[weapon],
    weaponName: weapon,
    rarity,
    price: Math.min(240, PRICE_BY_RARITY[rarity] + index * 3),
    imagePath: `./assets/skins/${weapon}/${fileName(name, weapon)}`,
  };
}));

const SKINS_BY_ID = new Map(SKIN_CATALOG.map((skin) => [skin.id, skin]));

function dailyOffers(date = new Date()) {
  const dayKey = date.toISOString().slice(0, 10);
  const seed = crypto.createHash('sha256')
    .update(`${process.env.DAILY_OFFER_SECRET || 'valorant2d-core'}:${dayKey}`)
    .digest();
  const selected = [];
  let cursor = 0;
  while (selected.length < 4) {
    const skin = SKIN_CATALOG[seed[cursor % seed.length] % SKIN_CATALOG.length];
    if (!selected.some((entry) => entry.id === skin.id)) selected.push(skin);
    cursor += 1;
  }
  return selected.map((skin, index) => {
    const discountPercent = [15, 20, 25, 30][seed[(index + 7) % seed.length] % 4];
    return {
      ...skin,
      originalPrice: skin.price,
      discountPercent,
      price: Math.max(1, Math.floor(skin.price * (100 - discountPercent) / 100)),
    };
  });
}

module.exports = { SKIN_CATALOG, SKINS_BY_ID, dailyOffers };
