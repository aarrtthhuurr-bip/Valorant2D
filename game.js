const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  phase: document.getElementById("phaseText"),
  timer: document.getElementById("timerText"),
  score: document.getElementById("scoreText"),
  money: document.getElementById("moneyText"),
  agent: document.getElementById("agentText"),
  weapon: document.getElementById("weaponText"),
  hp: document.getElementById("hpText"),
  ammo: document.getElementById("ammoText"),
  spike: document.getElementById("spikeText"),
  shop: document.getElementById("shop"),
  message: document.getElementById("message"),
  agentButtons: document.getElementById("agentButtons"),
  weaponButtons: document.getElementById("weaponButtons"),
  equipmentButtons: document.getElementById("equipmentButtons"),
  hpBar: document.getElementById("hpBar"),
  ammoBar: document.getElementById("ammoBar"),
  plantBar: document.getElementById("plantBar"),
  shopButton: document.getElementById("shopButton"),
  pauseButton: document.getElementById("pauseButton"),
  matchOverlay: document.getElementById("matchOverlay"),
  overlayKicker: document.getElementById("overlayKicker"),
  overlayTitle: document.getElementById("overlayTitle"),
  overlayText: document.getElementById("overlayText"),
  newGameButton: document.getElementById("newGameButton"),
};

const keys = new Set();
const pressed = new Set();
const mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };
const SPIKE_DETONATE_TIME = 38;
const PLAYER_DEFUSE_TIME = 3.2;
const BOT_DEFUSE_TIME = 5.2;
const PLANT_TIME = 2.0;
const MATCH_POINT = 15;
const MAP_POOL = ["Splitline", "Docks", "Foundry"];

const agents = [
  {
    id: "vanguard",
    name: "Vanguard",
    role: "Entrada",
    color: "#ff5b5b",
    ability: "Dash curto",
    cooldown: 7,
    use(game) {
      const p = game.player;
      const dx = Math.cos(p.angle) * 120;
      const dy = Math.sin(p.angle) * 120;
      moveEntity(p, dx, dy, game.map.walls);
    },
  },
  {
    id: "ciphera",
    name: "Ciphera",
    role: "Info",
    color: "#4fb3ff",
    ability: "Pulso revelador",
    cooldown: 10,
    use(game) {
      game.revealTimer = 3;
    },
  },
  {
    id: "mender",
    name: "Mender",
    role: "Suporte",
    color: "#66e48f",
    ability: "Cura",
    cooldown: 9,
    use(game) {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + 35);
    },
  },
  {
    id: "shade",
    name: "Shade",
    role: "Controle",
    color: "#b084ff",
    ability: "Smoke",
    cooldown: 8,
    use(game) {
      game.smokes.push({ x: mouse.x, y: mouse.y, r: 84, life: 6 });
    },
  },
];

const weapons = [
  { id: "pistol", name: "Pistol", price: 0, damage: 28, fireRate: 0.34, speed: 980, spread: 0.04, mag: 12, reload: 1.1 },
  { id: "light-pistol", name: "Light Pistol", price: 650, damage: 20, fireRate: 0.18, speed: 930, spread: 0.075, mag: 15, reload: 1.2 },
  { id: "revolver", name: "Revolver", price: 1050, damage: 54, fireRate: 0.44, speed: 1180, spread: 0.035, mag: 6, reload: 1.35 },
  { id: "smg", name: "SMG", price: 1450, damage: 18, fireRate: 0.09, speed: 900, spread: 0.09, mag: 25, reload: 1.4 },
  { id: "shotgun", name: "Shotgun", price: 2150, damage: 15, fireRate: 0.65, speed: 760, spread: 0.22, mag: 6, reload: 1.5, pellets: 6 },
  { id: "carbine", name: "Carbine", price: 3200, damage: 33, fireRate: 0.12, speed: 1080, spread: 0.055, mag: 24, reload: 1.6 },
  { id: "rifle", name: "Rifle", price: 3900, damage: 39, fireRate: 0.15, speed: 1120, spread: 0.045, mag: 25, reload: 1.7 },
  { id: "dmr", name: "DMR", price: 4600, damage: 62, fireRate: 0.36, speed: 1260, spread: 0.022, mag: 12, reload: 1.75 },
  { id: "lmg", name: "LMG", price: 5600, damage: 24, fireRate: 0.14, speed: 930, spread: 0.12, mag: 50, reload: 3.2 },
  { id: "sniper", name: "Sniper", price: 6900, damage: 95, fireRate: 0.9, speed: 1450, spread: 0.01, mag: 5, reload: 2.1 },
];

const equipment = [
  { id: "lightArmor", name: "Colete leve", price: 1200, desc: "25 de armadura consumivel", apply: () => { game.upgrades.armorCapacity = Math.max(game.upgrades.armorCapacity, 25); game.armor = 25; } },
  { id: "heavyArmor", name: "Colete pesado", price: 2600, desc: "50 de armadura consumivel", apply: () => { game.upgrades.armorCapacity = Math.max(game.upgrades.armorCapacity, 50); game.armor = 50; } },
  { id: "boots", name: "Botas taticas", price: 1500, desc: "+10% velocidade", apply: () => { game.upgrades.speed = true; } },
  { id: "magazine", name: "Carregador extra", price: 1800, desc: "+20% munição no pente", apply: () => { game.upgrades.magazine = true; } },
  { id: "reloadKit", name: "Kit de recarga", price: 1700, desc: "Recarga 20% mais rapida", apply: () => { game.upgrades.reload = true; } },
];

const map = {
  width: 1280,
  height: 720,
  attackersSpawn: { x: 640, y: 650 },
  attackerBotSpawns: [
    { x: 570, y: 650 },
    { x: 640, y: 650 },
    { x: 710, y: 650 },
  ],
  playerDefenderSpawn: { x: 640, y: 78 },
  defendersSpawn: [
    { x: 300, y: 110 },
    { x: 640, y: 78 },
    { x: 980, y: 110 },
  ],
  botRoutes: [
    [
      { x: 300, y: 110 },
      { x: 450, y: 110 },
      { x: 450, y: 235 },
      { x: 430, y: 410 },
      { x: 560, y: 410 },
      { x: 560, y: 620 },
      { x: 300, y: 620 },
    ],
    [
      { x: 640, y: 78 },
      { x: 450, y: 95 },
      { x: 450, y: 250 },
      { x: 430, y: 410 },
      { x: 560, y: 410 },
      { x: 560, y: 620 },
      { x: 720, y: 620 },
      { x: 720, y: 410 },
    ],
    [
      { x: 980, y: 110 },
      { x: 830, y: 110 },
      { x: 830, y: 235 },
      { x: 830, y: 410 },
      { x: 720, y: 410 },
      { x: 720, y: 620 },
      { x: 980, y: 620 },
    ],
  ],
  sites: [
    { id: "A", x: 230, y: 250, w: 170, h: 130 },
    { id: "B", x: 870, y: 250, w: 170, h: 130 },
  ],
  walls: [
    { x: 0, y: 0, w: 1280, h: 28 },
    { x: 0, y: 692, w: 1280, h: 28 },
    { x: 0, y: 0, w: 28, h: 720 },
    { x: 1252, y: 0, w: 28, h: 720 },
    { x: 170, y: 145, w: 250, h: 34 },
    { x: 860, y: 145, w: 250, h: 34 },
    { x: 520, y: 120, w: 240, h: 34 },
    { x: 470, y: 275, w: 340, h: 36 },
    { x: 180, y: 470, w: 320, h: 36 },
    { x: 780, y: 470, w: 320, h: 36 },
    { x: 600, y: 430, w: 80, h: 150 },
    { x: 95, y: 300, w: 90, h: 80 },
    { x: 1085, y: 300, w: 90, h: 80 },
    { x: 335, y: 330, w: 90, h: 38 },
    { x: 855, y: 330, w: 90, h: 38 },
  ],
};

const game = {
  map,
  phase: "buy",
  phaseTime: 8,
  paused: false,
  scoreA: 0,
  scoreD: 0,
  playerScore: 0,
  enemyScore: 0,
  money: 800,
  roundNumber: 1,
  playerSide: "attackers",
  startingSide: "attackers",
  mapName: "Splitline",
  selectedAgent: agents[0],
  selectedWeapon: weapons[0],
  ownedWeapons: new Set(["pistol"]),
  upgrades: { armorCapacity: 0, speed: false, magazine: false, reload: false },
  armor: 0,
  player: null,
  bots: [],
  bullets: [],
  particles: [],
  explosions: [],
  footsteps: [],
  hitMarkers: [],
  smokes: [],
  revealTimer: 0,
  spike: { state: "carried", owner: "player", x: 0, y: 0, timer: 0, site: null, plantProgress: 0, defuseProgress: 0, defuseCheckpoint: 0, defuserId: null },
  message: "Plante a spike em A ou B.",
  lastMessage: "",
  abilityCooldown: 0,
  lastShot: 0,
  footstepTimer: 0,
  reloadTimer: 0,
  roundOverTimer: 0,
  shake: 0,
};

function makePlayer() {
  const spawn = game.playerSide === "attackers" ? map.attackersSpawn : { x: 640, y: 78 };
  return {
    id: "player",
    x: spawn.x,
    y: spawn.y,
    r: 18,
    hp: 100,
    maxHp: 100,
    armor: game.armor,
    maxArmor: game.upgrades.armorCapacity,
    speed: game.upgrades.speed ? 248 : 225,
    angle: -Math.PI / 2,
    ammo: currentMagSize(),
    weapon: game.selectedWeapon,
    alive: true,
  };
}

function botWeaponForRound(index) {
  const r = game.roundNumber;
  if (r >= 13) return [weapons[7], weapons[8], weapons[9]][index % 3];
  if (r >= 10) return [weapons[6], weapons[7], weapons[8]][index % 3];
  if (r >= 7) return [weapons[5], weapons[6], weapons[7]][index % 3];
  if (r >= 4) return [weapons[3], weapons[4], weapons[5]][index % 3];
  if (r >= 2) return [weapons[1], weapons[2], weapons[3]][index % 3];
  return weapons[0];
}

function makeBot(spawn, index) {
  const botSide = game.playerSide === "attackers" ? "defenders" : "attackers";
  const weapon = botWeaponForRound(index);
  const botArmor = game.roundNumber >= 8 ? 35 : game.roundNumber >= 4 ? 20 : 0;
  return {
    x: spawn.x,
    y: spawn.y,
    r: 17,
    hp: 100,
    maxHp: 100,
    armor: botArmor,
    maxArmor: botArmor,
    speed: 118 + index * 8,
    angle: Math.PI / 2,
    alive: true,
    side: botSide,
    hasSpike: botSide === "attackers" && index === 1,
    weapon,
    plantProgress: 0,
    defuseProgress: 0,
    fireTimer: 0.3 + index * 0.25,
    patrol: index,
    routeIndex: 1,
    wait: 0,
    lastX: spawn.x,
    lastY: spawn.y,
    stuck: 0,
    strafe: index % 2 === 0 ? 1 : -1,
    lastKnownPlayer: null,
    memoryTimer: 0,
  };
}

function resetRound() {
  game.roundNumber += game.phase === "ended" ? 1 : 0;
  const sideFlipped = Math.floor((game.roundNumber - 1) / 3) % 2 === 1;
  const nextSide = sideFlipped ? opposingSide(game.startingSide) : game.startingSide;
  const changedSide = game.playerSide !== nextSide;
  game.playerSide = nextSide;
  game.phase = "buy";
  game.phaseTime = 8;
  game.player = makePlayer();
  const botSpawns = game.playerSide === "attackers" ? map.defendersSpawn : map.attackerBotSpawns;
  game.bots = botSpawns.map(makeBot);
  game.bullets = [];
  game.particles = [];
  game.explosions = [];
  game.footsteps = [];
  game.hitMarkers = [];
  game.smokes = [];
  game.revealTimer = 0;
  game.abilityCooldown = 0;
  game.lastShot = 0;
  game.footstepTimer = 0;
  game.reloadTimer = 0;
  game.roundOverTimer = 0;
  const carrier = game.bots.find((bot) => bot.hasSpike);
  game.spike = {
    state: "carried",
    owner: game.playerSide === "attackers" ? "player" : "bot",
    x: game.playerSide === "attackers" ? game.player.x : carrier.x,
    y: game.playerSide === "attackers" ? game.player.y : carrier.y,
    timer: 0,
    site: null,
    plantProgress: 0,
    defuseProgress: 0,
    defuseCheckpoint: 0,
    defuserId: null,
  };
  setMessage(changedSide
    ? (game.playerSide === "attackers" ? "Troca de lado: agora voce ataca e planta." : "Troca de lado: agora voce defende e desarma.")
    : (game.playerSide === "attackers" ? "Compra aberta. Voce ataca: plante a spike." : "Compra aberta. Voce defende: impeca o plant ou desarme."));
  ui.shop.classList.add("hidden");
}

function startActionRound() {
  game.phase = "action";
  game.phaseTime = 90;
  ui.shop.classList.add("hidden");
  setMessage(game.playerSide === "attackers"
    ? "Ataque: plante a spike em A ou B."
    : "Defesa: impeca o plant. Se plantarem, desarme com F.");
}

function startNewMatch() {
  game.scoreA = 0;
  game.scoreD = 0;
  game.playerScore = 0;
  game.enemyScore = 0;
  game.money = 800;
  game.ownedWeapons = new Set(["pistol"]);
  game.upgrades = { armorCapacity: 0, speed: false, magazine: false, reload: false };
  game.armor = 0;
  game.roundNumber = 1;
  game.startingSide = Math.random() < 0.5 ? "attackers" : "defenders";
  game.playerSide = game.startingSide;
  game.mapName = MAP_POOL[Math.floor(Math.random() * MAP_POOL.length)];
  resetRound();
  game.paused = false;
  ui.matchOverlay.classList.add("hidden");
  ui.shop.classList.add("hidden");
  setMessage(game.playerSide === "attackers"
    ? `Mapa ${game.mapName}. Seu time: Ataque. Plante a spike.`
    : `Mapa ${game.mapName}. Seu time: Defesa. Impeca o plant ou desarme.`);
}

function showMatchResult() {
  const won = game.playerScore >= MATCH_POINT;
  game.phase = "matchOver";
  game.phaseTime = 0;
  game.paused = false;
  ui.shop.classList.add("hidden");
  ui.matchOverlay.classList.remove("hidden");
  ui.overlayKicker.textContent = "Partida encerrada";
  ui.overlayTitle.textContent = won ? "Vitória" : "Derrota";
  ui.overlayText.textContent = `${game.playerScore} - ${game.enemyScore}`;
  ui.newGameButton.style.display = "";
}

function endRound(winner, reason) {
  if (game.phase === "ended" || game.phase === "matchOver") return;
  game.phase = "ended";
  game.phaseTime = 4;
  if (winner === "attackers") {
    game.scoreA += 1;
  } else {
    game.scoreD += 1;
  }
  if (winner === game.playerSide) {
    game.playerScore += 1;
    game.money += 2200;
  } else {
    game.enemyScore += 1;
    game.money += 1600;
  }
  setMessage(reason);
  if (game.playerScore >= MATCH_POINT || game.enemyScore >= MATCH_POINT) {
    showMatchResult();
  }
}

function opposingSide(side) {
  return side === "attackers" ? "defenders" : "attackers";
}

function currentMagSize() {
  return Math.ceil(game.selectedWeapon.mag * (game.upgrades.magazine ? 1.2 : 1));
}

function currentReloadTime() {
  return game.selectedWeapon.reload * (game.upgrades.reload ? 0.8 : 1);
}

function currentPlayerPlantTime() {
  return PLANT_TIME;
}

function currentPlayerDefuseTime() {
  return PLAYER_DEFUSE_TIME;
}

function applyDamage(entity, amount) {
  let remaining = amount;
  if (entity.armor > 0) {
    const absorbed = Math.min(entity.armor, remaining * 0.7);
    entity.armor -= absorbed;
    remaining -= absorbed;
  }
  entity.hp -= remaining;
  if (entity.id === "player") game.armor = Math.max(0, entity.armor || 0);
}

function rectContains(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function rectContainsPadded(rect, x, y, padding) {
  return x >= rect.x - padding && x <= rect.x + rect.w + padding && y >= rect.y - padding && y <= rect.y + rect.h + padding;
}

function circleRectCollides(entity, rect) {
  const nearestX = Math.max(rect.x, Math.min(entity.x, rect.x + rect.w));
  const nearestY = Math.max(rect.y, Math.min(entity.y, rect.y + rect.h));
  const dx = entity.x - nearestX;
  const dy = entity.y - nearestY;
  return dx * dx + dy * dy < entity.r * entity.r;
}

function moveEntity(entity, dx, dy, walls) {
  const startX = entity.x;
  const startY = entity.y;
  entity.x += dx;
  for (const wall of walls) {
    if (circleRectCollides(entity, wall)) entity.x -= dx;
  }
  entity.y += dy;
  for (const wall of walls) {
    if (circleRectCollides(entity, wall)) entity.y -= dy;
  }
  entity.x = Math.max(entity.r, Math.min(map.width - entity.r, entity.x));
  entity.y = Math.max(entity.r, Math.min(map.height - entity.r, entity.y));
  return Math.hypot(entity.x - startX, entity.y - startY);
}

function spawnParticles(x, y, color, count = 8, power = 120) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = power * (0.35 + Math.random() * 0.9);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.28 + Math.random() * 0.26,
      maxLife: 0.54,
      color,
      size: 2 + Math.random() * 3,
    });
  }
}

function spawnSpikeExplosion(x, y) {
  const colors = ["#ff4d5d", "#ffd166", "#ffffff", "#ff8a5b", "#7dd3fc"];
  for (let i = 0; i < 5; i++) {
    spawnParticles(x, y, colors[i], 28, 260 + i * 80);
  }
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const distance = 20 + Math.random() * 24;
    spawnParticles(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, colors[i % colors.length], 3, 360);
  }
  game.explosions.push({ x, y, r: 18, maxR: 320, life: 0.75, maxLife: 0.75 });
  game.explosions.push({ x, y, r: 8, maxR: 180, life: 0.38, maxLife: 0.38 });
  game.shake = Math.max(game.shake, 0.85);
}

function setMessage(text) {
  if (game.message === text) return;
  game.message = text;
  ui.message.classList.remove("pulse");
  void ui.message.offsetWidth;
  ui.message.classList.add("pulse");
}

function lineIntersectsRect(x1, y1, x2, y2, rect) {
  const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 12);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (rectContains(rect, x, y)) return true;
  }
  return false;
}

function lineIntersectsAnyWall(x1, y1, x2, y2) {
  for (const wall of map.walls) {
    if (lineIntersectsRect(x1, y1, x2, y2, wall)) return true;
  }
  return false;
}

function hasLineOfSight(a, b) {
  if (lineIntersectsAnyWall(a.x, a.y, b.x, b.y)) return false;
  for (const smoke of game.smokes) {
    const dist = pointLineDistance(smoke.x, smoke.y, a.x, a.y, b.x, b.y);
    if (dist < smoke.r) return false;
  }
  return true;
}

function pointLineDistance(px, py, x1, y1, x2, y2) {
  const len2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / len2));
  const x = x1 + t * (x2 - x1);
  const y = y1 + t * (y2 - y1);
  return Math.hypot(px - x, py - y);
}

function segmentCircleHit(x1, y1, x2, y2, circle, padding = 0) {
  return pointLineDistance(circle.x, circle.y, x1, y1, x2, y2) <= circle.r + padding;
}

function currentDefuseProgress() {
  return (game.spike.defuseCheckpoint || 0) / 3;
}

function resetPartialDefuse() {
  game.spike.defuseProgress = currentDefuseProgress();
  game.spike.defuserId = null;
}

function advanceDefuse(defuserId, dt, totalTime) {
  if (game.spike.defuserId !== defuserId) {
    resetPartialDefuse();
    game.spike.defuserId = defuserId;
  }
  const checkpoint = game.spike.defuseCheckpoint || 0;
  const nextCheckpoint = Math.min(3, checkpoint + 1);
  game.spike.defuseProgress += dt / totalTime;
  if (game.spike.defuseProgress >= nextCheckpoint / 3) {
    game.spike.defuseCheckpoint = nextCheckpoint;
    game.spike.defuseProgress = nextCheckpoint / 3;
    game.spike.defuserId = null;
    spawnParticles(game.spike.x, game.spike.y, "#66e48f", 10, 90);
  }
  return game.spike.defuseCheckpoint >= 3;
}

function shoot(owner, targetX, targetY, weapon, team) {
  const now = performance.now() / 1000;
  if (team === "player") {
    if (game.phase !== "action" || game.reloadTimer > 0 || now - game.lastShot < weapon.fireRate) return;
    if (owner.ammo <= 0) {
      reload();
      return;
    }
    game.lastShot = now;
    owner.ammo -= 1;
    game.shake = Math.max(game.shake, 0.04);
    spawnParticles(owner.x + Math.cos(owner.angle) * 24, owner.y + Math.sin(owner.angle) * 24, "#ffe6a8", 5, 90);
    if (owner.ammo <= 0) reload();
  }
  const count = weapon.pellets || 1;
  for (let i = 0; i < count; i++) {
    const base = Math.atan2(targetY - owner.y, targetX - owner.x);
    const movingPenalty = owner.moving ? 1.8 : 1;
    const spread = (Math.random() - 0.5) * weapon.spread * 2 * movingPenalty;
    game.bullets.push({
      x: owner.x + Math.cos(base) * owner.r,
      y: owner.y + Math.sin(base) * owner.r,
      vx: Math.cos(base + spread) * weapon.speed,
      vy: Math.sin(base + spread) * weapon.speed,
      life: 0.9,
      damage: weapon.damage,
      team,
      weaponId: weapon.id,
    });
  }
}

function reload() {
  if (game.reloadTimer > 0) return;
  if (game.player.ammo >= currentMagSize()) return;
  game.reloadTimer = currentReloadTime();
}

function plantOrDefuse(dt) {
  const p = game.player;
  if (game.phase !== "action") return;

  if (game.playerSide === "defenders") {
    if (game.spike.state === "planted" && keys.has("f") && Math.hypot(p.x - game.spike.x, p.y - game.spike.y) < 46) {
      const complete = advanceDefuse("player", dt, currentPlayerDefuseTime());
      setMessage("Desarmando spike. Continue segurando F.");
      if (complete) {
        spawnParticles(game.spike.x, game.spike.y, "#66e48f", 28, 180);
        endRound("defenders", "Spike desarmada. Defensores venceram.");
      }
    } else if (game.spike.state === "planted") {
      resetPartialDefuse();
    }
    return;
  }

  if (game.spike.state === "carried" && game.spike.owner === "player" && pressed.has("f")) {
    const site = map.sites.find((s) => rectContains(s, p.x, p.y));
    if (!site) {
      setMessage("Entre em um site A/B para plantar.");
      return;
    }
    game.spike.state = "planting";
    game.spike.owner = "player";
    game.spike.site = site.id;
    game.spike.plantProgress = 0;
    setMessage(`Plantando no site ${site.id}. Fique dentro da area.`);
  }

  if (game.spike.state !== "planting") {
    return;
  }

  const currentSite = map.sites.find((s) => s.id === game.spike.site);
  if (!currentSite || !rectContains(currentSite, p.x, p.y)) {
    game.spike.state = "carried";
    game.spike.site = null;
    game.spike.plantProgress = 0;
    setMessage("Plant cancelado: voce saiu do site.");
    return;
  }

  game.spike.plantProgress += dt / currentPlayerPlantTime();
  if (game.spike.plantProgress >= 1) {
    game.spike.state = "planted";
    game.spike.owner = null;
    game.spike.x = p.x;
    game.spike.y = p.y;
    game.spike.timer = SPIKE_DETONATE_TIME;
    game.spike.plantProgress = 0;
    game.spike.defuseProgress = 0;
    game.spike.defuseCheckpoint = 0;
    game.spike.defuserId = null;
    spawnParticles(p.x, p.y, "#ffd166", 22, 160);
    game.shake = 0.18;
    setMessage(`Spike plantada no site ${game.spike.site}. Defenda.`);
  }
}

function updatePlayer(dt) {
  const p = game.player;
  if (!p.alive) return;

  const dx = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);
  const dy = (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0);
  const len = Math.hypot(dx, dy) || 1;
  p.moving = dx !== 0 || dy !== 0;
  moveEntity(p, (dx / len) * p.speed * dt, (dy / len) * p.speed * dt, map.walls);
  if (p.moving && game.phase === "action") {
    game.footstepTimer -= dt;
    if (game.footstepTimer <= 0) {
      game.footsteps.push({ x: p.x, y: p.y, r: 8, life: 0.42, maxLife: 0.42, team: "player" });
      game.footstepTimer = 0.28;
    }
  }
  p.angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  if (game.spike.state === "carried" && game.spike.owner === "player") {
    game.spike.x = p.x;
    game.spike.y = p.y;
  }

  if (mouse.down) shoot(p, mouse.x, mouse.y, game.selectedWeapon, "player");
  if (keys.has("r")) reload();
  if (keys.has("e") && game.abilityCooldown <= 0 && game.phase === "action") {
    game.selectedAgent.use(game);
    game.abilityCooldown = game.selectedAgent.cooldown;
  }
  plantOrDefuse(dt);
}

function siteCenter(site) {
  return { x: site.x + site.w / 2, y: site.y + site.h / 2 };
}

function siteEntryPoints(site) {
  if (site.id === "A") {
    return [
      { x: 300, y: 410 },
      { x: 300, y: 390 },
      { x: 300, y: 250 },
      { x: 260, y: 300 },
      { x: 385, y: 300 },
      { x: 315, y: 315 },
    ];
  }
  return [
    { x: 980, y: 410 },
    { x: 980, y: 390 },
    { x: 980, y: 250 },
    { x: 895, y: 300 },
    { x: 1015, y: 300 },
    { x: 955, y: 315 },
  ];
}

function plantTargetForSite(site, bot) {
  const center = siteCenter(site);
  if (!lineIntersectsAnyWall(bot.x, bot.y, center.x, center.y)) return center;
  return siteEntryPoints(site)
    .slice()
    .sort((a, b) => Math.hypot(bot.x - a.x, bot.y - a.y) - Math.hypot(bot.x - b.x, bot.y - b.y))[0];
}

function navigationPoints() {
  return [
    ...map.botRoutes.flat(),
    ...map.sites.map(siteCenter),
    ...map.sites.flatMap(siteEntryPoints),
    { x: 300, y: 620 },
    { x: 980, y: 620 },
    { x: 300, y: 410 },
    { x: 980, y: 410 },
    { x: 330, y: 250 },
    { x: 950, y: 250 },
    { x: 560, y: 620 },
    { x: 720, y: 620 },
    { x: 430, y: 410 },
    { x: 830, y: 410 },
  ];
}

const BOT_GRID = 32;

function gridCellFromPoint(point) {
  return {
    x: Math.max(0, Math.min(Math.floor(map.width / BOT_GRID) - 1, Math.floor(point.x / BOT_GRID))),
    y: Math.max(0, Math.min(Math.floor(map.height / BOT_GRID) - 1, Math.floor(point.y / BOT_GRID))),
  };
}

function gridPoint(cell) {
  return {
    x: cell.x * BOT_GRID + BOT_GRID / 2,
    y: cell.y * BOT_GRID + BOT_GRID / 2,
  };
}

function isGridCellWalkable(cell) {
  const point = gridPoint(cell);
  const probe = { x: point.x, y: point.y, r: 14 };
  if (point.x < 24 || point.x > map.width - 24 || point.y < 24 || point.y > map.height - 24) return false;
  return !map.walls.some((wall) => circleRectCollides(probe, wall));
}

function nearestWalkableCell(cell) {
  if (isGridCellWalkable(cell)) return cell;
  const cols = Math.floor(map.width / BOT_GRID);
  const rows = Math.floor(map.height / BOT_GRID);
  for (let radius = 1; radius <= 4; radius++) {
    for (let y = cell.y - radius; y <= cell.y + radius; y++) {
      for (let x = cell.x - radius; x <= cell.x + radius; x++) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const candidate = { x, y };
        if (isGridCellWalkable(candidate)) return candidate;
      }
    }
  }
  return null;
}

function findGridStep(bot, target) {
  const cols = Math.floor(map.width / BOT_GRID);
  const rows = Math.floor(map.height / BOT_GRID);
  const start = nearestWalkableCell(gridCellFromPoint(bot));
  const goal = nearestWalkableCell(gridCellFromPoint(target));
  if (!start || !goal) return null;

  const key = (cell) => `${cell.x},${cell.y}`;
  const queue = [start];
  const visited = new Set([key(start)]);
  const previous = new Map();
  const directions = [
    { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 },
  ];

  while (queue.length) {
    const current = queue.shift();
    if (current.x === goal.x && current.y === goal.y) break;
    for (const dir of directions) {
      const next = { x: current.x + dir.x, y: current.y + dir.y };
      if (next.x < 0 || next.y < 0 || next.x >= cols || next.y >= rows) continue;
      const nextKey = key(next);
      if (visited.has(nextKey) || !isGridCellWalkable(next)) continue;
      if (dir.x !== 0 && dir.y !== 0) {
        if (!isGridCellWalkable({ x: current.x + dir.x, y: current.y }) || !isGridCellWalkable({ x: current.x, y: current.y + dir.y })) continue;
      }
      visited.add(nextKey);
      previous.set(nextKey, current);
      queue.push(next);
    }
  }

  if (!visited.has(key(goal))) return null;
  let step = goal;
  while (previous.has(key(step)) && key(previous.get(key(step))) !== key(start)) {
    step = previous.get(key(step));
  }
  return gridPoint(step);
}

function botPathBlocked(bot, target) {
  if (lineIntersectsAnyWall(bot.x, bot.y, target.x, target.y)) return true;
  const samples = Math.max(2, Math.ceil(Math.hypot(bot.x - target.x, bot.y - target.y) / 24));
  for (let i = 1; i < samples; i++) {
    const t = i / samples;
    const probe = {
      x: bot.x + (target.x - bot.x) * t,
      y: bot.y + (target.y - bot.y) * t,
      r: bot.r * 0.75,
    };
    if (map.walls.some((wall) => circleRectCollides(probe, wall))) return true;
  }
  return false;
}

function resolveBotTarget(bot, target) {
  if (!botPathBlocked(bot, target)) return target;

  const gridStep = findGridStep(bot, target);
  if (gridStep) return gridStep;

  const nodes = [{ x: bot.x, y: bot.y }, target, ...navigationPoints()];
  const distance = Array(nodes.length).fill(Infinity);
  const previous = Array(nodes.length).fill(-1);
  const visited = Array(nodes.length).fill(false);
  distance[0] = 0;

  for (let step = 0; step < nodes.length; step++) {
    let current = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (!visited[i] && (current === -1 || distance[i] < distance[current])) current = i;
    }
    if (current === -1 || current === 1 || distance[current] === Infinity) break;
    visited[current] = true;

    for (let next = 1; next < nodes.length; next++) {
      if (visited[next]) continue;
      if (lineIntersectsAnyWall(nodes[current].x, nodes[current].y, nodes[next].x, nodes[next].y)) continue;
      const cost = Math.hypot(nodes[current].x - nodes[next].x, nodes[current].y - nodes[next].y)
        + (bot.lastNavPoint && nodes[next].x === bot.lastNavPoint.x && nodes[next].y === bot.lastNavPoint.y ? 80 : 0);
      if (distance[current] + cost < distance[next]) {
        distance[next] = distance[current] + cost;
        previous[next] = current;
      }
    }
  }

  if (previous[1] !== -1) {
    let nextIndex = 1;
    while (previous[nextIndex] > 0) nextIndex = previous[nextIndex];
    bot.lastNavPoint = nodes[nextIndex];
    return nodes[nextIndex];
  }

  return target;
}

function rescueBotFromStuck(bot, target, dt) {
  const step = findGridStep(bot, target);
  if (!step) return false;
  const angle = Math.atan2(step.y - bot.y, step.x - bot.x);
  const moved = moveEntity(bot, Math.cos(angle) * bot.speed * 1.55 * dt, Math.sin(angle) * bot.speed * 1.55 * dt, map.walls);
  if (moved > 0.5) {
    bot.angle = angle;
    return true;
  }
  if (bot.stuck > 1.15) {
    const probe = { x: step.x, y: step.y, r: bot.r };
    if (!map.walls.some((wall) => circleRectCollides(probe, wall))) {
      bot.x = step.x;
      bot.y = step.y;
      bot.stuck = 0;
      return true;
    }
  }
  return false;
}

function moveBotToward(bot, target, dt, speedScale = 1) {
  const safeTarget = resolveBotTarget(bot, target);
  const angle = Math.atan2(safeTarget.y - bot.y, safeTarget.x - bot.x);
  bot.angle = angle;
  const movedNow = moveEntity(bot, Math.cos(angle) * bot.speed * speedScale * dt, Math.sin(angle) * bot.speed * speedScale * dt, map.walls);
  bot.moving = movedNow > 0.5;
  if (bot.moving && game.phase === "action") {
    bot.stepTimer = (bot.stepTimer || 0) - dt;
    if (bot.stepTimer <= 0) {
      game.footsteps.push({ x: bot.x, y: bot.y, r: 8, life: 0.38, maxLife: 0.38, team: bot.side });
      bot.stepTimer = 0.34 + Math.random() * 0.1;
    }
  }
  if (movedNow < 0.5) {
    bot.stuck += dt;
    if (bot.stuck > 0.42 && rescueBotFromStuck(bot, target, dt)) return 1;
    if (bot.stuck > 0.18) {
      const side = angle + Math.PI / 2 * (bot.strafe || 1);
      const sideMoved = moveEntity(bot, Math.cos(side) * bot.speed * 0.7 * dt, Math.sin(side) * bot.speed * 0.7 * dt, map.walls);
      if (sideMoved < 0.5) bot.strafe *= -1;
    }
    bot.routeIndex = (bot.routeIndex + 1) % map.botRoutes[bot.patrol % map.botRoutes.length].length;
  } else {
    bot.stuck = Math.max(0, bot.stuck - dt * 2);
  }
  return movedNow;
}

function closestAliveBotTo(x, y) {
  return game.bots
    .filter((bot) => bot.alive)
    .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;
}

function botCanSeePlayer(bot) {
  const p = game.player;
  return p.alive && hasLineOfSight(bot, p) && Math.hypot(p.x - bot.x, p.y - bot.y) < 540;
}

function updateBotAwareness(bot, seesPlayer, dt) {
  if (seesPlayer) {
    bot.lastKnownPlayer = { x: game.player.x, y: game.player.y };
    bot.memoryTimer = 3.2;
  } else {
    bot.memoryTimer = Math.max(0, bot.memoryTimer - dt);
  }
}

function botFightPlayer(bot, dt, options = {}) {
  if (!botCanSeePlayer(bot)) return false;
  const p = game.player;
  const angle = Math.atan2(p.y - bot.y, p.x - bot.x);
  bot.angle = angle;
  bot.lastKnownPlayer = { x: p.x, y: p.y };
  bot.memoryTimer = 3.2;

  if (options.strafe !== false) {
    const side = angle + Math.PI / 2;
    const movedNow = moveEntity(bot, Math.cos(side) * bot.speed * bot.strafe * 0.38 * dt, Math.sin(side) * bot.speed * bot.strafe * 0.38 * dt, map.walls);
    if (movedNow < 0.5) bot.strafe *= -1;
  }

  bot.fireTimer -= dt;
  if (bot.fireTimer <= 0) {
    shoot(bot, p.x, p.y, bot.weapon || weapons[0], "bot");
    bot.fireTimer = (bot.weapon || weapons[0]).fireRate + 0.18 + Math.random() * 0.22;
    bot.strafe *= -1;
  }
  return true;
}

function ensureBotSpikeCarrier() {
  if (game.playerSide !== "defenders" || !["carried", "bot_planting"].includes(game.spike.state) || game.spike.owner !== "bot") return null;
  let carrier = game.bots.find((bot) => bot.alive && bot.hasSpike);
  if (!carrier) {
    carrier = game.bots.find((bot) => bot.alive);
    if (carrier) carrier.hasSpike = true;
  }
  if (!carrier) {
    endRound("defenders", "Atacantes eliminados antes do plant. Defensores venceram.");
    return null;
  }
  game.spike.x = carrier.x;
  game.spike.y = carrier.y;
  return carrier;
}

function botPlantSpike(bot, dt) {
  const site = map.sites.find((s) => rectContainsPadded(s, bot.x, bot.y, bot.r * 0.65));
  if (!site) {
    if (game.spike.state === "bot_planting") {
      game.spike.state = "carried";
      game.spike.owner = "bot";
      game.spike.plantProgress = 0;
      bot.plantProgress = 0;
      setMessage("Plant dos bots cancelado.");
    }
    return false;
  }
  game.spike.state = "bot_planting";
  game.spike.site = site.id;
  botFightPlayer(bot, dt, { strafe: false });
  game.spike.plantProgress += dt / (PLANT_TIME + 0.7);
  if (!botCanSeePlayer(bot)) bot.angle = -Math.PI / 2;
  if (game.spike.plantProgress >= 1) {
    bot.hasSpike = false;
    game.spike.state = "planted";
    game.spike.owner = null;
    game.spike.x = bot.x;
    game.spike.y = bot.y;
    game.spike.timer = SPIKE_DETONATE_TIME;
    game.spike.plantProgress = 0;
    game.spike.defuseProgress = 0;
    game.spike.defuseCheckpoint = 0;
    game.spike.defuserId = null;
    spawnParticles(bot.x, bot.y, "#ffd166", 24, 150);
    setMessage(`Bots plantaram no site ${site.id}. Desarme a spike.`);
  } else {
    setMessage(`Bot plantando no site ${site.id}. Interrompa.`);
  }
  return true;
}

function botDefuseSpike(bot, dt) {
  if (game.spike.state !== "planted") return false;
  const dist = Math.hypot(bot.x - game.spike.x, bot.y - game.spike.y);
  botFightPlayer(bot, dt, { strafe: dist <= 42 });
  if (dist > 42) {
    if (game.spike.defuserId === bot.id) resetPartialDefuse();
    moveBotToward(bot, game.spike, dt, 1.18);
    return true;
  }
  if (!botCanSeePlayer(bot)) {
    bot.angle = Math.atan2(game.spike.y - bot.y, game.spike.x - bot.x);
  }
  const complete = advanceDefuse(bot.id, dt, BOT_DEFUSE_TIME);
  setMessage("Um bot esta desarmando a spike. Derrube ele.");
  if (complete) {
    spawnParticles(game.spike.x, game.spike.y, "#66e48f", 28, 180);
    endRound("defenders", "Bot desarmou a spike. Defensores venceram.");
  }
  return true;
}

function guardPointAround(x, y, index) {
  const points = [
    { x: x - 82, y: y - 58 },
    { x: x + 82, y: y - 58 },
    { x: x - 72, y: y + 70 },
    { x: x + 72, y: y + 70 },
  ];
  return points[index % points.length];
}

function attackSupportPoint(bot, carrier, plantSite, plantTarget) {
  if (carrier && carrier.alive && game.spike.state === "carried") {
    const escortAngle = (bot.patrol - 1) * Math.PI * 0.7;
    return {
      x: carrier.x + Math.cos(escortAngle) * 74,
      y: carrier.y + Math.sin(escortAngle) * 58,
    };
  }
  const entries = siteEntryPoints(plantSite);
  return entries[(bot.patrol + 2) % entries.length] || guardPointAround(plantTarget.x, plantTarget.y, bot.patrol + 1);
}

function defenderHoldPoint(bot) {
  const points = [
    { x: 315, y: 238 },
    { x: 640, y: 238 },
    { x: 965, y: 238 },
    { x: 300, y: 418 },
    { x: 980, y: 418 },
    { x: 640, y: 382 },
  ];
  return points[bot.patrol % points.length];
}

function keepBotSpacing(bot, dt) {
  let pushX = 0;
  let pushY = 0;
  for (const other of game.bots) {
    if (other === bot || !other.alive) continue;
    const dx = bot.x - other.x;
    const dy = bot.y - other.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0 && distance < 72) {
      const strength = (72 - distance) / 72;
      pushX += (dx / distance) * strength;
      pushY += (dy / distance) * strength;
    }
  }
  const length = Math.hypot(pushX, pushY);
  if (length > 0) {
    moveEntity(bot, (pushX / length) * bot.speed * 0.42 * dt, (pushY / length) * bot.speed * 0.42 * dt, map.walls);
  }
}

function updateBots(dt) {
  const p = game.player;
  const carrier = ensureBotSpikeCarrier();
  const botDefuser = game.playerSide === "attackers" && game.spike.state === "planted"
    ? closestAliveBotTo(game.spike.x, game.spike.y)
    : null;
  const droppedSpikePicker = game.playerSide === "defenders" && game.spike.state === "dropped"
    ? closestAliveBotTo(game.spike.x, game.spike.y)
    : null;
  const botPlantSite = map.sites[game.roundNumber % 2];
  const botPlantTarget = siteCenter(botPlantSite);

  for (const bot of game.bots) {
    if (!bot.alive) continue;
    const seesPlayer = botCanSeePlayer(bot);
    updateBotAwareness(bot, seesPlayer, dt);

    if (game.playerSide === "attackers" && bot === botDefuser) {
      if (botDefuseSpike(bot, dt)) {
        continue;
      }
    }

    if (game.playerSide === "defenders" && bot === droppedSpikePicker) {
      botFightPlayer(bot, dt, { strafe: false });
      if (Math.hypot(bot.x - game.spike.x, bot.y - game.spike.y) < 34) {
        bot.hasSpike = true;
        game.spike.state = "carried";
        game.spike.owner = "bot";
        setMessage("Outro bot recuperou a spike.");
      } else {
        moveBotToward(bot, game.spike, dt, 1.18);
      }
      continue;
    }

    if (game.playerSide === "defenders" && bot === carrier && game.spike.state === "carried") {
      botFightPlayer(bot, dt, { strafe: false });
      if (rectContainsPadded(botPlantSite, bot.x, bot.y, bot.r * 0.65) && botPlantSpike(bot, dt)) {
        continue;
      }
      const carrierTarget = plantTargetForSite(botPlantSite, bot);
      moveBotToward(bot, carrierTarget, dt, 1.12);
      continue;
    }

    if (game.playerSide === "defenders" && bot === carrier && game.spike.state === "bot_planting") {
      if (botPlantSpike(bot, dt)) {
        continue;
      }
    }

    if (game.playerSide === "defenders" && game.spike.state !== "planted") {
      botFightPlayer(bot, dt, { strafe: false });
      const supportTarget = attackSupportPoint(bot, carrier, botPlantSite, botPlantTarget);
      const closeEnough = Math.hypot(bot.x - supportTarget.x, bot.y - supportTarget.y) < 34;
      if (!closeEnough) {
        moveBotToward(bot, supportTarget, dt, 1.08);
      } else if (!botCanSeePlayer(bot)) {
        bot.angle = Math.atan2(botPlantTarget.y - bot.y, botPlantTarget.x - bot.x);
      }
      continue;
    }

    const route = map.botRoutes[bot.patrol % map.botRoutes.length];
    let waypoint = route[bot.routeIndex % route.length];
    if (game.spike.state === "planted") {
      const guardAngle = (bot.patrol / Math.max(1, game.bots.length)) * Math.PI * 2;
      waypoint = {
        x: game.spike.x + Math.cos(guardAngle) * 92,
        y: game.spike.y + Math.sin(guardAngle) * 72,
      };
    } else if (game.playerSide === "attackers") {
      waypoint = defenderHoldPoint(bot);
    } else if (game.playerSide === "defenders") {
      const guardAngle = (bot.patrol / Math.max(1, game.bots.length)) * Math.PI * 2;
      waypoint = {
        x: botPlantTarget.x + Math.cos(guardAngle) * 105,
        y: botPlantTarget.y + Math.sin(guardAngle) * 82,
      };
    }
    if (!seesPlayer && lineIntersectsAnyWall(bot.x, bot.y, waypoint.x, waypoint.y)) {
      bot.routeIndex = (bot.routeIndex + 1) % route.length;
      waypoint = route[bot.routeIndex % route.length];
    }
    const investigating = !seesPlayer && bot.memoryTimer > 0 && bot.lastKnownPlayer;
    const memoryTargetClear = investigating && !lineIntersectsAnyWall(bot.x, bot.y, bot.lastKnownPlayer.x, bot.lastKnownPlayer.y);
    const target = seesPlayer ? p : memoryTargetClear ? bot.lastKnownPlayer : waypoint;
    const angle = Math.atan2(target.y - bot.y, target.x - bot.x);
    bot.angle = angle;

    if (!seesPlayer) {
      if (bot.wait > 0) {
        bot.wait -= dt;
      } else {
        const speed = memoryTargetClear ? bot.speed * 1.15 : bot.speed;
        const movedNow = moveBotToward(bot, target, dt, speed / bot.speed);
        if (movedNow < 0.5) {
          bot.stuck += dt;
        }
      }

      if (memoryTargetClear && Math.hypot(bot.lastKnownPlayer.x - bot.x, bot.lastKnownPlayer.y - bot.y) < 38) {
        bot.memoryTimer = 0;
        bot.lastKnownPlayer = null;
        bot.wait = 0.35;
      } else if (!memoryTargetClear && Math.hypot(waypoint.x - bot.x, waypoint.y - bot.y) < 34) {
        bot.routeIndex = (bot.routeIndex + 1) % route.length;
        bot.wait = 0.25 + Math.random() * 0.35;
      }

      const moved = Math.hypot(bot.x - bot.lastX, bot.y - bot.lastY);
      bot.stuck = moved < 2 ? bot.stuck + dt : Math.max(0, bot.stuck - dt * 2);
      bot.lastX = bot.x;
      bot.lastY = bot.y;
      if (bot.stuck > 0.7) {
        bot.routeIndex = (bot.routeIndex + 1) % route.length;
        bot.stuck = 0;
      }
    } else {
      botFightPlayer(bot, dt);
    }
    keepBotSpacing(bot, dt);
  }
}

function updateBullets(dt) {
  for (const bullet of game.bullets) {
    const oldX = bullet.x;
    const oldY = bullet.y;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    if (map.walls.some((wall) => lineIntersectsRect(oldX, oldY, bullet.x, bullet.y, wall))) {
      spawnParticles(bullet.x, bullet.y, "#9aaeba", 4, 70);
      bullet.life = 0;
      continue;
    }

    if (bullet.team === "player") {
      for (const bot of game.bots) {
        if (bot.alive && segmentCircleHit(oldX, oldY, bullet.x, bullet.y, bot, 6)) {
          applyDamage(bot, bullet.damage);
          game.hitMarkers.push({ x: bot.x, y: bot.y - 28, life: 0.35, maxLife: 0.35, color: "#ffd166" });
          spawnParticles(bullet.x, bullet.y, "#4fb3ff", 10, 130);
          bullet.life = 0;
          if (bot.hp <= 0) {
            bot.alive = false;
            if (game.spike.defuserId === bot.id) {
              resetPartialDefuse();
            }
            if (bot.hasSpike) {
              bot.hasSpike = false;
              game.spike.state = "dropped";
              game.spike.owner = null;
              game.spike.x = bot.x;
              game.spike.y = bot.y;
              game.spike.plantProgress = 0;
              setMessage("Spike derrubada. Bots tentarao recuperar.");
            }
          }
          break;
        }
      }
    } else if (game.player.alive && segmentCircleHit(oldX, oldY, bullet.x, bullet.y, game.player, 3)) {
      applyDamage(game.player, bullet.damage);
      game.hitMarkers.push({ x: game.player.x, y: game.player.y - 30, life: 0.3, maxLife: 0.3, color: "#ff5b5b" });
      spawnParticles(bullet.x, bullet.y, "#ff4d5d", 8, 120);
      game.shake = Math.max(game.shake, 0.1);
      bullet.life = 0;
      if (game.player.hp <= 0) {
        game.player.alive = false;
        const winner = game.playerSide === "attackers" ? "defenders" : "attackers";
        endRound(winner, game.playerSide === "attackers"
          ? "Voce foi eliminado. Defensores venceram."
          : "Voce foi eliminado. Atacantes venceram.");
      }
    }
  }
  game.bullets = game.bullets.filter((b) => b.life > 0);
}

function updateSpike(dt) {
  if (game.spike.state === "bot_planting" && game.spike.owner === "bot") {
    const carrier = game.bots.find((bot) => bot.alive && bot.hasSpike);
    if (!carrier) {
      game.spike.state = "dropped";
      game.spike.owner = null;
      game.spike.plantProgress = 0;
      setMessage("Carrier eliminado. Spike caiu.");
    }
  }

  if (game.spike.state === "carried" && game.spike.owner === "bot") {
    const carrier = game.bots.find((bot) => bot.alive && bot.hasSpike);
    if (carrier) {
      game.spike.x = carrier.x;
      game.spike.y = carrier.y;
    } else {
      game.spike.state = "dropped";
      game.spike.owner = null;
    }
  }

  if (game.spike.state === "planted") {
    game.spike.timer -= dt;
    if (game.spike.timer <= 0) {
      spawnSpikeExplosion(game.spike.x, game.spike.y);
      endRound("attackers", "Spike detonou. Atacantes venceram.");
    }
  }
}

function updateTimers(dt) {
  game.phaseTime -= dt;
  game.abilityCooldown = Math.max(0, game.abilityCooldown - dt);
  game.shake = Math.max(0, game.shake - dt);
  const wasReloading = game.reloadTimer > 0;
  game.reloadTimer = Math.max(0, game.reloadTimer - dt);
  if (wasReloading && game.reloadTimer === 0) {
    game.player.ammo = currentMagSize();
  }
  game.revealTimer = Math.max(0, game.revealTimer - dt);
  for (const smoke of game.smokes) smoke.life -= dt;
  game.smokes = game.smokes.filter((s) => s.life > 0);
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.88;
    particle.vy *= 0.88;
    particle.life -= dt;
  }
  game.particles = game.particles.filter((p) => p.life > 0);
  for (const step of game.footsteps) {
    step.r += 90 * dt;
    step.life -= dt;
  }
  game.footsteps = game.footsteps.filter((step) => step.life > 0);
  for (const marker of game.hitMarkers) {
    marker.y -= 22 * dt;
    marker.life -= dt;
  }
  game.hitMarkers = game.hitMarkers.filter((marker) => marker.life > 0);
  for (const explosion of game.explosions) {
    explosion.life -= dt;
    const progress = 1 - Math.max(0, explosion.life) / explosion.maxLife;
    explosion.r = explosion.maxR * progress;
  }
  game.explosions = game.explosions.filter((explosion) => explosion.life > 0);

  if (game.phase === "buy" && game.phaseTime <= 0) startActionRound();
  if (game.phase === "action" && game.phaseTime <= 0 && game.spike.state !== "planted") {
    endRound("defenders", "Tempo acabou. Defensores venceram.");
  }
  if (game.phase === "ended" && game.phaseTime <= 0) resetRound();
}

function checkWinConditions() {
  if (game.phase !== "action") return;
  if (game.bots.every((bot) => !bot.alive)) {
    if (game.playerSide === "defenders" && game.spike.state === "planted") {
      setMessage("Atacantes eliminados. Agora desarme a spike.");
      return;
    }
    endRound(game.playerSide, game.playerSide === "attackers"
      ? "Defensores eliminados. Atacantes venceram."
      : "Atacantes eliminados. Defensores venceram.");
  }
}

function update(dt) {
  if (game.paused) return;
  updateTimers(dt);
  if (game.phase === "action") {
    updatePlayer(dt);
    updateBots(dt);
    updateBullets(dt);
    updateSpike(dt);
    checkWinConditions();
  }
}

function drawMap() {
  ctx.fillStyle = "#142028";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1b2b35";
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.fillRect(x, 0, 1, canvas.height);
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  for (const site of map.sites) {
    ctx.fillStyle = "rgba(255, 209, 102, 0.12)";
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2;
    ctx.fillRect(site.x, site.y, site.w, site.h);
    ctx.strokeRect(site.x, site.y, site.w, site.h);
    ctx.fillStyle = "#ffd166";
    ctx.font = "bold 24px Segoe UI";
    ctx.fillText(site.id, site.x + 14, site.y + 32);
  }

  ctx.fillStyle = "#293944";
  ctx.strokeStyle = "#41515d";
  for (const wall of map.walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function weaponVisual(weapon) {
  const id = weapon?.id || "pistol";
  if (id.includes("sniper")) return { length: 34, width: 4, barrel: 16, stock: 8, color: "#d6dee8" };
  if (id.includes("lmg")) return { length: 31, width: 8, barrel: 10, stock: 10, color: "#b7c2cc" };
  if (id.includes("shotgun")) return { length: 28, width: 7, barrel: 9, stock: 9, color: "#d8b26e" };
  if (id.includes("dmr") || id.includes("rifle") || id.includes("carbine")) return { length: 29, width: 5, barrel: 11, stock: 8, color: "#c9d2dc" };
  if (id.includes("smg")) return { length: 23, width: 6, barrel: 7, stock: 5, color: "#9bd4ff" };
  if (id.includes("revolver")) return { length: 18, width: 6, barrel: 7, stock: 3, color: "#ffd166" };
  return { length: 17, width: 5, barrel: 5, stock: 2, color: "#eef7fb" };
}

function drawHeldWeapon(entity, weapon, kind) {
  const visual = weaponVisual(weapon);
  const scale = 0.72;
  const length = visual.length * scale;
  const width = visual.width * scale;
  const barrel = visual.barrel * scale;
  const stock = visual.stock * scale;
  ctx.fillStyle = "rgba(0,0,0,0.42)";
  ctx.fillRect(entity.r - 1, -width / 2 - 1, length, width + 2);
  ctx.fillStyle = visual.color;
  ctx.fillRect(entity.r, -width / 2, length, width);
  ctx.fillStyle = "#101820";
  ctx.fillRect(entity.r + length - 1, -1.2, barrel, 2.4);
  ctx.fillRect(entity.r - stock, -width / 2 + 1, stock, Math.max(2, width - 2));
  if (weapon?.id === "lmg") {
    ctx.fillStyle = "#596875";
    ctx.fillRect(entity.r + 6, width / 2, 8, 5);
  }
  if (weapon?.id === "sniper") {
    ctx.strokeStyle = kind === "player" ? "#ffd166" : "#9bd4ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(entity.r + 11, -width, 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawEntity(entity, color, label, kind = "bot") {
  if (!entity.alive) return;
  const weapon = kind === "player" ? game.selectedWeapon : entity.weapon;
  const armorRatio = (entity.maxArmor || 0) > 0 ? Math.max(0, entity.armor || 0) / entity.maxArmor : 0;
  ctx.save();
  ctx.translate(entity.x, entity.y);
  ctx.rotate(entity.angle);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 6, entity.r + 6, entity.r * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, entity.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = kind === "player" ? "#ffffff" : "rgba(255,255,255,0.45)";
  ctx.lineWidth = kind === "player" ? 3 : 2;
  ctx.stroke();
  if (armorRatio > 0) {
    ctx.strokeStyle = "#46a8ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, entity.r + 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * armorRatio);
    ctx.stroke();
  }
  ctx.fillStyle = kind === "player" ? "#101820" : "#0b1115";
  ctx.beginPath();
  ctx.moveTo(entity.r + 14, 0);
  ctx.lineTo(2, -7);
  ctx.lineTo(2, 7);
  ctx.closePath();
  ctx.fill();
  drawHeldWeapon(entity, weapon, kind);
  ctx.fillStyle = "#0b1115";
  ctx.fillRect(-8, -entity.r - 2, 16, 5);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(-entity.r * 0.45, -entity.r * 0.55, entity.r * 0.9, 3);
  ctx.restore();

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(entity.x - 20, entity.y - entity.r - 15, 40, 5);
  const maxHp = entity.maxHp || 100;
  ctx.fillStyle = entity.hp > maxHp * 0.4 ? "#66e48f" : "#ff5b5b";
  ctx.fillRect(entity.x - 20, entity.y - entity.r - 15, Math.max(0, entity.hp / maxHp) * 40, 5);
  if ((entity.maxArmor || 0) > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(entity.x - 20, entity.y - entity.r - 8, 40, 4);
    ctx.fillStyle = "#46a8ff";
    ctx.fillRect(entity.x - 20, entity.y - entity.r - 8, armorRatio * 40, 4);
  }

  if (kind === "player" && game.reloadTimer > 0) {
    const reloadRatio = 1 - game.reloadTimer / currentReloadTime();
    const barY = entity.y + entity.r + 8;
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.fillRect(entity.x - 24, barY, 48, 6);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(entity.x - 24, barY, Math.max(0, Math.min(1, reloadRatio)) * 48, 6);
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.strokeRect(entity.x - 24, barY, 48, 6);
  }

  if (label) {
    ctx.fillStyle = "#eef7fb";
    ctx.font = "12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(label, entity.x, entity.y + entity.r + (kind === "player" && game.reloadTimer > 0 ? 26 : 18));
    ctx.textAlign = "left";
  }
}

function drawSpike() {
  if (game.spike.state === "carried") return;
  const x = game.spike.x;
  const y = game.spike.y;
  const planted = game.spike.state === "planted";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = planted ? "#ff4d5d" : "#ffd166";
  ctx.fillRect(-11, -11, 22, 22);
  ctx.strokeStyle = "#111820";
  ctx.lineWidth = 3;
  ctx.strokeRect(-11, -11, 22, 22);
  ctx.fillStyle = "#101820";
  ctx.fillRect(-5, -5, 10, 10);
  ctx.restore();

  if (planted) {
    const timerRatio = Math.max(0, game.spike.timer / SPIKE_DETONATE_TIME);
    ctx.strokeStyle = "#ff4d5d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 24, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * timerRatio);
    ctx.stroke();

    if (game.spike.defuseProgress > 0) {
      ctx.strokeStyle = "#66e48f";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(x, y, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * game.spike.defuseProgress);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 2;
    for (let i = 1; i <= 2; i++) {
      const a = -Math.PI / 2 + Math.PI * 2 * (i / 3);
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 25, y + Math.sin(a) * 25);
      ctx.lineTo(x + Math.cos(a) * 37, y + Math.sin(a) * 37);
      ctx.stroke();
    }

    ctx.fillStyle = "#eef7fb";
    ctx.font = "bold 12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.ceil(game.spike.timer)}s`, x, y - 34);
    ctx.textAlign = "left";
  }
}

function drawRadar() {
  const x = 18;
  const y = 18;
  const w = 150;
  const h = 86;
  ctx.save();
  ctx.fillStyle = "rgba(5, 10, 15, 0.62)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(238,247,251,0.18)";
  ctx.strokeRect(x, y, w, h);
  for (const site of map.sites) {
    ctx.strokeStyle = "rgba(255,209,102,0.65)";
    ctx.strokeRect(x + site.x / map.width * w, y + site.y / map.height * h, site.w / map.width * w, site.h / map.height * h);
  }
  const dot = (px, py, color, size = 3) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + px / map.width * w, y + py / map.height * h, size, 0, Math.PI * 2);
    ctx.fill();
  };
  dot(game.player.x, game.player.y, "#ffffff", 3.5);
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    const visible = game.revealTimer > 0 || hasLineOfSight(game.player, bot) || bot.memoryTimer > 0;
    if (visible) dot(bot.x, bot.y, bot.side === "attackers" ? "#ff8a5b" : "#4fb3ff", 2.8);
  }
  if (game.spike.state !== "carried") dot(game.spike.x, game.spike.y, "#ffd166", 3);
  ctx.restore();
}

function draw() {
  ctx.save();
  if (game.shake > 0) {
    const amount = game.shake * 18;
    ctx.translate((Math.random() - 0.5) * amount, (Math.random() - 0.5) * amount);
  }

  drawMap();

  for (const smoke of game.smokes) {
    ctx.fillStyle = "rgba(82, 71, 115, 0.78)";
    ctx.beginPath();
    ctx.arc(smoke.x, smoke.y, smoke.r, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSpike();

  for (const step of game.footsteps) {
    const alpha = Math.max(0, step.life / step.maxLife) * 0.35;
    ctx.strokeStyle = step.team === "player" ? `rgba(255,255,255,${alpha})` : `rgba(255,209,102,${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(step.x, step.y, step.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (const bot of game.bots) {
    const visible = game.revealTimer > 0 || hasLineOfSight(game.player, bot);
    const label = `${bot.side === "attackers" ? "ATK" : "DEF"} ${bot.weapon?.name || "Pistol"}`;
    const color = bot.side === "attackers" ? "#ff8a5b" : "#4fb3ff";
    drawEntity(bot, visible ? color : "#274351", visible ? label : "", "bot");
  }
  drawEntity(game.player, game.selectedAgent.color, game.playerSide === "attackers" ? "YOU ATK" : "YOU DEF", "player");

  ctx.fillStyle = "#f8fafc";
  for (const bullet of game.bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const particle of game.particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const marker of game.hitMarkers) {
    const alpha = Math.max(0, marker.life / marker.maxLife);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = marker.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marker.x - 7, marker.y - 7);
    ctx.lineTo(marker.x + 7, marker.y + 7);
    ctx.moveTo(marker.x + 7, marker.y - 7);
    ctx.lineTo(marker.x - 7, marker.y + 7);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  for (const explosion of game.explosions) {
    const alpha = Math.max(0, explosion.life / explosion.maxLife);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 10 * alpha;
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#ff4d5d";
    ctx.lineWidth = 4 * alpha;
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.r * 0.72, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
  ctx.moveTo(mouse.x - 15, mouse.y);
  ctx.lineTo(mouse.x + 15, mouse.y);
  ctx.moveTo(mouse.x, mouse.y - 15);
  ctx.lineTo(mouse.x, mouse.y + 15);
  ctx.stroke();
  drawRadar();
  ctx.restore();
}

function updateUi() {
  ui.phase.textContent = game.paused
    ? "Pause"
    : game.phase === "buy"
        ? "Compra"
        : game.phase === "action"
          ? "Round"
          : game.phase === "matchOver"
            ? "Partida"
            : "Fim";
  ui.timer.textContent = game.spike.state === "planted"
    ? `Spike ${Math.max(0, Math.ceil(game.spike.timer))}`
    : Math.max(0, Math.ceil(game.phaseTime)).toString();
  ui.score.textContent = `${game.playerScore} - ${game.enemyScore}`;
  ui.money.textContent = `$${game.money}`;
  ui.agent.textContent = `${game.selectedAgent.name} ${game.playerSide === "attackers" ? "ATK" : "DEF"} (${game.abilityCooldown > 0 ? Math.ceil(game.abilityCooldown) : "E"})`;
  ui.weapon.textContent = game.selectedWeapon.name;
  ui.hp.textContent = `${Math.max(0, Math.ceil(game.player.hp))}${game.player.armor > 0 ? ` +${Math.ceil(game.player.armor)}` : ""}`;
  ui.ammo.textContent = game.reloadTimer > 0 ? "Recarregando" : `${game.player.ammo} / ${currentMagSize()}`;
  ui.spike.textContent = game.spike.state === "carried"
    ? game.spike.owner === "player" ? "Com voce" : "Com bots"
    : game.spike.state === "dropped"
      ? "Derrubada"
    : game.spike.state === "planted"
      ? (game.spike.defuseProgress > 0 ? `Defuse ${Math.round(game.spike.defuseProgress * 100)}%` : `${Math.ceil(game.spike.timer)}s`)
      : "Plantando";
  ui.hpBar.style.transform = `scaleX(${Math.max(0, game.player.hp) / game.player.maxHp})`;
  ui.ammoBar.style.transform = `scaleX(${game.reloadTimer > 0 ? 1 - game.reloadTimer / currentReloadTime() : game.player.ammo / currentMagSize()})`;
  ui.plantBar.style.transform = `scaleX(${
    game.spike.state === "planting" || game.spike.state === "bot_planting" || game.spike.plantProgress > 0
      ? game.spike.plantProgress
      : game.spike.state === "planted"
        ? (game.spike.defuseProgress > 0 ? game.spike.defuseProgress : game.spike.timer / SPIKE_DETONATE_TIME)
        : 0
  })`;
  ui.message.querySelector("strong").textContent = game.message;
  ui.message.querySelector("span").textContent = game.paused
    ? "Jogo pausado. Aperte P ou clique em Continuar."
    : game.playerSide === "attackers"
      ? "WASD move, mouse mira, clique atira, E habilidade, F planta, P pause."
      : "WASD move, mouse mira, clique atira, E habilidade, F desarma, P pause.";
  ui.pauseButton.textContent = game.paused ? "Continuar" : "Pause";
  ui.shopButton.textContent = ui.shop.classList.contains("hidden") ? "Loja" : "Fechar";
}

function togglePause() {
  if (game.phase === "matchOver") return;
  game.paused = !game.paused;
  setMessage(game.paused ? "Jogo pausado." : "Jogo retomado.");
  updateUi();
}

function toggleShop() {
  if (game.phase !== "buy") {
    setMessage("A loja so abre na fase de compra.");
    updateUi();
    return;
  }
  ui.shop.classList.toggle("hidden");
  updateUi();
}

function buildShop() {
  ui.agentButtons.innerHTML = "";
  for (const agent of agents) {
    const button = document.createElement("button");
    button.className = "choice";
    button.innerHTML = `<b>${agent.name}</b><span>${agent.role}: ${agent.ability}</span>`;
    button.addEventListener("click", () => {
      game.selectedAgent = agent;
      updateShopState();
      updateUi();
    });
    ui.agentButtons.appendChild(button);
  }

  ui.weaponButtons.innerHTML = "";
  for (const weapon of weapons) {
    const button = document.createElement("button");
    button.className = "choice";
    const owned = game.ownedWeapons.has(weapon.id);
    button.innerHTML = `<b>${weapon.name} <em>${owned ? "Comprada" : `$${weapon.price}`}</em></b><span>${weapon.damage} dano, pente ${weapon.mag}</span>`;
    button.addEventListener("click", () => {
      if (game.phase !== "buy") return;
      const alreadyOwned = game.ownedWeapons.has(weapon.id);
      if (!alreadyOwned && game.money < weapon.price) {
        setMessage("Creditos insuficientes.");
        updateUi();
        return;
      }
      if (!alreadyOwned) {
        game.money -= weapon.price;
        game.ownedWeapons.add(weapon.id);
      }
      game.selectedWeapon = weapon;
      game.player.weapon = weapon;
      game.player.ammo = currentMagSize();
      setMessage(alreadyOwned ? `${weapon.name} equipada.` : `${weapon.name} comprada e equipada.`);
      updateShopState();
      updateUi();
    });
    ui.weaponButtons.appendChild(button);
  }

  ui.equipmentButtons.innerHTML = "";
  for (const item of equipment) {
    const button = document.createElement("button");
    button.className = "choice";
    button.innerHTML = `<b>${item.name} - $${item.price}</b><span>${item.desc}</span>`;
    button.addEventListener("click", () => {
      if (game.phase !== "buy") return;
      if (equipmentOwned(item)) {
        setMessage("Esse equipamento ja esta ativo.");
        updateUi();
        return;
      }
      if (game.money < item.price) {
        setMessage("Creditos insuficientes.");
        updateUi();
        return;
      }
      game.money -= item.price;
      item.apply();
      game.player.maxHp = 100;
      game.player.hp = Math.min(100, game.player.hp);
      game.player.maxArmor = game.upgrades.armorCapacity;
      game.player.armor = game.armor;
      game.player.speed = game.upgrades.speed ? 248 : 225;
      game.player.ammo = Math.min(currentMagSize(), Math.max(game.player.ammo, currentMagSize()));
      setMessage(`${item.name} comprado.`);
      updateShopState();
      updateUi();
    });
    ui.equipmentButtons.appendChild(button);
  }
  updateShopState();
}

function equipmentOwned(item) {
  if (item.id === "lightArmor") return (game.player?.armor || 0) >= 25;
  if (item.id === "heavyArmor") return (game.player?.armor || 0) >= 50;
  if (item.id === "boots") return game.upgrades.speed;
  if (item.id === "magazine") return game.upgrades.magazine;
  if (item.id === "reloadKit") return game.upgrades.reload;
  return false;
}

function updateShopState() {
  [...ui.agentButtons.children].forEach((button, i) => button.classList.toggle("active", agents[i] === game.selectedAgent));
  [...ui.weaponButtons.children].forEach((button, i) => {
    const weapon = weapons[i];
    const owned = game.ownedWeapons.has(weapon.id);
    button.classList.toggle("active", weapon === game.selectedWeapon);
    button.classList.toggle("owned", owned);
    const status = button.querySelector("em");
    if (status) status.textContent = weapon === game.selectedWeapon ? "Equipada" : owned ? "Comprada" : `$${weapon.price}`;
  });
  [...ui.equipmentButtons.children].forEach((button, i) => button.classList.toggle("active", equipmentOwned(equipment[i])));
}

function loop(now) {
  const dt = Math.min(0.033, (now - loop.last) / 1000 || 0);
  loop.last = now;
  update(dt);
  draw();
  updateUi();
  pressed.clear();
  requestAnimationFrame(loop);
}
loop.last = performance.now();

window.addEventListener("keydown", (event) => {
  if (!event.repeat) pressed.add(event.key.toLowerCase());
  keys.add(event.key.toLowerCase());
  if (!event.repeat && event.key.toLowerCase() === "p") {
    togglePause();
  }
  if (event.key === "Escape") {
    toggleShop();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener("mousedown", () => {
  mouse.down = true;
});

window.addEventListener("mouseup", () => {
  mouse.down = false;
});

ui.pauseButton.addEventListener("click", togglePause);
ui.shopButton.addEventListener("click", toggleShop);
ui.newGameButton.addEventListener("click", startNewMatch);

buildShop();
startNewMatch();
requestAnimationFrame(loop);
