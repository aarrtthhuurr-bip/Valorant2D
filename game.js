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
  shopTabs: document.getElementById("shopTabs"),
  message: document.getElementById("message"),
  agentButtons: document.getElementById("agentButtons"),
  weaponButtons: document.getElementById("weaponButtons"),
  equipmentButtons: document.getElementById("equipmentButtons"),
  allyButtons: document.getElementById("allyButtons"),
  hpBar: document.getElementById("hpBar"),
  ammoBar: document.getElementById("ammoBar"),
  plantBar: document.getElementById("plantBar"),
  shopButton: document.getElementById("shopButton"),
  shopBackdrop: document.getElementById("shopBackdrop"),
  pauseButton: document.getElementById("pauseButton"),
  matchOverlay: document.getElementById("matchOverlay"),
  overlayKicker: document.getElementById("overlayKicker"),
  overlayTitle: document.getElementById("overlayTitle"),
  overlayText: document.getElementById("overlayText"),
  newGameButton: document.getElementById("newGameButton"),
  menuOverlay: document.getElementById("menuOverlay"),
  menuKicker: document.getElementById("menuKicker"),
  menuTitle: document.getElementById("menuTitle"),
  menuText: document.getElementById("menuText"),
  menuButtons: document.getElementById("menuButtons"),
  introOverlay: document.getElementById("introOverlay"),
  introMode: document.getElementById("introMode"),
  introMap: document.getElementById("introMap"),
  introTeam: document.getElementById("introTeam"),
  roundBanner: document.getElementById("roundBanner"),
  roundKicker: document.getElementById("roundKicker"),
  roundTitle: document.getElementById("roundTitle"),
  roundText: document.getElementById("roundText"),
  scoreboard: document.getElementById("scoreboard"),
  scoreboardTitle: document.getElementById("scoreboardTitle"),
  kills: document.getElementById("killsText"),
  deaths: document.getElementById("deathsText"),
  headshots: document.getElementById("headshotsText"),
  plants: document.getElementById("plantsText"),
  defuses: document.getElementById("defusesText"),
  scoreMoney: document.getElementById("scoreMoneyText"),
  sidePill: document.getElementById("sidePill"),
  roundLabel: document.getElementById("roundLabel"),
  moneyDelta: document.getElementById("moneyDelta"),
  buyBar: document.getElementById("buyBar"),
  buyBarFill: document.getElementById("buyBarFill"),
  agentDot: document.getElementById("agentDot"),
  armorBarWrap: document.getElementById("armorBarWrap"),
  armorBar: document.getElementById("armorBar"),
  armorText: document.getElementById("armorText"),
  armorValueText: document.getElementById("armorValueText"),
  ammoDots: document.getElementById("ammoDots"),
  killFeed: document.getElementById("killFeed"),
};

const keys = new Set();
const pressed = new Set();
const mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };
const SPIKE_DETONATE_TIME = 38;
const BOT_REACTION_TIME = 0.22;
const PLAYER_DEFUSE_TIME = 3.2;
const BOT_DEFUSE_TIME = 5.2;
const PLANT_TIME = 2.0;
const BUY_TIME = 8;
const MATCH_POINT = 15;
const audio = { ctx: null, enabled: true, volume: 0.8, last: 0 };
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

const allyItems = [
  { id: "allyArmor", name: "Coletes aliados", price: 1200, desc: "Equipe aliados com 35 de armadura", apply: () => { game.allyLoadout.armor = 35; } },
  { id: "allySmg", name: "SMG aliado", price: 1500, desc: "Aliados usam SMG", weaponId: "smg", apply: () => { game.allyLoadout.weaponId = "smg"; } },
  { id: "allyRifle", name: "Rifle aliado", price: 3200, desc: "Aliados usam Rifle", weaponId: "rifle", apply: () => { game.allyLoadout.weaponId = "rifle"; } },
  { id: "allySniper", name: "Sniper aliado", price: 5200, desc: "Um tiro forte, cadencia baixa", weaponId: "sniper", apply: () => { game.allyLoadout.weaponId = "sniper"; } },
];

function initAudio() {
  if (audio.ctx || !audio.enabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audio.ctx = new AudioContext();
}

function playTone(freq, duration = 0.06, type = "square", gain = 0.035) {
  if (!audio.enabled) return;
  initAudio();
  if (!audio.ctx) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const amp = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain * audio.volume, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(audio.ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playSound(name) {
  const now = performance.now();
  if (name === "shot" && now - audio.last < 45) return;
  audio.last = now;
  if (name === "shot")    playTone(110, 0.05, "square",   0.028);
  if (name === "hit")     { playTone(900, 0.04, "triangle", 0.04); playTone(600, 0.06, "triangle", 0.02); }
  if (name === "headshot"){ playTone(1200,0.05, "triangle", 0.05); playTone(800, 0.08, "sine",     0.03); }
  if (name === "reload")  playTone(280, 0.1,  "sawtooth",  0.022);
  if (name === "plant")   { playTone(440, 0.08, "sine", 0.04); playTone(660, 0.12, "sine", 0.03); }
  if (name === "round_win")  { playTone(523, 0.1, "sine", 0.04); playTone(659, 0.1, "sine", 0.04); playTone(784, 0.2, "sine", 0.045); }
  if (name === "round_lose") { playTone(392, 0.1, "sine", 0.04); playTone(330, 0.1, "sine", 0.04); playTone(262, 0.22,"sine", 0.045); }
  if (name === "spike")   playTone(80,  0.3,  "sawtooth",  0.055);
  if (name === "ability") playTone(620, 0.14, "triangle",  0.038);
}

const DEFAULT_MAP = {
  name: "Padrão",
  vibe: "arena",
  theme: {
    floor: "#142028",
    grid: "rgba(70, 168, 255, 0.07)",
    wall: "#293944",
    wallStroke: "#41515d",
    siteFill: "rgba(255, 209, 102, 0.12)",
    siteStroke: "#ffd166",
  },
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

function cloneRects(rects) {
  return rects.map((rect) => ({ ...rect }));
}

function makeMap(name, vibe, theme, wallChanges = [], siteChanges = null) {
  return {
    ...DEFAULT_MAP,
    name,
    vibe,
    theme: { ...DEFAULT_MAP.theme, ...theme },
    sites: siteChanges ? cloneRects(siteChanges) : cloneRects(DEFAULT_MAP.sites),
    walls: [...cloneRects(DEFAULT_MAP.walls), ...cloneRects(wallChanges)],
    botRoutes: DEFAULT_MAP.botRoutes.map((route) => route.map((point) => ({ ...point }))),
    attackerBotSpawns: DEFAULT_MAP.attackerBotSpawns.map((point) => ({ ...point })),
    defendersSpawn: DEFAULT_MAP.defendersSpawn.map((point) => ({ ...point })),
    attackersSpawn: { ...DEFAULT_MAP.attackersSpawn },
    playerDefenderSpawn: { ...DEFAULT_MAP.playerDefenderSpawn },
  };
}

const MAPS = [
  makeMap("Splitline", "Padrão", {}, []),
  makeMap("Miragem", "Deserto", {
    floor: "#1f1a12",
    grid: "rgba(255, 209, 102, 0.065)",
    wall: "#4a3a25",
    wallStroke: "#7c6036",
    siteFill: "rgba(255, 190, 80, 0.13)",
    siteStroke: "#ffc56e",
  }, [
    { x: 548, y: 360, w: 64, h: 76 },
    { x: 688, y: 360, w: 64, h: 76 },
  ]),
  makeMap("Neon Core", "Futurístico", {
    floor: "#101827",
    grid: "rgba(70, 168, 255, 0.12)",
    wall: "#203447",
    wallStroke: "#46a8ff",
    siteFill: "rgba(98, 230, 160, 0.1)",
    siteStroke: "#62e6a0",
  }, [
    { x: 350, y: 214, w: 110, h: 28 },
    { x: 820, y: 214, w: 110, h: 28 },
  ]),
  makeMap("Docas Ferro", "Galpão", {
    floor: "#151b1d",
    grid: "rgba(180, 194, 204, 0.06)",
    wall: "#343b3f",
    wallStroke: "#68727a",
    siteFill: "rgba(255, 77, 93, 0.09)",
    siteStroke: "#ff8a5b",
  }, [
    { x: 92, y: 420, w: 120, h: 32 },
    { x: 1068, y: 420, w: 120, h: 32 },
    { x: 570, y: 206, w: 140, h: 30 },
  ]),
  makeMap("Templo de Aster", "Templo antigo", {
    floor: "#161812",
    grid: "rgba(213, 249, 112, 0.055)",
    wall: "#35402b",
    wallStroke: "#7c8d50",
    siteFill: "rgba(213, 249, 112, 0.1)",
    siteStroke: "#d5f970",
  }, [
    { x: 268, y: 400, w: 80, h: 30 },
    { x: 932, y: 400, w: 80, h: 30 },
    { x: 610, y: 235, w: 60, h: 92 },
  ]),
];

function buildMapRoutes(currentMap) {
  const a = currentMap.sites[0];
  const b = currentMap.sites[1] || currentMap.sites[0];
  const centerA = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  const centerB = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const midTop = { x: currentMap.width * 0.5, y: currentMap.height * 0.24 };
  const mid = { x: currentMap.width * 0.5, y: currentMap.height * 0.5 };
  const midBottom = { x: currentMap.width * 0.5, y: currentMap.height * 0.76 };
  return [
    [currentMap.defendersSpawn[0], midTop, { x: centerA.x + 30, y: centerA.y - 80 }, centerA, { x: centerA.x, y: midBottom.y }],
    [currentMap.defendersSpawn[1], midTop, mid, midBottom, currentMap.attackersSpawn],
    [currentMap.defendersSpawn[2], midTop, { x: centerB.x - 30, y: centerB.y - 80 }, centerB, { x: centerB.x, y: midBottom.y }],
  ].map((route) => route.map((point) => ({ ...point })));
}

let map = MAPS[0];

const game = {
  map,
  phase: "buy",
  phaseTime: 8,
  paused: false,
  menuState: "none",
  scoreA: 0,
  scoreD: 0,
  playerScore: 0,
  enemyScore: 0,
  money: 800,
  roundNumber: 1,
  playerSide: "attackers",
  startingSide: "attackers",
  mapName: "Splitline",
  mode: "Normal",
  difficulty: "normal",
  sandbox: false,
  allyCount: 0,
  enemyFireMultiplier: 1.25,
  introTimer: 0,
  menuMapIndex: 0,
  menuMapTimer: 0,
  menuMapPan: 0,
  menuMapPanDir: 1,
  crosshairStyle: "default",
  arrowKeys: false,
  debugRoutes: false,
  shopTab: "weapons",
  damageIndicator: null,
  scoreboardVisible: false,
  roundBannerTimer: 0,
  training: false,
  tutorial: false,
  tutorialStep: 0,
  recoilHeat: 0,
  shotChain: 0,
  crosshairScale: 1,
  lossStreak: 0,
  stats: { kills: 0, deaths: 0, headshots: 0, plants: 0, defuses: 0, damage: 0 },
  selectedAgent: agents[0],
  selectedWeapon: weapons[0],
  ownedWeapons: new Set(["pistol"]),
  upgrades: { armorCapacity: 0, speed: false, magazine: false, reload: false },
  armor: 0,
  allyLoadout: { weaponId: "pistol", armor: 0 },
  roundMoneyDelta: 0,
  player: null,
  bots: [],
  allies: [],
  bullets: [],
  particles: [],
  explosions: [],
  hitMarkers: [],
  smokes: [],
  revealTimer: 0,
  spike: { state: "carried", owner: "player", x: 0, y: 0, timer: 0, site: null, plantProgress: 0, defuseProgress: 0, defuseCheckpoint: 0, defuserId: null },
  message: "Plante a spike em A ou B.",
  lastMessage: "",
  abilityCooldown: 0,
  abilityCharges: 2,
  lastShot: 0,
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
    routeIndex: 0,
    wait: 0,
    lastX: spawn.x,
    lastY: spawn.y,
    stuck: 0,
    strafe: index % 2 === 0 ? 1 : -1,
    lastKnownPlayer: null,
    memoryTimer: 0,
    idleTimer: 0,
    aiState: "hold",
    revealedTimer: 0,
  };
}

function makeAlly(spawn, index) {
  const weapon = weapons.find((item) => item.id === game.allyLoadout.weaponId) || weapons[0];
  const armor = game.allyLoadout.armor || 0;
  return {
    id: `ally-${index}`,
    x: spawn.x,
    y: spawn.y,
    r: 17,
    hp: 100,
    maxHp: 100,
    armor,
    maxArmor: armor,
    speed: 126 + index * 8,
    angle: game.playerSide === "attackers" ? -Math.PI / 2 : Math.PI / 2,
    alive: true,
    side: game.playerSide,
    weapon,
    fireTimer: 0.25 + index * 0.18,
    patrol: index + 3,
    routeIndex: 0,
    wait: 0,
    lastX: spawn.x,
    lastY: spawn.y,
    stuck: 0,
    strafe: index % 2 === 0 ? 1 : -1,
    lastKnownPlayer: null,
    memoryTimer: 0,
    idleTimer: 0,
    aiState: "follow",
    revealedTimer: 0,
  };
}

function resetRound() {
  game.roundNumber += game.phase === "ended" ? 1 : 0;
  const sideFlipped = Math.floor((game.roundNumber - 1) / 3) % 2 === 1;
  const nextSide = sideFlipped ? opposingSide(game.startingSide) : game.startingSide;
  const changedSide = game.playerSide !== nextSide;
  game.playerSide = nextSide;
  game.phase = "buy";
  game.phaseTime = game.sandbox || game.training ? 9999 : BUY_TIME;
  game.player = makePlayer();
  sanitizeEntityPosition(game.player);
  const botSpawns = game.playerSide === "attackers" ? map.defendersSpawn : map.attackerBotSpawns;
  game.bots = botSpawns.map(makeBot);
  const allySpawns = game.playerSide === "attackers"
    ? [{ x: map.attackersSpawn.x - 68, y: map.attackersSpawn.y }, { x: map.attackersSpawn.x + 68, y: map.attackersSpawn.y }]
    : [{ x: map.playerDefenderSpawn.x - 74, y: map.playerDefenderSpawn.y + 18 }, { x: map.playerDefenderSpawn.x + 74, y: map.playerDefenderSpawn.y + 18 }];
  game.allies = allySpawns.slice(0, game.allyCount).map(makeAlly);
  game.bots.forEach(sanitizeEntityPosition);
  game.allies.forEach(sanitizeEntityPosition);
  game.bullets = [];
  game.particles = [];
  game.explosions = [];
  game.hitMarkers = [];
  game.smokes = [];
  game.revealTimer = 0;
  game.abilityCooldown = 0;
  game.abilityCharges = game.selectedAgent.id === "mender" ? 1 : 2;
  game.lastShot = 0;
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
  if (!game.sandbox && !game.training) openShop();
}

function startActionRound() {
  game.phase = "action";
  game.phaseTime = game.training || game.sandbox ? 9999 : 90;
  closeShop();
  showRoundBanner(game.playerSide === "attackers" ? "Ataque" : "Defesa", game.playerSide === "attackers" ? "Plante a spike em A ou B." : "Impeca o plant ou desarme.", `Round ${game.roundNumber}`);
  setMessage(game.playerSide === "attackers"
    ? "Ataque: plante a spike em A ou B."
    : "Defesa: impeca o plant. Se plantarem, desarme com F.");
}

function openShop() {
  ui.shop.classList.remove("hidden");
  ui.shopBackdrop.classList.remove("hidden");
  ui.shopButton.style.display = "none";
}

function closeShop() {
  ui.shop.classList.add("hidden");
  ui.shopBackdrop.classList.add("hidden");
  ui.shopButton.style.display = "";
}

function fullReset() {
  game.selectedWeapon = weapons[0];
  game.ownedWeapons = new Set(["pistol"]);
  game.upgrades = { armorCapacity: 0, speed: false, magazine: false, reload: false };
  game.armor = 0;
  game.allyLoadout = { weaponId: "pistol", armor: 0 };
  game.selectedAgent = agents[0];
  buildShop();
}

function startNewMatch() {
  game.scoreA = 0;
  game.scoreD = 0;
  game.playerScore = 0;
  game.enemyScore = 0;
  game.money = game.sandbox || game.training ? 99999 : 800;
  game.lossStreak = 0;
  game.stats = { kills: 0, deaths: 0, headshots: 0, plants: 0, defuses: 0, damage: 0 };
  game.ownedWeapons = new Set(["pistol"]);
  game.upgrades = { armorCapacity: 0, speed: false, magazine: false, reload: false };
  game.armor = 0;
  game.allyLoadout = { weaponId: "pistol", armor: 0 };
  game.selectedWeapon = weapons[0];
  game.roundMoneyDelta = 0;
  game.roundNumber = 1;
  game.startingSide = Math.random() < 0.5 ? "attackers" : "defenders";
  game.playerSide = game.startingSide;
  map = MAPS[Math.floor(Math.random() * MAPS.length)];
  map.botRoutes = buildMapRoutes(map);
  game.map = map;
  game.mapName = map.name;
  resetRound();
  game.paused = false;
  game.menuState = "none";
  showIntro();
  ui.matchOverlay.classList.add("hidden");
  closeShop();
  setMessage(game.playerSide === "attackers"
    ? `Mapa ${game.mapName} (${map.vibe}). Seu time: Ataque. Plante a spike.`
    : `Mapa ${game.mapName} (${map.vibe}). Seu time: Defesa. Impeca o plant ou desarme.`);
}

function showMatchResult() {
  const won = game.playerScore >= MATCH_POINT;
  game.phase = "matchOver";
  game.phaseTime = 0;
  game.paused = false;
  closeShop();
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
  let moneyGained = 0;
  if (winner === game.playerSide) {
    game.playerScore += 1;
    game.lossStreak = 0;
    moneyGained = game.spike.state === "planted" ? 2300 : 2100;
    if (!game.sandbox) game.money += moneyGained;
  } else {
    game.enemyScore += 1;
    game.lossStreak += 1;
    moneyGained = 1500 + Math.min(3, game.lossStreak) * 250;
    if (!game.sandbox) game.money += moneyGained;
  }
  if (!game.sandbox && !game.training) game.money = Math.min(game.money, 12000);
  game.roundMoneyDelta = moneyGained;
  const won = winner === game.playerSide;
  const fullReason = game.sandbox ? reason : `${reason}  +${moneyGained}`;
  setMessage(fullReason);
  showRoundBanner(
    won ? "Round vencido" : "Round perdido",
    fullReason,
    `${game.playerScore} - ${game.enemyScore}`,
    2.8
  );
  playSound(won ? "round_win" : "round_lose");
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

function showRoundBanner(title, text, kicker = `Round ${game.roundNumber}`, duration = 2.2) {
  ui.roundKicker.textContent = kicker;
  ui.roundTitle.textContent = title;
  ui.roundText.textContent = text;
  ui.roundBanner.classList.remove("hidden");
  game.roundBannerTimer = duration;
}

function updateScoreboard() {
  ui.scoreboard.classList.toggle("hidden", !game.scoreboardVisible);
  ui.scoreboardTitle.textContent = `${game.playerScore} - ${game.enemyScore} | ${game.mapName}`;
  ui.kills.textContent = game.stats.kills;
  ui.deaths.textContent = game.stats.deaths;
  ui.headshots.textContent = game.stats.headshots;
  ui.plants.textContent = game.stats.plants;
  ui.defuses.textContent = game.stats.defuses;
  ui.scoreMoney.textContent = `$${game.money}`;
}

function tutorialText() {
  const steps = [
    "Use WASD para se mover ate um site.",
    "Mire com o mouse e clique para atirar nos bots.",
    "Com a spike, entre no site e aperte F para plantar.",
    "Defenda a spike ate ela explodir. Se estiver defendendo, segure F para desarmar.",
    "Abra a loja na compra, equipe armas e use E para habilidade.",
  ];
  return steps[Math.min(game.tutorialStep, steps.length - 1)];
}

function updateTutorial() {
  if (!game.tutorial) return;
  if (game.tutorialStep === 0 && (keys.has("w") || keys.has("a") || keys.has("s") || keys.has("d"))) game.tutorialStep = 1;
  if (game.tutorialStep === 1 && game.stats.kills > 0) game.tutorialStep = 2;
  if (game.tutorialStep === 2 && game.spike.state === "planted") game.tutorialStep = 3;
  if (game.tutorialStep === 3 && game.phase === "ended") game.tutorialStep = 4;
  setMessage(`Tutorial: ${tutorialText()}`);
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

function headCircle(entity) {
  return {
    x: entity.x + Math.cos(entity.angle) * entity.r * 0.28,
    y: entity.y + Math.sin(entity.angle) * entity.r * 0.28,
    r: entity.r * 0.42,
  };
}

function hitRegion(x1, y1, x2, y2, entity, padding = 0) {
  if (segmentCircleHit(x1, y1, x2, y2, headCircle(entity), padding * 0.55)) return "head";
  if (segmentCircleHit(x1, y1, x2, y2, entity, padding)) return "body";
  return null;
}

function damageForHit(bullet, target, region) {
  const traveled = Math.hypot(bullet.x - bullet.startX, bullet.y - bullet.startY);
  const falloff = traveled > 620 ? 0.78 : traveled > 420 ? 0.9 : 1;
  const headshot = region === "head" ? (bullet.weaponId === "shotgun" ? 1.25 : 1.75) : 1;
  return bullet.damage * falloff * headshot;
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
    game.shotChain += 1;
    const recoilGain = weapon.id === "sniper" ? 0.5 : weapon.id === "lmg" ? 0.26 : weapon.id === "smg" ? 0.22 : 0.18;
    game.recoilHeat = Math.min(2.6, game.recoilHeat + recoilGain);
    game.shake = Math.max(game.shake, 0.04);
    playSound("shot");
    spawnParticles(owner.x + Math.cos(owner.angle) * 24, owner.y + Math.sin(owner.angle) * 24, "#ffe6a8", 5, 90);
    if (owner.ammo <= 0) reload();
  }
  const count = weapon.pellets || 1;
  for (let i = 0; i < count; i++) {
    const base = Math.atan2(targetY - owner.y, targetX - owner.x);
    const movingPenalty = owner.moving ? 1.8 : 1;
    const recoilPenalty = team === "player" ? 1 + game.recoilHeat * 0.85 : 1 + (owner.aiState === "plant" || owner.aiState === "defuse" ? 0.55 : 0);
    const spread = (Math.random() - 0.5) * weapon.spread * 2 * movingPenalty * recoilPenalty;
    const startX = owner.x + Math.cos(base) * owner.r;
    const startY = owner.y + Math.sin(base) * owner.r;
    game.bullets.push({
      x: startX,
      y: startY,
      startX,
      startY,
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
  playSound("reload");
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
        game.stats.defuses += 1;
        if (!game.sandbox) game.money += 300;
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
    game.stats.plants += 1;
    if (!game.sandbox) game.money += 300;
    playSound("plant");
    setMessage(`Spike plantada no site ${game.spike.site}. Defenda.`);
  }
}

function updatePlayer(dt) {
  const p = game.player;
  if (!p.alive) return;

  const right = keys.has("d") || (game.arrowKeys && keys.has("arrowright"));
  const left = keys.has("a") || (game.arrowKeys && keys.has("arrowleft"));
  const down = keys.has("s") || (game.arrowKeys && keys.has("arrowdown"));
  const up = keys.has("w") || (game.arrowKeys && keys.has("arrowup"));
  const dx = (right ? 1 : 0) - (left ? 1 : 0);
  const dy = (down ? 1 : 0) - (up ? 1 : 0);
  const len = Math.hypot(dx, dy) || 1;
  p.moving = dx !== 0 || dy !== 0;
  moveEntity(p, (dx / len) * p.speed * dt, (dy / len) * p.speed * dt, map.walls);
  p.angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  if (game.spike.state === "carried" && game.spike.owner === "player") {
    game.spike.x = p.x;
    game.spike.y = p.y;
  }

  if (mouse.down) shoot(p, mouse.x, mouse.y, game.selectedWeapon, "player");
  if (keys.has("r")) reload();
  if (keys.has("e") && game.abilityCooldown <= 0 && game.abilityCharges > 0 && game.phase === "action") {
    game.selectedAgent.use(game);
    game.abilityCharges -= 1;
    game.abilityCooldown = game.selectedAgent.cooldown;
    playSound("ability");
    setMessage(`${game.selectedAgent.ability} usada. Cargas restantes: ${game.abilityCharges}.`);
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

function nearestWalkablePoint(point, fallback = point) {
  const cell = nearestWalkableCell(gridCellFromPoint(point));
  return cell ? gridPoint(cell) : { x: fallback.x, y: fallback.y };
}

function isEntityBlocked(entity) {
  return map.walls.some((wall) => circleRectCollides(entity, wall))
    || entity.x < entity.r
    || entity.x > map.width - entity.r
    || entity.y < entity.r
    || entity.y > map.height - entity.r;
}

function sanitizeEntityPosition(entity) {
  if (!isEntityBlocked(entity)) return;
  const safe = nearestWalkablePoint(entity);
  entity.x = safe.x;
  entity.y = safe.y;
  entity.lastX = safe.x;
  entity.lastY = safe.y;
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

function forceBotProgress(bot, target) {
  const step = findGridStep(bot, target) || nearestWalkablePoint(target, bot);
  const probe = { x: step.x, y: step.y, r: bot.r };
  if (map.walls.some((wall) => circleRectCollides(probe, wall))) return false;
  bot.x = step.x;
  bot.y = step.y;
  bot.lastX = step.x;
  bot.lastY = step.y;
  bot.stuck = 0;
  bot.idleTimer = 0;
  return true;
}

function moveBotToward(bot, target, dt, speedScale = 1) {
  const safeTarget = resolveBotTarget(bot, target);
  const angle = Math.atan2(safeTarget.y - bot.y, safeTarget.x - bot.x);
  bot.angle = angle;
  const movedNow = moveEntity(bot, Math.cos(angle) * bot.speed * speedScale * dt, Math.sin(angle) * bot.speed * speedScale * dt, map.walls);
  bot.moving = movedNow > 0.5;
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

function closestVisibleSquadTarget(bot) {
  return [game.player, ...game.allies]
    .filter((target) => canSeeTarget(bot, target, 560))
    .sort((a, b) => Math.hypot(a.x - bot.x, a.y - bot.y) - Math.hypot(b.x - bot.x, b.y - bot.y))[0] || null;
}

function canSeeTarget(bot, target, range = 540) {
  return target?.alive && hasLineOfSight(bot, target) && Math.hypot(target.x - bot.x, target.y - bot.y) < range;
}

function closestVisibleEnemy(bot) {
  return game.bots
    .filter((enemy) => canSeeTarget(bot, enemy, 560))
    .sort((a, b) => Math.hypot(a.x - bot.x, a.y - bot.y) - Math.hypot(b.x - bot.x, b.y - bot.y))[0] || null;
}

function botShootAt(bot, target, dt, team, firePenalty = 1) {
  const weapon = bot.weapon || weapons[0];
  const angle = Math.atan2(target.y - bot.y, target.x - bot.x);
  bot.angle = angle;
  bot.fireTimer -= dt;
  if (bot.fireTimer <= 0) {
    shoot(bot, target.x, target.y, weapon, team);
    const multiplier = team === "bot" ? game.enemyFireMultiplier : 1;
    bot.fireTimer = (weapon.fireRate + 0.18 + Math.random() * 0.22) * multiplier * firePenalty;
    bot.strafe *= -1;
  }
}

function updateBotAwareness(bot, seesPlayer, dt) {
  if (seesPlayer) {
    bot.reactionTimer = (bot.reactionTimer === undefined || bot.reactionTimer <= 0)
      ? BOT_REACTION_TIME + Math.random() * 0.18
      : bot.reactionTimer;
    bot.reactionTimer = Math.max(0, bot.reactionTimer - dt);
    bot.canShoot = bot.reactionTimer <= 0;
    bot.lastKnownPlayer = { x: game.player.x, y: game.player.y };
    bot.memoryTimer = 3.2;
    bot.revealedTimer = 2.6;
    alertBotSquad(bot, bot.lastKnownPlayer);
  } else {
    bot.reactionTimer = BOT_REACTION_TIME;
    bot.canShoot = false;
    bot.memoryTimer = Math.max(0, bot.memoryTimer - dt);
    bot.revealedTimer = Math.max(0, (bot.revealedTimer || 0) - dt);
  }
}

function alertBotSquad(source, point) {
  for (const bot of game.bots) {
    if (bot === source || !bot.alive) continue;
    const distance = Math.hypot(bot.x - source.x, bot.y - source.y);
    if (distance > 520) continue;
    bot.lastKnownPlayer = {
      x: point.x + (Math.random() - 0.5) * 36,
      y: point.y + (Math.random() - 0.5) * 36,
    };
    bot.memoryTimer = Math.max(bot.memoryTimer || 0, 1.8);
    bot.aiState = "alert";
  }
}

function findCoverPoint(bot, threat) {
  const candidates = [
    ...navigationPoints(),
    ...map.walls.flatMap((wall) => [
      { x: wall.x - 28, y: wall.y + wall.h / 2 },
      { x: wall.x + wall.w + 28, y: wall.y + wall.h / 2 },
      { x: wall.x + wall.w / 2, y: wall.y - 28 },
      { x: wall.x + wall.w / 2, y: wall.y + wall.h + 28 },
    ]),
  ];
  return candidates
    .map((point) => nearestWalkablePoint(point, bot))
    .filter((point) => Math.hypot(point.x - bot.x, point.y - bot.y) < 220)
    .filter((point) => lineIntersectsAnyWall(point.x, point.y, threat.x, threat.y))
    .sort((a, b) => Math.hypot(a.x - bot.x, a.y - bot.y) - Math.hypot(b.x - bot.x, b.y - bot.y))[0] || null;
}

function botFightPlayer(bot, dt, options = {}) {
  const target = closestVisibleSquadTarget(bot);
  const memTarget = !target && bot.lastKnownPlayer && bot.memoryTimer > 0 ? bot.lastKnownPlayer : null;
  const shootTarget = target || memTarget;
  if (!shootTarget) return false;

  const angle = Math.atan2(shootTarget.y - bot.y, shootTarget.x - bot.x);
  bot.angle = angle;
  if (target) {
    bot.lastKnownPlayer = { x: target.x, y: target.y };
    bot.memoryTimer = 3.2;
  }

  const cover = (options.preferCover || bot.hp < 45) ? findCoverPoint(bot, shootTarget) : null;
  if (cover && Math.hypot(bot.x - cover.x, bot.y - cover.y) > 20) {
    bot.aiState = "cover";
    moveBotToward(bot, cover, dt, 0.9);
  } else if (options.strafe !== false) {
    bot.aiState = "fight";
    const side = angle + Math.PI / 2;
    const movedNow = moveEntity(bot, Math.cos(side) * bot.speed * bot.strafe * 0.38 * dt, Math.sin(side) * bot.speed * bot.strafe * 0.38 * dt, map.walls);
    if (movedNow < 0.5) bot.strafe *= -1;
  } else {
    bot.aiState = options.state || "fight";
  }

  if (bot.canShoot !== false) botShootAt(bot, shootTarget, dt, "bot", options.firePenalty || 1);
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
  bot.aiState = "plant";
  botFightPlayer(bot, dt, { strafe: false, state: "plant", firePenalty: 1.75 });
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
  bot.aiState = "defuse";
  botFightPlayer(bot, dt, { strafe: dist <= 42, state: "defuse", firePenalty: 1.65 });
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
  const a = map.sites[0];
  const b = map.sites[1] || map.sites[0];
  const points = [
    ...siteEntryPoints(a),
    ...siteEntryPoints(b),
    { x: siteCenter(a).x, y: siteCenter(a).y - 70 },
    { x: siteCenter(b).x, y: siteCenter(b).y - 70 },
    { x: map.width * 0.5, y: map.height * 0.33 },
    { x: map.width * 0.5, y: map.height * 0.55 },
  ];
  return nearestWalkablePoint(points[bot.patrol % points.length], bot);
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

function keepSquadSpacing(entity, squad, dt) {
  let pushX = 0;
  let pushY = 0;
  for (const other of squad) {
    if (other === entity || !other.alive) continue;
    const dx = entity.x - other.x;
    const dy = entity.y - other.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0 && distance < 64) {
      const strength = (64 - distance) / 64;
      pushX += (dx / distance) * strength;
      pushY += (dy / distance) * strength;
    }
  }
  const length = Math.hypot(pushX, pushY);
  if (length > 0) {
    moveEntity(entity, (pushX / length) * entity.speed * 0.36 * dt, (pushY / length) * entity.speed * 0.36 * dt, map.walls);
  }
}

function allyObjectivePoint(ally, index) {
  if (game.spike.state === "planted") {
    const angle = (index / Math.max(1, game.allies.length)) * Math.PI * 2;
    return {
      x: game.spike.x + Math.cos(angle) * 86,
      y: game.spike.y + Math.sin(angle) * 64,
    };
  }
  if (game.playerSide === "attackers") {
    if (game.spike.state === "carried" && game.spike.owner === "player") {
      const side = index === 0 ? -1 : 1;
      return { x: game.player.x + side * 76, y: game.player.y + 48 };
    }
    const site = map.sites[game.roundNumber % map.sites.length];
    return siteEntryPoints(site)[index % siteEntryPoints(site).length];
  }
  const holds = [
    { x: 315, y: 238 },
    { x: 965, y: 238 },
    { x: 640, y: 382 },
  ];
  return holds[index % holds.length];
}

function updateAllies(dt) {
  const squad = [game.player, ...game.allies];
  game.allies.forEach((ally, index) => {
    if (!ally.alive) return;
    const enemy = closestVisibleEnemy(ally);
    if (enemy) {
      const side = ally.angle + Math.PI / 2;
      const movedNow = moveEntity(ally, Math.cos(side) * ally.speed * ally.strafe * 0.3 * dt, Math.sin(side) * ally.speed * ally.strafe * 0.3 * dt, map.walls);
      if (movedNow < 0.5) ally.strafe *= -1;
      botShootAt(ally, enemy, dt, "ally");
    } else {
      const target = allyObjectivePoint(ally, index);
      if (Math.hypot(ally.x - target.x, ally.y - target.y) > 36) {
        moveBotToward(ally, target, dt, 1.04);
      } else {
        ally.angle = Math.atan2(game.player.y - ally.y, game.player.x - ally.x);
      }
    }
    keepSquadSpacing(ally, squad, dt);
  });
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
      bot.aiState = "defuse";
      if (botDefuseSpike(bot, dt)) {
        continue;
      }
    }

    if (game.playerSide === "defenders" && bot === droppedSpikePicker) {
      bot.aiState = "recover";
      botFightPlayer(bot, dt, { strafe: false, state: "recover" });
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
      bot.aiState = "plant";
      botFightPlayer(bot, dt, { strafe: false, state: "plant", firePenalty: 1.25 });
      if (rectContainsPadded(botPlantSite, bot.x, bot.y, bot.r * 0.65) && botPlantSpike(bot, dt)) {
        continue;
      }
      const carrierTarget = plantTargetForSite(botPlantSite, bot);
      moveBotToward(bot, carrierTarget, dt, 1.12);
      continue;
    }

    if (game.playerSide === "defenders" && bot === carrier && game.spike.state === "bot_planting") {
      bot.aiState = "plant";
      if (botPlantSpike(bot, dt)) {
        continue;
      }
    }

    if (game.playerSide === "defenders" && game.spike.state !== "planted") {
      // bots atacantes: atirar sempre que possivel, mover para o site
      const fightResult = botFightPlayer(bot, dt, { strafe: true, state: "push", preferCover: bot.hp < 45 });
      const supportTarget = attackSupportPoint(bot, carrier, botPlantSite, botPlantTarget);
      const closeEnough = Math.hypot(bot.x - supportTarget.x, bot.y - supportTarget.y) < 34;
      if (!closeEnough) {
        moveBotToward(bot, supportTarget, dt, fightResult ? 0.55 : 1.08);
      } else if (!botCanSeePlayer(bot)) {
        bot.angle = Math.atan2(botPlantTarget.y - bot.y, botPlantTarget.x - bot.x);
      }
      bot.aiState = fightResult ? "fight" : "push";
      continue;
    }

    const route = map.botRoutes[bot.patrol % map.botRoutes.length];
    let waypoint = route[bot.routeIndex % route.length];
    if (game.spike.state === "planted") {
      bot.aiState = game.playerSide === "attackers" ? "retake" : "guard";
      const guardAngle = (bot.patrol / Math.max(1, game.bots.length)) * Math.PI * 2;
      waypoint = {
        x: game.spike.x + Math.cos(guardAngle) * 92,
        y: game.spike.y + Math.sin(guardAngle) * 72,
      };
    } else if (game.playerSide === "attackers") {
      bot.aiState = "hold";
      waypoint = defenderHoldPoint(bot);
    } else if (game.playerSide === "defenders") {
      bot.aiState = "guard";
      const guardAngle = (bot.patrol / Math.max(1, game.bots.length)) * Math.PI * 2;
      waypoint = {
        x: botPlantTarget.x + Math.cos(guardAngle) * 105,
        y: botPlantTarget.y + Math.sin(guardAngle) * 82,
      };
    }
    const investigating = !seesPlayer && bot.memoryTimer > 0 && bot.lastKnownPlayer;
    const memoryTargetClear = investigating && !lineIntersectsAnyWall(bot.x, bot.y, bot.lastKnownPlayer.x, bot.lastKnownPlayer.y);
    const target = seesPlayer ? p : memoryTargetClear ? bot.lastKnownPlayer : waypoint;
    const angle = Math.atan2(target.y - bot.y, target.x - bot.x);
    bot.angle = angle;

    if (!seesPlayer) {
      if (bot.wait > 0) {
        bot.aiState = bot.aiState === "hold" ? "hold" : "patrol";
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
      bot.idleTimer = moved < 2 && Math.hypot(target.x - bot.x, target.y - bot.y) > 40
        ? (bot.idleTimer || 0) + dt
        : 0;
      bot.lastX = bot.x;
      bot.lastY = bot.y;
      if (bot.idleTimer > 0.65) {
        rescueBotFromStuck(bot, target, dt);
      }
      if (bot.idleTimer > 1.4) {
        forceBotProgress(bot, target);
      } else if (bot.stuck > 1.1) {
        bot.routeIndex = (bot.routeIndex + 1) % route.length;
        bot.stuck = 0.35;
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

    if (bullet.team === "player" || bullet.team === "ally") {
      for (const bot of game.bots) {
        const region = bot.alive ? hitRegion(oldX, oldY, bullet.x, bullet.y, bot, 6) : null;
        if (region) {
          const damage = damageForHit(bullet, bot, region);
          applyDamage(bot, damage);
          if (bullet.team === "player") {
            game.stats.damage += Math.round(damage);
            if (region === "head") game.stats.headshots += 1;
          }
          game.hitMarkers.push({ x: bot.x, y: bot.y - 28, life: 0.35, maxLife: 0.35, color: region === "head" ? "#ff4d5d" : "#ffd166" });
          spawnParticles(bullet.x, bullet.y, "#4fb3ff", 10, 130);
          playSound(region === "head" ? "headshot" : "hit");
          bullet.life = 0;
          if (bot.hp <= 0) {
            bot.alive = false;
            if (bullet.team === "player") game.stats.kills += 1;
            if (!game.sandbox) {
              game.money += bullet.team === "player" ? (region === "head" ? 250 : 180) : 90;
              if (!game.training) game.money = Math.min(game.money, 12000);
            }
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
    } else {
      const targets = [game.player, ...game.allies];
      for (const target of targets) {
        const region = target.alive ? hitRegion(oldX, oldY, bullet.x, bullet.y, target, target.id === "player" ? 3 : 6) : null;
        if (!region) continue;
        applyDamage(target, damageForHit(bullet, target, region));
        game.hitMarkers.push({ x: target.x, y: target.y - 30, life: 0.3, maxLife: 0.3, color: "#ff5b5b" });
        spawnParticles(bullet.x, bullet.y, "#ff4d5d", 8, 120);
        if (target.id === "player") {
          game.shake = Math.max(game.shake, 0.1);
          game.damageIndicator = {
            angle: Math.atan2(oldY - target.y, oldX - target.x),
            life: 0.72,
            maxLife: 0.72,
          };
        }
        bullet.life = 0;
        if (target.hp <= 0) {
          target.alive = false;
          if (target.id === "player") {
            game.stats.deaths += 1;
            if (game.tutorial) {
              showRoundBanner("Tente de novo", "No tutorial voce renasce para praticar sem perder a partida.", "Tutorial", 2.4);
              resetRound();
              game.tutorialStep = Math.min(game.tutorialStep, 2);
              setMessage(`Tutorial: ${tutorialText()}`);
              break;
            }
            const winner = game.playerSide === "attackers" ? "defenders" : "attackers";
            endRound(winner, game.playerSide === "attackers"
              ? "Voce foi eliminado. Defensores venceram."
              : "Voce foi eliminado. Atacantes venceram.");
          }
        }
        break;
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
      playSound("spike");
      spawnSpikeExplosion(game.spike.x, game.spike.y);
      endRound("attackers", "Spike detonou. Atacantes venceram.");
    }
  }
}

function updateTimers(dt) {
  if (!game.sandbox && !game.training) game.phaseTime -= dt;
  if (game.sandbox || game.training) game.money = 99999;
  game.recoilHeat = Math.max(0, game.recoilHeat - dt * (game.player?.moving ? 0.9 : 1.8));
  if (game.recoilHeat === 0) game.shotChain = 0;
  if (game.roundBannerTimer > 0) {
    game.roundBannerTimer = Math.max(0, game.roundBannerTimer - dt);
    if (game.roundBannerTimer === 0) ui.roundBanner.classList.add("hidden");
  }
  if (game.introTimer > 0) {
    game.introTimer = Math.max(0, game.introTimer - dt);
    if (game.introTimer === 0) ui.introOverlay.classList.add("hidden");
  }
  game.abilityCooldown = Math.max(0, game.abilityCooldown - dt);
  game.shake = Math.max(0, game.shake - dt);
  const wasReloading = game.reloadTimer > 0;
  game.reloadTimer = Math.max(0, game.reloadTimer - dt);
  if (wasReloading && game.reloadTimer === 0) {
    game.player.ammo = currentMagSize();
  }
  game.revealTimer = Math.max(0, game.revealTimer - dt);
  if (game.damageIndicator) {
    game.damageIndicator.life -= dt;
    if (game.damageIndicator.life <= 0) game.damageIndicator = null;
  }
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
    if (game.training) {
      game.bots = map.defendersSpawn.map(makeBot);
      game.bots.forEach(sanitizeEntityPosition);
      setMessage("Treino: novos bots apareceram.");
      return;
    }
    if (game.playerSide === "defenders" && game.spike.state === "planted") {
      setMessage("Atacantes eliminados. Agora desarme a spike.");
      return;
    }
    endRound(game.playerSide, game.playerSide === "attackers"
      ? "Defensores eliminados. Atacantes venceram."
      : "Atacantes eliminados. Defensores venceram.");
  }
}

function updateMenuSlideshow(dt) {
  game.menuMapTimer -= dt;
  if (game.menuMapTimer <= 0) {
    game.menuMapTimer = 7 + Math.random() * 3;
    game.menuMapIndex = (game.menuMapIndex + 1) % MAPS.length;
    game.menuMapPan = 0;
    game.menuMapPanDir = Math.random() < 0.5 ? 1 : -1;
  }
  game.menuMapPan += dt * 14 * game.menuMapPanDir;
}

function drawMenuSlideshow() {
  const slideMap = MAPS[game.menuMapIndex];
  const theme = slideMap.theme;
  const panX = game.menuMapPan;
  ctx.save();
  ctx.translate(panX, 0);
  ctx.fillStyle = theme.floor;
  ctx.fillRect(-60, 0, canvas.width + 120, canvas.height);
  ctx.fillStyle = theme.grid;
  for (let x = -60; x < canvas.width + 120; x += 40) ctx.fillRect(x, 0, 1, canvas.height);
  for (let y = 0; y < canvas.height; y += 40) ctx.fillRect(-60, y, canvas.width + 120, 1);
  for (const site of slideMap.sites) {
    ctx.fillStyle = theme.siteFill;
    ctx.strokeStyle = theme.siteStroke;
    ctx.lineWidth = 2;
    ctx.fillRect(site.x, site.y, site.w, site.h);
    ctx.strokeRect(site.x, site.y, site.w, site.h);
    ctx.fillStyle = theme.siteStroke;
    ctx.font = "bold 24px Segoe UI";
    ctx.fillText(site.id, site.x + 14, site.y + 32);
  }
  ctx.fillStyle = theme.wall;
  ctx.strokeStyle = theme.wallStroke;
  for (const wall of slideMap.walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
  }
  ctx.restore();
  ctx.fillStyle = "rgba(5, 8, 13, 0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function update(dt) {
  if (game.menuState !== "none" && game.phase !== "action") {
    updateMenuSlideshow(dt);
    if (game.roundBannerTimer > 0) {
      game.roundBannerTimer = Math.max(0, game.roundBannerTimer - dt);
      if (game.roundBannerTimer === 0) ui.roundBanner.classList.add("hidden");
    }
    return;
  }
  if (game.paused) return;
  updateTimers(dt);
  updateTutorial();
  if (game.phase === "action") {
    updatePlayer(dt);
    updateAllies(dt);
    updateBots(dt);
    updateBullets(dt);
    updateSpike(dt);
    checkWinConditions();
  }
}

function drawMap() {
  const theme = map.theme || DEFAULT_MAP.theme;
  ctx.fillStyle = theme.floor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = theme.grid;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.fillRect(x, 0, 1, canvas.height);
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  for (const site of map.sites) {
    ctx.fillStyle = theme.siteFill;
    ctx.strokeStyle = theme.siteStroke;
    ctx.lineWidth = 2;
    ctx.fillRect(site.x, site.y, site.w, site.h);
    ctx.strokeRect(site.x, site.y, site.w, site.h);
    ctx.fillStyle = theme.siteStroke;
    ctx.font = "bold 24px Segoe UI";
    ctx.fillText(site.id, site.x + 14, site.y + 32);
  }

  ctx.fillStyle = theme.wall;
  ctx.strokeStyle = theme.wallStroke;
  for (const wall of map.walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
  }

  const callouts = [
    { text: "Spawn ATK", x: map.attackersSpawn.x, y: map.attackersSpawn.y - 28 },
    { text: "Spawn DEF", x: map.playerDefenderSpawn.x, y: map.playerDefenderSpawn.y + 42 },
    { text: "Meio", x: map.width / 2, y: map.height / 2 },
  ];
  ctx.font = "bold 12px Segoe UI";
  ctx.textAlign = "center";
  for (const callout of callouts) {
    ctx.fillStyle = "rgba(5,10,15,0.45)";
    ctx.fillRect(callout.x - 42, callout.y - 10, 84, 18);
    ctx.fillStyle = "rgba(238,247,251,0.62)";
    ctx.fillText(callout.text, callout.x, callout.y + 4);
  }
  ctx.textAlign = "left";
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
  for (const ally of game.allies) {
    if (ally.alive) dot(ally.x, ally.y, "#62e6a0", 2.8);
  }
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    const visible = game.revealTimer > 0 || hasLineOfSight(game.player, bot) || bot.memoryTimer > 0 || bot.revealedTimer > 0;
    if (visible) {
      dot(bot.x, bot.y, bot.side === "attackers" ? "#ff8a5b" : "#4fb3ff", bot.revealedTimer > 0 ? 3.2 : 2.8);
    }
  }
  if (game.spike.state !== "carried") dot(game.spike.x, game.spike.y, "#ffd166", 3);
  ctx.restore();
}

function drawCrosshair() {
  const spreadScale = game.crosshairScale * (1 + game.recoilHeat * 0.22);
  if (game.selectedWeapon.id === "sniper") {
    const p = game.player;
    ctx.save();
    // linha do cano até a mira
    ctx.strokeStyle = "rgba(255, 209, 102, 0.55)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(p.x + Math.cos(p.angle) * (p.r + 18), p.y + Math.sin(p.angle) * (p.r + 18));
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    ctx.setLineDash([]);
    // mira normal (círculo + cruz)
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 10 * game.crosshairScale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1;
    const g = 3 * game.crosshairScale;
    const l = 14 * game.crosshairScale;
    ctx.beginPath();
    ctx.moveTo(mouse.x - l, mouse.y); ctx.lineTo(mouse.x - g, mouse.y);
    ctx.moveTo(mouse.x + g, mouse.y); ctx.lineTo(mouse.x + l, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - l); ctx.lineTo(mouse.x, mouse.y - g);
    ctx.moveTo(mouse.x, mouse.y + g); ctx.lineTo(mouse.x, mouse.y + l);
    ctx.stroke();
    ctx.fillStyle = "#ff4d5d";
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (game.crosshairStyle === "minimal") {
    const gap = 3 * spreadScale;
    const length = 7 * spreadScale;
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mouse.x - length, mouse.y);
    ctx.lineTo(mouse.x - gap, mouse.y);
    ctx.moveTo(mouse.x + gap, mouse.y);
    ctx.lineTo(mouse.x + length, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - length);
    ctx.lineTo(mouse.x, mouse.y - gap);
    ctx.moveTo(mouse.x, mouse.y + gap);
    ctx.lineTo(mouse.x, mouse.y + length);
    ctx.stroke();
    return;
  }

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 10 * spreadScale, 0, Math.PI * 2);
  ctx.moveTo(mouse.x - 15 * spreadScale, mouse.y);
  ctx.lineTo(mouse.x + 15 * spreadScale, mouse.y);
  ctx.moveTo(mouse.x, mouse.y - 15 * spreadScale);
  ctx.lineTo(mouse.x, mouse.y + 15 * spreadScale);
  ctx.stroke();
}

function drawBotDebug() {
  if (!game.debugRoutes) return;
  ctx.save();
  ctx.font = "11px Segoe UI";
  ctx.textAlign = "center";
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    const target = bot.lastKnownPlayer || defenderHoldPoint(bot);
    ctx.strokeStyle = bot.stuck > 0.5 ? "rgba(255,77,93,0.85)" : "rgba(255,209,102,0.58)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(bot.x, bot.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(5,10,15,0.78)";
    ctx.fillRect(bot.x - 36, bot.y - 42, 72, 16);
    ctx.fillStyle = "#eef7fb";
    ctx.fillText(`${bot.aiState || "bot"} ${bot.stuck.toFixed(1)}`, bot.x, bot.y - 30);
  }
  ctx.textAlign = "left";
  ctx.restore();
}

function drawDamageIndicator() {
  if (!game.damageIndicator) return;
  const ratio = Math.max(0, game.damageIndicator.life / game.damageIndicator.maxLife);
  const angle = game.damageIndicator.angle;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const x = cx + Math.cos(angle) * 118;
  const y = cy + Math.sin(angle) * 78;
  ctx.save();
  ctx.globalAlpha = ratio;
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.fillStyle = "#ff4d5d";
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(13, 12);
  ctx.lineTo(-13, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawObjectiveHints() {
  if (game.phase !== "action") return;
  ctx.save();
  ctx.lineWidth = 3;
  if (game.playerSide === "attackers" && game.spike.state === "carried" && game.spike.owner === "player") {
    for (const site of map.sites) {
      const c = siteCenter(site);
      const pulse = 1 + Math.sin(performance.now() / 180) * 0.08;
      ctx.strokeStyle = "rgba(255, 209, 102, 0.86)";
      ctx.beginPath();
      ctx.arc(c.x, c.y, 34 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffd166";
      ctx.font = "bold 13px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText(`PLANT ${site.id}`, c.x, c.y - 42);
    }
  }
  if (game.spike.state === "planted" || game.spike.state === "dropped") {
    ctx.strokeStyle = game.spike.state === "planted" ? "rgba(255, 77, 93, 0.9)" : "rgba(255, 209, 102, 0.9)";
    ctx.beginPath();
    ctx.arc(game.spike.x, game.spike.y, 46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#eef7fb";
    ctx.font = "bold 12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(game.spike.state === "planted" ? "SPIKE" : "PEGUE A SPIKE", game.spike.x, game.spike.y - 52);
  }
  ctx.textAlign = "left";
  ctx.restore();
}

function drawAbilityBar() {
  if (game.phase !== "action") return;
  const bx = canvas.width / 2 - 60;
  const by = canvas.height - 38;
  const bw = 120;
  const bh = 8;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
  const cooldownRatio = game.abilityCooldown > 0
    ? 1 - game.abilityCooldown / game.selectedAgent.cooldown
    : 1;
  const color = game.abilityCharges > 0 && game.abilityCooldown <= 0 ? "#62e6a0" : "#46a8ff";
  ctx.fillStyle = color;
  ctx.fillRect(bx, by, bw * Math.min(1, cooldownRatio), bh);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "11px Segoe UI";
  ctx.textAlign = "center";
  const label = game.abilityCharges <= 0 ? "sem carga" : game.abilityCooldown > 0 ? `${Math.ceil(game.abilityCooldown)}s` : "E pronto";
  ctx.fillText(`${game.selectedAgent.ability} (${game.abilityCharges}x) — ${label}`, canvas.width / 2, by - 4);
  ctx.textAlign = "left";
}

function drawSpikeHint() {
  if (game.spike.state !== "planted" || game.phase !== "action") return;
  const cx = canvas.width / 2;
  const cy = 68;
  const timeRatio = Math.max(0, game.spike.timer / SPIKE_DETONATE_TIME);
  const urgent = game.spike.timer < 10;
  const pulse = urgent ? 1 + Math.sin(performance.now() / 120) * 0.08 : 1;
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = urgent ? "rgba(255,77,93,0.18)" : "rgba(5,10,15,0.55)";
  ctx.strokeStyle = urgent ? "#ff4d5d" : "#ffd166";
  ctx.lineWidth = 1.5;
  const w = 140 * pulse;
  const h = 32 * pulse;
  ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
  ctx.fillStyle = urgent ? "#ff4d5d" : "#ffd166";
  ctx.font = `bold ${urgent ? 15 : 13}px Segoe UI`;
  ctx.textAlign = "center";
  ctx.fillText(`SPIKE — ${Math.ceil(game.spike.timer)}s`, cx, cy + 5);
  ctx.textAlign = "left";
  ctx.globalAlpha = 1;
  ctx.restore();
}

function draw() {
  if (game.menuState !== "none" && game.phase !== "action") {
    drawMenuSlideshow();
    return;
  }
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
  drawObjectiveHints();

  for (const bot of game.bots) {
    const visible = game.revealTimer > 0 || hasLineOfSight(game.player, bot);
    const label = `${bot.side === "attackers" ? "ATK" : "DEF"} ${bot.weapon?.name || "Pistol"}`;
    const color = bot.side === "attackers" ? "#ff8a5b" : "#4fb3ff";
    drawEntity(bot, visible ? color : "#274351", visible ? label : "", "bot");
  }
  for (const ally of game.allies) {
    drawEntity(ally, "#62e6a0", `ALLY ${ally.weapon?.name || "Pistol"}`, "ally");
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
    ctx.strokeStyle = marker.color || "rgba(255,255,255,0.95)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(marker.x - 21, marker.y - 21);
    ctx.lineTo(marker.x - 10, marker.y - 10);
    ctx.moveTo(marker.x + 21, marker.y - 21);
    ctx.lineTo(marker.x + 10, marker.y - 10);
    ctx.moveTo(marker.x - 21, marker.y + 21);
    ctx.lineTo(marker.x - 10, marker.y + 10);
    ctx.moveTo(marker.x + 21, marker.y + 21);
    ctx.lineTo(marker.x + 10, marker.y + 10);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineCap = "butt";
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

  drawBotDebug();
  drawDamageIndicator();
  drawAbilityBar();
  drawSpikeHint();
  drawCrosshair();
  drawRadar();
  ctx.restore();
}

function updateUi() {
  // Side pill
  const atk = game.playerSide === "attackers";
  ui.sidePill.textContent = atk ? "ATK" : "DEF";
  ui.sidePill.className = "hud-pill side-pill " + (atk ? "atk" : "def");

  // Round label
  ui.roundLabel.textContent = `Round ${game.roundNumber}`;

  // Timer com urgência
  const t = Math.max(0, Math.ceil(game.phaseTime));
  ui.timer.className = t <= 5 && game.phase !== "action" ? "urgent" : t <= 10 && game.phase !== "action" ? "warn" : "";

  // Buy bar
  updateBuyBar();

  // Agent dot cor
  ui.agentDot.style.background = game.selectedAgent.color;

  // Armor bar separada
  const hasArmor = (game.player?.maxArmor || 0) > 0;
  ui.armorBarWrap.classList.toggle("hidden", !hasArmor);
  ui.armorText.classList.toggle("hidden", !hasArmor);
  if (hasArmor) {
    const armorRatio = Math.max(0, game.player.armor) / game.player.maxArmor;
    ui.armorBar.style.transform = `scaleX(${armorRatio})`;
    ui.armorValueText.textContent = Math.ceil(game.player.armor);
  }

  // Ammo dots
  if (game.reloadTimer <= 0) {
    updateAmmoDots(game.player.ammo, currentMagSize());
  } else {
    updateAmmoDots(0, currentMagSize());
  }

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
    : game.sandbox || game.training ? "∞" : t.toString();
  ui.score.textContent = `${game.playerScore} - ${game.enemyScore}`;

  // Money com delta
  const newMoney = game.money;
  if (newMoney !== lastMoney) flashMoneyDelta(newMoney);
  ui.money.textContent = `${newMoney}`;

  ui.agent.textContent = `${game.selectedAgent.name} ${atk ? "ATK" : "DEF"} (${game.abilityCharges}x ${game.abilityCooldown > 0 ? Math.ceil(game.abilityCooldown) : "E"})`;
  ui.weapon.textContent = game.selectedWeapon.name;
  ui.hp.textContent = `${Math.max(0, Math.ceil(game.player.hp))}`;
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
    ? (game.menuState === "pause" ? "Jogo pausado. Aperte P ou clique em Continuar." : "Escolha uma opcao no menu.")
    : game.playerSide === "attackers"
      ? "WASD move, mouse mira, clique atira, E habilidade, F planta, P pause."
      : "WASD move, mouse mira, clique atira, E habilidade, F desarma, P pause.";
  ui.pauseButton.textContent = game.menuState === "pause" ? "Continuar" : "Pause";
  ui.shopButton.textContent = ui.shop.classList.contains("hidden") ? "Loja" : "Fechar";
  updateScoreboard();
}

function togglePause() {
  if (game.phase === "matchOver") return;
  if (game.menuState === "pause") {
    resumeFromPause();
    return;
  }
  if (game.menuState !== "none") return;
  showPauseMenu();
}

function toggleShop() {
  if (game.phase !== "buy" && !game.sandbox) {
    setMessage("A loja so abre na fase de compra.");
    updateUi();
    return;
  }
  if (ui.shop.classList.contains("hidden")) {
    openShop();
  } else {
    closeShop();
  }
  updateUi();
}

function setShopTab(tab) {
  game.shopTab = tab;
  document.querySelectorAll("[data-shop-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.shopPanel !== tab);
  });
  if (ui.shopTabs) {
    ui.shopTabs.querySelectorAll("[data-shop-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.shopTab === tab);
    });
  }
}

function handleEscape() {
  if (game.menuState === "pause") {
    resumeFromPause();
    return;
  }
  if (game.menuState === "difficulty" || game.menuState === "options") {
    showMainMenu();
    return;
  }
  if (game.menuState !== "none") return;
  if (!ui.shop.classList.contains("hidden")) {
    closeShop();
    updateUi();
    return;
  }
  toggleShop();
}

function setMenu(title, text, buttons, kicker = "Valorant2D", state = "menu") {
  ui.menuKicker.textContent = kicker;
  ui.menuTitle.textContent = title;
  ui.menuText.textContent = text;
  ui.menuButtons.innerHTML = "";
  for (const item of buttons) {
    const button = document.createElement("button");
    button.innerHTML = `<b>${item.label}</b><span>${item.desc || ""}</span>`;
    button.addEventListener("click", item.action);
    ui.menuButtons.appendChild(button);
  }
  ui.menuOverlay.classList.remove("hidden");
  game.paused = true;
  game.menuState = state;
}

function hideMenuOverlay() {
  ui.menuOverlay.classList.add("hidden");
  game.menuState = "none";
}

function resumeFromPause() {
  hideMenuOverlay();
  game.paused = false;
  setMessage("Jogo retomado.");
  updateUi();
}

function showPauseMenu() {
  closeShop();
  setMessage("Jogo pausado.");
  setMenu("Pause", "A partida esta congelada. Continue ou volte para o menu.", [
    { label: "Continuar", desc: "Retomar a partida atual.", action: resumeFromPause },
    { label: "Voltar ao menu", desc: "Sair da partida atual e abrir o menu principal.", action: showMainMenu },
  ], "JOGO PAUSADO", "pause");
  updateUi();
}

function showMainMenu() {
  ui.introOverlay.classList.add("hidden");
  ui.matchOverlay.classList.add("hidden");
  closeShop();
  game.phase = "idle";
  game.paused = false;
  game.menuMapTimer = 0;
  fullReset();
  setMenu("Menu", "Escolha como quer jogar.", [
    { label: "JOGAR", desc: "Partida normal com dificuldade.", action: showDifficultyMenu },
    { label: "OPÇÕES", desc: "Preferências de mira e controles.", action: showOptionsMenu },
    { label: "SANDBOX", desc: "Dinheiro infinito, sem tempo e posicionamento livre.", action: startSandboxMode },
    { label: "TREINO", desc: "Teste armas, mira, recoil e dano sem pressa.", action: startTrainingMode },
    { label: "TUTORIAL", desc: "Aprenda movimento, tiro, plant, defuse e compra.", action: startTutorialMode },
  ], "Valorant2D", "main");
}

function showDifficultyMenu() {
  setMenu("Dificuldade", "Escolha o ritmo da partida.", [
    { label: "Fácil", desc: "2 aliados. Inimigos atiram bem menos.", action: () => startMode("Fácil", "easy") },
    { label: "Normal", desc: "Sem aliados. Inimigos atiram com menos frequência.", action: () => startMode("Normal", "normal") },
    { label: "Difícil", desc: "Sem aliados. Inimigos atiram na frequência normal.", action: () => startMode("Difícil", "hard") },
    { label: "Voltar", desc: "Retornar ao menu principal.", action: showMainMenu },
  ], "JOGAR", "difficulty");
}

function showOptionsMenu() {
  setMenu("Opções", "Ajustes rápidos de controle e mira.", [
    { label: `Mira: ${game.crosshairStyle === "default" ? "Padrão" : "Minimalista"}`, desc: "Alterna o visual da mira comum.", action: () => { game.crosshairStyle = game.crosshairStyle === "default" ? "minimal" : "default"; showOptionsMenu(); } },
    { label: `Tamanho mira: ${Math.round(game.crosshairScale * 100)}%`, desc: "Alterna entre mira pequena, media e grande.", action: () => { game.crosshairScale = game.crosshairScale >= 1.25 ? 0.85 : game.crosshairScale + 0.2; showOptionsMenu(); } },
    { label: `Movimento: ${game.arrowKeys ? "WASD + setinhas" : "WASD"}`, desc: "Permite usar setinhas junto do WASD.", action: () => { game.arrowKeys = !game.arrowKeys; showOptionsMenu(); } },
    { label: `Rotas: ${game.debugRoutes ? "visiveis" : "ocultas"}`, desc: "Mostra alvos e caminhos dos bots para depurar travamentos.", action: () => { game.debugRoutes = !game.debugRoutes; showOptionsMenu(); } },
    { label: `Som: ${audio.enabled ? "ligado" : "desligado"}`, desc: "Ativa feedback simples de tiros, hits e spike.", action: () => { audio.enabled = !audio.enabled; showOptionsMenu(); } },
    { label: `Volume: ${Math.round(audio.volume * 100)}%`, desc: "Alterna volume baixo, medio e alto.", action: () => { audio.volume = audio.volume >= 1 ? 0.35 : audio.volume + 0.325; showOptionsMenu(); } },
    { label: "Tela cheia", desc: "Alterna o jogo em tela cheia quando o navegador permitir.", action: () => { if (document.fullscreenElement) document.exitFullscreen?.(); else document.querySelector(".game-wrap")?.requestFullscreen?.(); showOptionsMenu(); } },
    { label: "Voltar", desc: "Retornar ao menu principal.", action: showMainMenu },
  ], "OPÇÕES", "options");
}

function applyDifficulty(difficulty) {
  game.difficulty = difficulty;
  game.sandbox = false;
  if (difficulty === "easy") {
    game.allyCount = 2;
    game.enemyFireMultiplier = 1.85;
  } else if (difficulty === "normal") {
    game.allyCount = 0;
    game.enemyFireMultiplier = 1.35;
  } else {
    game.allyCount = 0;
    game.enemyFireMultiplier = 1;
  }
}

function startMode(label, difficulty) {
  game.mode = label;
  game.training = false;
  game.tutorial = false;
  applyDifficulty(difficulty);
  hideMenuOverlay();
  startNewMatch();
}

function startSandboxMode() {
  game.mode = "Sandbox";
  game.difficulty = "sandbox";
  game.sandbox = true;
  game.training = false;
  game.tutorial = false;
  game.allyCount = 2;
  game.enemyFireMultiplier = 1.2;
  hideMenuOverlay();
  startNewMatch();
  startActionRound();
  game.phaseTime = 9999;
  setMessage("Sandbox: direito cria inimigo, meio cria aliado, X limpa bots, C limpa aliados.");
}

function startTrainingMode() {
  game.mode = "Treino";
  game.difficulty = "training";
  game.sandbox = false;
  game.training = true;
  game.tutorial = false;
  game.allyCount = 0;
  game.enemyFireMultiplier = 2.4;
  hideMenuOverlay();
  startNewMatch();
  game.money = 99999;
  startActionRound();
  game.phaseTime = 9999;
  setMessage("Treino: dinheiro infinito, tempo livre e bots lentos para testar armas.");
}

function startTutorialMode() {
  game.mode = "Tutorial";
  game.difficulty = "tutorial";
  game.sandbox = false;
  game.training = false;
  game.tutorial = true;
  game.tutorialStep = 0;
  game.allyCount = 1;
  game.enemyFireMultiplier = 2.2;
  hideMenuOverlay();
  startNewMatch();
  game.startingSide = "attackers";
  game.playerSide = "attackers";
  game.roundNumber = 1;
  resetRound();
  showIntro();
  setMessage(`Tutorial: ${tutorialText()}`);
}

function showIntro() {
  ui.introMode.textContent = game.mode;
  ui.introMap.textContent = game.mapName;
  ui.introTeam.textContent = `${game.playerSide === "attackers" ? "Ataque" : "Defesa"} - ${map.vibe}`;
  ui.introOverlay.classList.remove("hidden");
  game.introTimer = 5;
}

const killFeedEntries = [];

function addKillFeedEntry(killerIsPlayer, weaponName, headshot) {
  const entry = document.createElement("div");
  entry.className = "kill-entry";
  const killer = killerIsPlayer
    ? `<span class="kf-player">Você</span>`
    : `<span class="kf-enemy">Bot</span>`;
  const victim = killerIsPlayer
    ? `<span class="kf-enemy">Bot</span>`
    : `<span class="kf-player">Você</span>`;
  const hs = headshot ? `<span class="kf-hs">HS</span>` : "";
  entry.innerHTML = `${killer}<span class="kf-weapon">${weaponName}</span>${victim}${hs}`;
  ui.killFeed.prepend(entry);
  killFeedEntries.push(entry);
  if (killFeedEntries.length > 4) {
    const old = killFeedEntries.shift();
    old.remove();
  }
  setTimeout(() => {
    entry.style.transition = "opacity 0.5s";
    entry.style.opacity = "0";
    setTimeout(() => entry.remove(), 500);
  }, 4000);
}

let lastMoney = 800;
function flashMoneyDelta(newVal) {
  const diff = newVal - lastMoney;
  lastMoney = newVal;
  if (diff === 0) return;
  const el = ui.moneyDelta;
  el.className = "money-delta " + (diff > 0 ? "pos" : "neg");
  el.textContent = (diff > 0 ? "+" : "") + "$" + diff;
  void el.offsetWidth;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "";
}

function updateAmmoDots(ammo, maxAmmo) {
  const el = ui.ammoDots;
  if (maxAmmo > 30) { el.innerHTML = ""; return; }
  if (el.childElementCount !== maxAmmo) {
    el.innerHTML = "";
    for (let i = 0; i < maxAmmo; i++) {
      const dot = document.createElement("span");
      dot.className = "ammo-dot" + (i > 0 && i % 5 === 0 ? " group-sep" : "");
      el.appendChild(dot);
    }
  }
  [...el.children].forEach((dot, i) => {
    dot.classList.toggle("spent", i >= ammo);
  });
}

function updateBuyBar() {
  if (game.phase === "buy" && !game.sandbox && !game.training) {
    ui.buyBar.classList.remove("hidden");
    const ratio = Math.max(0, game.phaseTime / BUY_TIME);
    ui.buyBarFill.style.transform = `scaleX(${ratio})`;
  } else {
    ui.buyBar.classList.add("hidden");
  }
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
    button.innerHTML = `<b>${weapon.name} <em>${owned ? "Comprada" : `$${weapon.price}`}</em></b><span>Permanente na partida. ${weapon.damage} dano, pente ${weapon.mag}</span>`;
    button.addEventListener("click", () => {
      if (game.phase !== "buy" && !game.sandbox) return;
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
    const kind = item.id.includes("Armor") ? "Consumivel por round" : "Upgrade permanente";
    button.innerHTML = `<b>${item.name} - $${item.price}</b><span>${kind}. ${item.desc}</span>`;
    button.addEventListener("click", () => {
      if (game.phase !== "buy" && !game.sandbox) return;
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

  ui.allyButtons.innerHTML = "";
  for (const item of allyItems) {
    const button = document.createElement("button");
    button.className = "choice";
    button.innerHTML = `<b>${item.name} <em>$${item.price}</em></b><span>Upgrade de equipe. ${item.desc}</span>`;
    button.addEventListener("click", () => {
      if (game.phase !== "buy" && !game.sandbox) return;
      if (allyItemOwned(item)) {
        setMessage("Esse upgrade aliado ja esta ativo.");
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
      const allyWeapon = weapons.find((weapon) => weapon.id === game.allyLoadout.weaponId) || weapons[0];
      for (const ally of game.allies) {
        ally.weapon = allyWeapon;
        ally.maxArmor = game.allyLoadout.armor;
        ally.armor = game.allyLoadout.armor;
      }
      setMessage(`${item.name} comprado para aliados.`);
      updateShopState();
      updateUi();
    });
    ui.allyButtons.appendChild(button);
  }
  updateShopState();
}

function allyItemOwned(item) {
  if (!item) return false;
  if (item.id === "allyArmor") return game.allyLoadout.armor >= 35;
  if (item.weaponId) return game.allyLoadout.weaponId === item.weaponId;
  return false;
}

function equipmentOwned(item) {
  if (!item) return false;
  if (item.id === "lightArmor") return (game.player?.armor || 0) >= 25;
  if (item.id === "heavyArmor") return (game.player?.armor || 0) >= 50;
  if (item.id === "boots") return game.upgrades.speed;
  if (item.id === "magazine") return game.upgrades.magazine;
  if (item.id === "reloadKit") return game.upgrades.reload;
  return false;
}

function updateShopState() {
  setShopTab(game.shopTab);
  [...ui.agentButtons.children].forEach((button, i) => button.classList.toggle("active", agents[i] === game.selectedAgent));
  [...ui.weaponButtons.children].forEach((button, i) => {
    const weapon = weapons[i];
    if (!weapon) return;
    const owned = game.ownedWeapons.has(weapon.id);
    button.classList.toggle("active", weapon === game.selectedWeapon);
    button.classList.toggle("owned", owned);
    const status = button.querySelector("em");
    if (status) status.textContent = weapon === game.selectedWeapon ? "Equipada" : owned ? "Comprada" : `$${weapon.price}`;
  });
  [...ui.equipmentButtons.children].forEach((button, i) => button.classList.toggle("active", equipmentOwned(equipment[i])));
  [...ui.allyButtons.children].forEach((button, i) => {
    const item = allyItems[i];
    if (!item) return;
    const owned = allyItemOwned(item);
    button.classList.toggle("active", owned);
    button.classList.toggle("owned", owned);
    const status = button.querySelector("em");
    if (status) status.textContent = owned ? "Ativo" : `$${item.price}`;
  });
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
  initAudio();
  if (event.key === "Tab") {
    event.preventDefault();
    game.scoreboardVisible = true;
    updateUi();
    return;
  }
  if (!event.repeat) pressed.add(event.key.toLowerCase());
  keys.add(event.key.toLowerCase());
  if (!event.repeat && event.key.toLowerCase() === "p") {
    togglePause();
  }
  if (game.sandbox && !event.repeat && event.key.toLowerCase() === "x") {
    game.bots = [];
    setMessage("Sandbox: inimigos removidos.");
  }
  if (game.sandbox && !event.repeat && event.key.toLowerCase() === "c") {
    game.allies = [];
    setMessage("Sandbox: aliados removidos.");
  }
  if (event.key === "Escape") {
    handleEscape();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    game.scoreboardVisible = false;
    updateUi();
    return;
  }
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener("contextmenu", (event) => event.preventDefault());

canvas.addEventListener("mousedown", (event) => {
  initAudio();
  if (game.sandbox && game.phase === "action" && event.button === 2) {
    event.preventDefault();
    const bot = makeBot({ x: mouse.x, y: mouse.y }, game.bots.length);
    bot.hasSpike = false;
    sanitizeEntityPosition(bot);
    game.bots.push(bot);
    return;
  }
  if (game.sandbox && game.phase === "action" && event.button === 1) {
    event.preventDefault();
    const ally = makeAlly({ x: mouse.x, y: mouse.y }, game.allies.length);
    sanitizeEntityPosition(ally);
    game.allies.push(ally);
    return;
  }
  mouse.down = true;
});

window.addEventListener("mouseup", () => {
  mouse.down = false;
});

ui.pauseButton.addEventListener("click", togglePause);
ui.shopButton.addEventListener("click", toggleShop);
ui.shopBackdrop.addEventListener("click", () => { closeShop(); updateUi(); });
if (ui.shopTabs) {
  ui.shopTabs.querySelectorAll("[data-shop-tab]").forEach((button) => {
    button.addEventListener("click", () => setShopTab(button.dataset.shopTab));
  });
}
ui.newGameButton.addEventListener("click", () => {
  ui.matchOverlay.classList.add("hidden");
  showMainMenu();
});

buildShop();
setShopTab(game.shopTab);
game.menuMapTimer = 0;
startNewMatch();
showMainMenu();
requestAnimationFrame(loop);
