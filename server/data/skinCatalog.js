const crypto = require('crypto');

const SKIN_GROUPS = {
  Bulldog: ['Araxys', 'Aristocrat', 'Protocol 781-A', 'Bumble Brigade', 'NO LIMITS', 'Radiant Entertainment System', 'Soulburst', 'Spectrum'],
  Classic: ['VCT25 x 100T', 'VCT25 x BBL', 'VCT25 x FUT', 'Spectrum', 'VCT25 x KOI', 'VCT25 x LOUD', 'VCT25 x TH', 'VCT25 x TS', 'VCT x FPX', 'VCT x TE'],
  Guardian: ['CYRAX', 'Fortunes Hand', 'Kuronami', 'Reverie', 'Gaias Vengeance', 'Paceline', 'Reaver', 'Space Piercer'],
  Judge: ['Doombringer', 'Smite', 'Divergence', 'EXE', 'Interhelm', 'Luxe', 'Sovereign', 'Tilde'],
  Odin: ['Comet', 'EXE', 'Evori Dreamwings', 'Solarex', 'Fortunes Hand', 'Nanobreak', 'Orion', 'Sovereign'],
  Operator: ['Endeavour', 'Haloform', 'Luxe', 'ORA by OneTap', 'Bubblegum Deathwish', 'Mystbloom', 'Radiant Entertainment System', 'SplashX', 'Spline'],
  Phantom: ['Doombringer', 'ORA by OneTap', 'Ruination', 'Winterwunderland', 'Champions 2022', 'Magepunk', 'Radiant Entertainment System', 'Rush'],
  Sheriff: ['Ion', 'Kuronami', 'Cloudweaver', 'Imperium', 'Keys to Elysium', 'ORA by OneTap', 'SYS', 'Sentinels of Light'],
  Shorty: ['Aquatica', 'Gaias Vengeance', 'Genesis', 'Guardrail', 'Cloudweaver', 'Doom Wing', 'Sentinels of Light', 'Tilde'],
  Spectre: ['Horizon', 'NO LIMITS', 'Prism', 'Singularity', 'Aero', 'Avalanche', 'Evori Dreamwings', 'Kuronami'],
};

const WEAPON_IDS = {
  Bulldog: 'carbine', Classic: 'pistol', Guardian: 'dmr', Judge: 'shotgun', Odin: 'lmg',
  Operator: 'sniper', Phantom: 'rifle', Sheriff: 'revolver', Shorty: 'light-pistol', Spectre: 'smg',
};

const EXCLUSIVE = new Set([
  'Araxys', 'Bubblegum Deathwish', 'Champions 2022', 'Evori Dreamwings', 'Haloform',
  'Keys to Elysium', 'Kuronami', 'Mystbloom', 'Protocol 781-A',
  'Radiant Entertainment System', 'Ruination', 'Singularity', 'Spectrum', 'SplashX',
]);
const PREMIUM = new Set([
  'Cloudweaver', 'CYRAX', 'Doom Wing', 'Doombringer', 'Gaias Vengeance', 'Imperium',
  'Ion', 'Magepunk', 'ORA by OneTap', 'Reaver', 'Sentinels of Light', 'Sovereign',
]);
const DELUXE = new Set([
  'Aristocrat', 'Avalanche', 'Comet', 'Divergence', 'Endeavour', 'Luxe',
  'Nanobreak', 'NO LIMITS', 'Orion', 'Prism', 'Solarex', 'Spline', 'SYS', 'Tilde',
  'VCT25 x 100T', 'VCT25 x BBL', 'VCT25 x FUT', 'VCT25 x KOI', 'VCT25 x LOUD',
  'VCT25 x TH', 'VCT25 x TS', 'VCT x FPX', 'VCT x TE',
]);

function rarityFor(name) {
  if (EXCLUSIVE.has(name)) return 'exclusive';
  if (PREMIUM.has(name)) return 'premium';
  if (DELUXE.has(name)) return 'deluxe';
  return 'select';
}

const PRICE_BY_RARITY = { select: 80, deluxe: 125, premium: 180, exclusive: 230 };

function fileName(name, weapon) {
  return `${name.replaceAll("'", '').replaceAll(' ', '_')}_${weapon}.webp`;
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
