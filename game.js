const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  topHud: document.getElementById("topHud"),
  timerPill: document.getElementById("timerPill"),
  timer: document.getElementById("timerText"),
  score: document.getElementById("scoreText"),
  money: document.getElementById("moneyText"),
  agent: document.getElementById("agentText"),
  weapon: document.getElementById("weaponText"),
  hp: document.getElementById("hpText"),
  ultCounter: document.getElementById("ultCounter"),
  ultPoints: document.getElementById("ultPointsText"),
  ammo: document.getElementById("ammoText"),
  spike: document.getElementById("spikeText"),
  shop: document.getElementById("shop"),
  shopTabs: document.getElementById("shopTabs"),
  message: document.getElementById("message"),
  weaponButtons: document.getElementById("weaponButtons"),
  equipmentButtons: document.getElementById("equipmentButtons"),
  allyButtons: document.getElementById("allyButtons"),
  hpBar: document.getElementById("hpBar"),
  ammoBar: document.getElementById("ammoBar"),
  shopBackdrop: document.getElementById("shopBackdrop"),
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
  pauseOverlay: document.getElementById("pauseMenuOverlay"),
  pauseResumeButton: document.getElementById("pauseResumeButton"),
  pauseOptionsButton: document.getElementById("pauseOptionsButton"),
  pauseRestartButton: document.getElementById("pauseRestartButton"),
  pauseQuitButton: document.getElementById("pauseQuitButton"),
  agentOverlay: document.getElementById("agentOverlay"),
  agentSelectGrid: document.getElementById("agentSelectGrid"),
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
  sandboxTools: document.getElementById("sandboxTools"),
  spawnBotButton: document.getElementById("spawnBotButton"),
  spawnAllyButton: document.getElementById("spawnAllyButton"),
  resetSpikeButton: document.getElementById("resetSpikeButton"),
  godModeButton: document.getElementById("godModeButton"),
  clearSandboxButton: document.getElementById("clearSandboxButton"),
  kills: document.getElementById("killsText"),
  deaths: document.getElementById("deathsText"),
  headshots: document.getElementById("headshotsText"),
  plants: document.getElementById("plantsText"),
  defuses: document.getElementById("defusesText"),
  scoreMoney: document.getElementById("scoreMoneyText"),
  sidePill: document.getElementById("sidePill"),
  moneyDelta: document.getElementById("moneyDelta"),
  buyBar: document.getElementById("buyBar"),
  buyBarFill: document.getElementById("buyBarFill"),
  agentDot: document.getElementById("agentDot"),
  armorBarWrap: document.getElementById("armorBarWrap"),
  armorBar: document.getElementById("armorBar"),
  armorText: document.getElementById("armorText"),
  armorValueText: document.getElementById("armorValueText"),
  killFeed: document.getElementById("killFeed"),
  tutorialOverlay: document.getElementById("tutorialOverlay"),
  tutorialPrompt: document.getElementById("tutorialPrompt"),
  tutorialKicker: document.getElementById("tutorialKicker"),
  tutorialInstruction: document.getElementById("tutorialInstruction"),
  tutorialProgress: document.getElementById("tutorialProgress"),
  tutorialAgentPanel: document.getElementById("tutorialAgentPanel"),
  tutorialAgentGrid: document.getElementById("tutorialAgentGrid"),
};

const keys = new Set();
const pressed = new Set();
const mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };
const SPIKE_DETONATE_TIME = 38;
const BOT_REACTION_TIME = 0.22;
const BOT_SHOOT_GRACE_TIME = 0.42;
const PLAYER_DEFUSE_TIME = 3.2;
const BOT_DEFUSE_TIME = 5.2;
const PLANT_TIME = 2.0;
const BUY_TIME = 8;
const MATCH_ROUNDS = 9;
const POISON_TICK_INTERVAL = 0.35;
const ULT_MAX_POINTS = 7;
const MEDKIT_HEAL = 50;
const ORB_CHANNEL_TIME = 3;
const VIPER_CAST_RANGE = 330;
const VIPER_CLOUD_RADIUS = 92;
const ECONOMY = {
  start: 800,
  kill: 150,
  headshot: 200,
  defuseWin: 3800,
  eliminationWin: 3300,
  standardWin: 3000,
  lossConsolation: 900,
  spikeDeathCash: 100,
  objective: 300,
  cap: 12000,
};
const audio = {
  ctx: null,
  enabled: true,
  volume: 0.8,
  last: 0,
  cache: new Map(),
  cachePrimed: false,
  buffers: new Map(),
  buffersPrimed: false,
};
const agents = [
  {
    id: "neon",
    name: "Neon",
    role: "Entrada",
    color: "#00d9ff",
    ability: "Dash curto",
    cooldown: 7,
    use(game) {
      const p = game.player;
      const length = Math.hypot(p.moveX || 0, p.moveY || 0);
      if (length < 0.1) {
        setMessage("Mova-se com WASD para definir a direção do Dash.");
        return false;
      }
      const fromX = p.x;
      const fromY = p.y;
      const dx = (p.moveX / length) * 120;
      const dy = (p.moveY / length) * 120;
      moveEntity(p, dx, dy, game.map.walls);
      spawnDashTrail(p, fromX, fromY, p.x, p.y, game.selectedAgent.color);
      return true;
    },
  },
  {
    id: "viper",
    name: "Viper",
    role: "Controle",
    color: "#0f7f3b",
    ability: "Nuvem de veneno",
    cooldown: 9,
    use(game) {
      const p = game.player;
      const castPoint = limitedCastPoint(p, mouse, VIPER_CAST_RANGE);
      game.smokes.push({
        ...nearestWalkablePoint(castPoint, p),
        r: 22,
        targetR: VIPER_CLOUD_RADIUS,
        life: 7,
        poison: true,
        damagePerSecond: 20,
        ownerTeam: "player",
      });
      return true;
    },
  },
  {
    id: "sage",
    name: "Sage",
    role: "Suporte",
    color: "#00cfa6",
    ability: "Cura",
    cooldown: 9,
    use(game) {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + 35);
    },
  },
  {
    id: "omen",
    name: "Omen",
    role: "Controle",
    color: "#5a2b9e",
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

const damageFalloff = {
  pistol: { start: 260, end: 760, min: 0.62 },
  "light-pistol": { start: 210, end: 650, min: 0.55 },
  revolver: { start: 360, end: 900, min: 0.72 },
  smg: { start: 220, end: 700, min: 0.52 },
  shotgun: { start: 120, end: 420, min: 0.25 },
  carbine: { start: 360, end: 980, min: 0.76 },
  rifle: { start: 420, end: 1100, min: 0.8 },
  dmr: { start: 520, end: 1250, min: 0.86 },
  lmg: { start: 300, end: 930, min: 0.68 },
  sniper: { start: 700, end: 1500, min: 0.93 },
};

const weaponAudio = {
  pistol: {
    sonsTiro: [
      "assets/Sounds/Tiro/Pistol%20shot%20sound.mp3",
      "assets/Sounds/Tiro/%232%20pistol%20shot%20sound%20effect.mp3",
    ],
    sonsReload: [
      "assets/Sounds/Reload/%231%20Pistol%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%232%20pistol%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%233%20pistol%20reload%20sound%20effect.mp3",
    ],
  },
  "light-pistol": {
    sonsTiro: ["assets/Sounds/Tiro/Light%20Pistol%20shot%20sound.mp3"],
    sonsReload: ["assets/Sounds/Reload/Light%20pistol%20reload%20sound%20effect.mp3"],
  },
  revolver: {
    sonsTiro: [
      "assets/Sounds/Tiro/%231%20Revolver%20shot%20sound.mp3",
    ],
    sonsReload: ["assets/Sounds/Reload/Revolver%20reload%20sound%20effect.mp3"],
  },
  smg: {
    sonsTiro: [
      "assets/Sounds/Tiro/%231%20SMG%20single%20shot%20sound%20effect.mp3",
      "assets/Sounds/Tiro/%232%20SMG%20single%20shot%20sound%20effect.mp3",
      "assets/Sounds/Tiro/%233%20SMG%20single%20shot%20sound%20effect.mp3",
    ],
    sonsReload: [
      "assets/Sounds/Reload/%231%20SMG%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%232%20SMG%20reload%20sound%20effect.mp3",
    ],
  },
  shotgun: {
    sonsTiro: ["assets/Sounds/Tiro/Shotgun%20shot%20sound%20effect.mp3"],
    sonsReload: ["assets/Sounds/Reload/shotgun%20reload%20sound%20effect.mp3"],
  },
  carbine: {
    sonsTiro: ["assets/Sounds/Tiro/assault_rifle_shot%20sound%20effect.mp3"],
    sonsReload: [
      "assets/Sounds/Reload/%231%20assault%20rifle%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%232%20assault%20rifle%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%233%20assault%20rifle%20reload%20sound%20effect.mp3",
    ],
  },
  rifle: {
    sonsTiro: ["assets/Sounds/Tiro/Rifle%20shot%20sound%20effect.mp3"],
    sonsReload: [
      "assets/Sounds/Reload/%231%20rifle%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%232%20Rifle%20reload%20sound%20effect.mp3",
    ],
  },
  dmr: {
    sonsTiro: ["assets/Sounds/Tiro/DMR%20shot%20sound%20effect.mp3"],
    sonsReload: [
      "assets/Sounds/Reload/%231%20DMR%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%232%20DMR%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%233%20DMR%20reload%20sound%20effect.mp3",
    ],
  },
  lmg: {
    sonsTiro: [
      "assets/Sounds/Tiro/%231%20LMG%20single%20shot%20sound%20effect.mp3",
      "assets/Sounds/Tiro/%232%20LMG%20single%20shot%20sound%20effect.mp3",
      "assets/Sounds/Tiro/%233%20LMG%20single%20shot%20sound%20effect%20(stuffy).mp3",
    ],
    sonsReload: [
      "assets/Sounds/Reload/%231%20LMG%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%232%20LMG%20reload%20sound%20effect.mp3",
    ],
  },
  sniper: {
    sonsTiro: [
      "assets/Sounds/Tiro/%231%20Sniper%20shot%20sound.mp3",
      "assets/Sounds/Tiro/%232%20Sniper%20shot%20sound%20effect.mp3",
      "assets/Sounds/Tiro/%233%20Sniper%20shot%20sound%20effect.mp3",
    ],
    sonsReload: [
      "assets/Sounds/Reload/Sniper%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%232%20Sniper%20reload%20sound%20effect.mp3",
      "assets/Sounds/Reload/%233%20Sniper%20reload%20sound%20effect.mp3",
    ],
  },
};

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
  if (!audio.enabled) return;
  if (!audio.ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audio.ctx = new AudioContext();
  }
  if (audio.ctx?.state === "suspended") audio.ctx.resume?.()?.catch?.(() => {});
  primeWeaponAudioBuffers();
  primeWeaponAudioCache();
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

function randomAudioPath(paths) {
  if (!Array.isArray(paths) || paths.length === 0) return null;
  return paths[Math.floor(Math.random() * paths.length)];
}

function weaponAudioPaths() {
  const paths = new Set();
  for (const config of Object.values(weaponAudio)) {
    for (const src of config.sonsTiro || []) paths.add(src);
    for (const src of config.sonsReload || []) paths.add(src);
  }
  return [...paths];
}

function canFetchAudioBuffers() {
  return typeof fetch === "function" && window.location?.protocol !== "file:";
}

function makeAudioClip(src) {
  const clip = new Audio(src);
  clip.preload = "auto";
  clip.load();
  return clip;
}

function audioPoolSize(src) {
  return src.includes("/Tiro/") ? 5 : 2;
}

function primeWeaponAudioCache() {
  if (audio.cachePrimed || !audio.enabled || typeof Audio === "undefined") return;
  audio.cachePrimed = true;
  for (const src of weaponAudioPaths()) {
    if (audio.cache.has(src)) continue;
    audio.cache.set(src, {
      index: 0,
      max: audioPoolSize(src),
      clips: [makeAudioClip(src)],
    });
  }
}

function loadAudioBuffer(src) {
  if (!audio.enabled || !audio.ctx || !src || !canFetchAudioBuffers()) return null;
  let entry = audio.buffers.get(src);
  if (!entry) {
    entry = { buffer: null, promise: null, failed: false };
    audio.buffers.set(src, entry);
  }
  if (entry.buffer || entry.promise || entry.failed) return entry.promise;
  entry.promise = fetch(src)
    .then((response) => {
      if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => audio.ctx.decodeAudioData(data))
    .then((buffer) => {
      entry.buffer = buffer;
      return buffer;
    })
    .catch(() => {
      entry.failed = true;
      return null;
    })
    .finally(() => {
      entry.promise = null;
    });
  return entry.promise;
}

function primeWeaponAudioBuffers() {
  if (audio.buffersPrimed || !audio.enabled || !audio.ctx || !canFetchAudioBuffers()) return;
  audio.buffersPrimed = true;
  for (const src of weaponAudioPaths()) loadAudioBuffer(src);
}

function playDecodedAudioBuffer(src, volume = audio.volume) {
  if (!audio.enabled || !audio.ctx || !src) return false;
  if (audio.ctx.state === "suspended") audio.ctx.resume?.()?.catch?.(() => {});
  const entry = audio.buffers.get(src);
  if (!entry?.buffer) {
    loadAudioBuffer(src);
    return false;
  }
  const source = audio.ctx.createBufferSource();
  const gain = audio.ctx.createGain();
  source.buffer = entry.buffer;
  gain.gain.value = Math.max(0, Math.min(1, volume));
  source.connect(gain);
  gain.connect(audio.ctx.destination);
  source.start(0);
  return true;
}

function playAudioElement(src, volume = audio.volume) {
  if (!audio.enabled || !src || typeof Audio === "undefined") return false;
  primeWeaponAudioCache();
  const pool = audio.cache.get(src);
  const clips = pool?.clips || [makeAudioClip(src)];
  const start = pool?.index || 0;
  let clip = clips[start];
  for (let i = 0; i < clips.length; i++) {
    const candidate = clips[(start + i) % clips.length];
    if (candidate.paused || candidate.ended || candidate.currentTime === 0) {
      clip = candidate;
      break;
    }
  }
  if (pool && !clip.paused && !clip.ended && clip.currentTime > 0 && clips.length < pool.max) {
    clip = makeAudioClip(src);
    clips.push(clip);
  }
  if (pool) pool.index = (clips.indexOf(clip) + 1) % clips.length;
  clip.volume = Math.max(0, Math.min(1, volume));
  clip.currentTime = 0;
  const playback = clip.play();
  if (playback?.catch) playback.catch(() => {});
  return true;
}

function playWeaponSound(weapon, action) {
  const config = weaponAudio[weapon?.id];
  const paths = action === "reload" ? config?.sonsReload : config?.sonsTiro;
  const src = randomAudioPath(paths);
  if (!src) {
    playSound(action === "reload" ? "reload" : "shot");
    return false;
  }
  const volume = action === "reload" ? audio.volume * 0.82 : audio.volume * 0.92;
  return playDecodedAudioBuffer(src, volume) || playAudioElement(src, volume);
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
  destructibles: [
    { x: 585, y: 340, w: 46, h: 46, hp: 70 },
    { x: 650, y: 340, w: 46, h: 46, hp: 70 },
  ],
};

function cloneRects(rects) {
  return rects.map((rect) => ({ ...rect }));
}

function makeMap(name, vibe, theme, wallChanges = [], siteChanges = null, destructibles = []) {
  return {
    ...DEFAULT_MAP,
    name,
    vibe,
    theme: { ...DEFAULT_MAP.theme, ...theme },
    sites: siteChanges ? cloneRects(siteChanges) : cloneRects(DEFAULT_MAP.sites),
    walls: [...cloneRects(DEFAULT_MAP.walls), ...cloneRects(wallChanges)],
    destructibles: destructibles.length ? cloneRects(destructibles) : cloneRects(DEFAULT_MAP.destructibles),
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

MAPS.splice(0, MAPS.length,
  makeMap("Splitline", "Padrao", {}, [], null, [
    { x: 585, y: 340, w: 46, h: 46, hp: 70 },
    { x: 650, y: 340, w: 46, h: 46, hp: 70 },
  ]),
  makeMap("Miragem", "Deserto", {
    floor: "#1f1a12",
    grid: "rgba(255, 209, 102, 0.065)",
    wall: "#4a3a25",
    wallStroke: "#7c6036",
    siteFill: "rgba(255, 190, 80, 0.13)",
    siteStroke: "#ffc56e",
  }, [
    { x: 450, y: 250, w: 46, h: 170 },
    { x: 784, y: 250, w: 46, h: 170 },
    { x: 575, y: 510, w: 130, h: 30 },
    { x: 575, y: 150, w: 130, h: 30 },
  ], [
    { id: "A", x: 145, y: 210, w: 210, h: 150 },
    { id: "B", x: 925, y: 360, w: 210, h: 150 },
  ], [
    { x: 610, y: 315, w: 60, h: 42, hp: 80 },
    { x: 250, y: 395, w: 44, h: 44, hp: 60 },
  ]),
  makeMap("Neon Core", "Futuristico", {
    floor: "#101827",
    grid: "rgba(70, 168, 255, 0.12)",
    wall: "#203447",
    wallStroke: "#46a8ff",
    siteFill: "rgba(98, 230, 160, 0.1)",
    siteStroke: "#62e6a0",
  }, [
    { x: 610, y: 160, w: 60, h: 180 },
    { x: 610, y: 410, w: 60, h: 150 },
    { x: 285, y: 330, w: 170, h: 28 },
    { x: 825, y: 330, w: 170, h: 28 },
    { x: 500, y: 82, w: 280, h: 24 },
  ], [
    { id: "A", x: 150, y: 460, w: 190, h: 125 },
    { id: "B", x: 940, y: 140, w: 190, h: 125 },
  ], [
    { x: 514, y: 350, w: 52, h: 52, hp: 75 },
    { x: 716, y: 350, w: 52, h: 52, hp: 75 },
  ]),
  makeMap("Docas Ferro", "Galpao", {
    floor: "#151b1d",
    grid: "rgba(180, 194, 204, 0.06)",
    wall: "#343b3f",
    wallStroke: "#68727a",
    siteFill: "rgba(255, 77, 93, 0.09)",
    siteStroke: "#ff8a5b",
  }, [
    { x: 150, y: 210, w: 360, h: 34 },
    { x: 770, y: 480, w: 360, h: 34 },
    { x: 560, y: 240, w: 44, h: 240 },
    { x: 676, y: 240, w: 44, h: 240 },
    { x: 92, y: 420, w: 120, h: 32 },
    { x: 1068, y: 270, w: 120, h: 32 },
  ], [
    { id: "A", x: 180, y: 450, w: 190, h: 135 },
    { id: "B", x: 910, y: 135, w: 190, h: 135 },
  ], [
    { x: 610, y: 500, w: 58, h: 46, hp: 90 },
    { x: 610, y: 175, w: 58, h: 46, hp: 90 },
  ]),
  makeMap("Templo de Aster", "Templo antigo", {
    floor: "#161812",
    grid: "rgba(213, 249, 112, 0.055)",
    wall: "#35402b",
    wallStroke: "#7c8d50",
    siteFill: "rgba(213, 249, 112, 0.1)",
    siteStroke: "#d5f970",
  }, [
    { x: 305, y: 180, w: 70, h: 210 },
    { x: 905, y: 330, w: 70, h: 210 },
    { x: 520, y: 312, w: 240, h: 36 },
    { x: 160, y: 520, w: 260, h: 30 },
    { x: 860, y: 155, w: 260, h: 30 },
    { x: 610, y: 235, w: 60, h: 92 },
  ], [
    { id: "A", x: 165, y: 165, w: 185, h: 145 },
    { id: "B", x: 930, y: 415, w: 185, h: 145 },
  ], [
    { x: 612, y: 380, w: 52, h: 52, hp: 85 },
    { x: 480, y: 220, w: 42, h: 42, hp: 65 },
    { x: 758, y: 460, w: 42, h: 42, hp: 65 },
  ]),
);

const TRAINING_MAP = {
  ...DEFAULT_MAP,
  name: "Campo de Tiro",
  vibe: "Arena aberta",
  theme: {
    ...DEFAULT_MAP.theme,
    floor: "#101820",
    grid: "rgba(70, 168, 255, 0.09)",
  },
  attackersSpawn: { x: 640, y: 610 },
  playerDefenderSpawn: { x: 640, y: 110 },
  attackerBotSpawns: [
    { x: 260, y: 150 },
    { x: 640, y: 115 },
    { x: 1020, y: 150 },
  ],
  defendersSpawn: [
    { x: 260, y: 150 },
    { x: 640, y: 115 },
    { x: 1020, y: 150 },
  ],
  sites: [{ id: "TREINO", x: 590, y: 330, w: 100, h: 60 }],
  walls: [],
  destructibles: [],
  botRoutes: [
    [{ x: 260, y: 150 }, { x: 420, y: 300 }, { x: 640, y: 520 }],
    [{ x: 640, y: 115 }, { x: 640, y: 310 }, { x: 640, y: 520 }],
    [{ x: 1020, y: 150 }, { x: 860, y: 300 }, { x: 640, y: 520 }],
  ],
};

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
  clockActive: false,
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
  godMode: false,
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
  agentLocked: false,
  shopTab: "weapons",
  damageIndicator: null,
  scoreboardVisible: false,
  roundBannerTimer: 0,
  training: false,
  tutorial: false,
  tutorialStep: 0,
  tutorialStage: "idle",
  tutorialMoveTime: 0,
  tutorialMoveRemaining: 3,
  tutorialSlowTimer: 0,
  tutorialTimer: 0,
  tutorialKillsAtStart: 0,
  tutorialDefusesAtStart: 0,
  tutorialAbilityUsed: false,
  tutorialFreeUlts: 0,
  tutorialUltUses: 0,
  tutorialTransitioning: false,
  trainingBotSequence: 0,
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
  damageNumbers: [],
  dashGhosts: [],
  neonTrails: [],
  ultimateEffects: [],
  destructibles: [],
  smokes: [],
  shadowZones: [],
  medkits: [],
  ultOrbs: [],
  revealTimer: 0,
  spike: { state: "carried", owner: "player", x: 0, y: 0, timer: 0, site: null, plantProgress: 0, defuseProgress: 0, defuseCheckpoint: 0, defuserId: null },
  message: "Plante a spike em A ou B.",
  lastMessage: "",
  abilityCooldown: 0,
  playerUltPoints: 0,
  lastShot: 0,
  reloadTimer: 0,
  roundOverTimer: 0,
  shake: 0,
  damageFlash: 0,
  botPlanSiteIndex: 0,
  pauseReturnState: null,
  agentReturnState: "main",
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
    agentId: game.selectedAgent.id,
    ultPoints: game.playerUltPoints,
    ultimate: null,
    orbChannel: null,
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
    id: `bot-${index}`,
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
    shootGraceTimer: 0,
    idleTimer: 0,
    aiState: "hold",
    revealedTimer: 0,
    agentId: agents[index % agents.length].id,
    ultimatePoints: Math.min(ULT_MAX_POINTS, Math.max(0, game.roundNumber - 1) + (index % 2)),
    ultimate: null,
    orbChannel: null,
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
    shootGraceTimer: 0,
    idleTimer: 0,
    aiState: "follow",
    revealedTimer: 0,
    agentId: agents[(index + 2) % agents.length].id,
    ultimatePoints: Math.min(ULT_MAX_POINTS, Math.floor((game.roundNumber - 1) / 2)),
    ultimate: null,
    orbChannel: null,
  };
}

function spawnRoundPickups() {
  const medkitPoints = [
    { x: map.width * 0.25, y: map.height * 0.52 },
    { x: map.width * 0.5, y: map.height * 0.34 },
    { x: map.width * 0.75, y: map.height * 0.52 },
  ].map((point) => nearestWalkablePoint(point, point));
  game.medkits = medkitPoints.map((point, index) => ({ ...point, id: `medkit-${index}`, phase: index * 1.7 }));
  const occupied = [...medkitPoints];
  game.ultOrbs = Array.from({ length: 3 }, (_, index) => {
    const point = randomAccessiblePickupPoint(occupied);
    occupied.push(point);
    return { ...point, id: `ult-orb-${index}`, phase: index * 2.1, reservadaPor: null };
  });
}

function randomAccessiblePickupPoint(occupied = []) {
  const starts = [map.attackersSpawn, map.playerDefenderSpawn, ...map.defendersSpawn];
  for (let attempt = 0; attempt < 120; attempt++) {
    const candidate = {
      x: 52 + Math.random() * (map.width - 104),
      y: 52 + Math.random() * (map.height - 104),
      r: 22,
    };
    if (solidWalls().some((wall) => circleRectCollides(candidate, wall))) continue;
    if (occupied.some((point) => Math.hypot(point.x - candidate.x, point.y - candidate.y) < 105)) continue;
    if (starts.some((start) => findGridStep({ ...start, r: 17 }, candidate))) {
      return { x: candidate.x, y: candidate.y };
    }
  }
  return nearestWalkablePoint({ x: map.width / 2, y: map.height / 2 }, map.attackersSpawn);
}

function resetRound() {
  game.roundNumber += game.phase === "ended" ? 1 : 0;
  map.botRoutes = randomizedBotRoutes(map);
  game.botPlanSiteIndex = Math.floor(Math.random() * map.sites.length);
  const sideFlipped = Math.floor((game.roundNumber - 1) / 3) % 2 === 1;
  const nextSide = sideFlipped ? opposingSide(game.startingSide) : game.startingSide;
  const changedSide = game.playerSide !== nextSide;
  game.playerSide = nextSide;
  game.phase = "buy";
  game.phaseTime = game.sandbox || game.training ? 9999 : BUY_TIME;
  game.clockActive = game.introTimer <= 0;
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
   game.damageNumbers = [];
   game.dashGhosts = [];
   game.neonTrails = [];
   game.ultimateEffects = [];
   game.player.orbChannel = null;
   game.player.orbAssignment = null;
   game.allies.forEach((ally) => {
     ally.orbChannel = null;
     ally.orbAssignment = null;
   });
   game.bots.forEach((bot) => {
     bot.orbChannel = null;
     bot.orbAssignment = null;
   });
   game.destructibles = game.training
    ? []
    : map.destructibles.map((box, index) => ({ ...box, maxHp: box.hp, id: `box-${index}` }));
  game.smokes = [];
  game.shadowZones = [];
  if (game.training) {
    game.medkits = [];
    game.ultOrbs = [];
  } else {
    spawnRoundPickups();
  }
  game.revealTimer = 0;
  game.abilityCooldown = 0;
  game.player.ultPoints = game.playerUltPoints;
  game.lastShot = 0;
  game.reloadTimer = 0;
  game.roundOverTimer = 0;
  const carrier = game.bots.find((bot) => bot.hasSpike);
  game.spike = {
    state: game.training ? "disabled" : "carried",
    owner: game.training ? null : game.playerSide === "attackers" ? "player" : "bot",
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
  if (!game.sandbox && !game.training && game.introTimer <= 0) openShop();
}

function startActionRound() {
  game.phase = "action";
  game.phaseTime = game.training || game.sandbox ? 9999 : 90;
  game.clockActive = game.introTimer <= 0;
  closeShop();
  showRoundBanner(game.playerSide === "attackers" ? "Ataque" : "Defesa", game.playerSide === "attackers" ? "Plante a spike em A ou B." : "Impeca o plant ou desarme.", `Round ${game.roundNumber}`);
  setMessage(game.playerSide === "attackers"
    ? "Ataque: plante a spike em A ou B."
    : "Defesa: impeca o plant. Se plantarem, desarme com F.");
}

function openShop() {
  updateShopState();
  ui.shop.classList.remove("hidden");
  ui.shopBackdrop.classList.remove("hidden");
}

function closeShop() {
  ui.shop.classList.add("hidden");
  ui.shopBackdrop.classList.add("hidden");
}

function fullReset() {
  game.selectedWeapon = weapons[0];
  game.ownedWeapons = new Set(["pistol"]);
  game.upgrades = { armorCapacity: 0, speed: false, magazine: false, reload: false };
  game.armor = 0;
  game.allyLoadout = { weaponId: "pistol", armor: 0 };
  game.selectedAgent = agents[0];
  game.agentLocked = false;
  game.godMode = false;
  game.playerUltPoints = 0;
  buildShop();
}

function startNewMatch() {
  game.scoreA = 0;
  game.scoreD = 0;
  game.playerScore = 0;
  game.enemyScore = 0;
  game.money = game.sandbox || game.training ? 99999 : ECONOMY.start;
  game.lossStreak = 0;
  game.stats = { kills: 0, deaths: 0, headshots: 0, plants: 0, defuses: 0, damage: 0 };
  game.ownedWeapons = new Set(["pistol"]);
  game.upgrades = { armorCapacity: 0, speed: false, magazine: false, reload: false };
  game.armor = 0;
  game.allyLoadout = { weaponId: "pistol", armor: 0 };
  game.selectedWeapon = weapons[0];
  game.roundMoneyDelta = 0;
  game.playerUltPoints = 0;
  game.roundNumber = 1;
  game.startingSide = Math.random() < 0.5 ? "attackers" : "defenders";
  game.playerSide = game.startingSide;
  map = game.training ? TRAINING_MAP : MAPS[Math.floor(Math.random() * MAPS.length)];
  map.botRoutes = randomizedBotRoutes(map);
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
  const won = game.playerScore > game.enemyScore;
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

function endRound(winner, reason, outcome = "standard") {
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
  } else {
    game.enemyScore += 1;
    game.lossStreak += 1;
  }
  if (outcome === "spike_death") {
    moneyGained = ECONOMY.spikeDeathCash - game.money;
    if (!game.sandbox) game.money = ECONOMY.spikeDeathCash;
  } else if (winner === game.playerSide) {
    moneyGained = outcome === "defuse"
      ? ECONOMY.defuseWin
      : outcome === "elimination"
        ? ECONOMY.eliminationWin
        : ECONOMY.standardWin;
    if (!game.sandbox) game.money += moneyGained;
  } else {
    moneyGained = ECONOMY.lossConsolation;
    if (!game.sandbox) game.money += moneyGained;
  }
  if (!game.sandbox && !game.training) game.money = Math.min(game.money, ECONOMY.cap);
  game.roundMoneyDelta = moneyGained;
  const won = winner === game.playerSide;
  const moneyLabel = moneyGained >= 0 ? `+$${moneyGained}` : `-$${Math.abs(moneyGained)}`;
  const fullReason = game.sandbox ? reason : `${reason}  ${moneyLabel}`;
  setMessage(fullReason);
  showRoundBanner(
    won ? "Round vencido" : "Round perdido",
    fullReason,
    `${game.playerScore} - ${game.enemyScore}`,
    2.8
  );
  playSound(won ? "round_win" : "round_lose");
  if (game.playerScore >= MATCH_ROUNDS || game.enemyScore >= MATCH_ROUNDS) {
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
  if (entity.id === "player" && game.godMode) return 0;
  if (amount > 0 && entity.orbChannel) entity.orbChannel = null;
  let remaining = amount;
  if (entity.armor > 0) {
    const absorbed = Math.min(entity.armor, remaining * 0.7);
    entity.armor -= absorbed;
    remaining -= absorbed;
  }
  entity.hp -= remaining;
  if (entity.id === "player") game.armor = Math.max(0, entity.armor || 0);
  return remaining;
}

function solidWalls() {
  return [...map.walls, ...game.destructibles];
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
  const colliders = walls === map.walls ? solidWalls() : walls;
  const startX = entity.x;
  const startY = entity.y;
  entity.x += dx;
  for (const wall of colliders) {
    if (circleRectCollides(entity, wall)) entity.x -= dx;
  }
  entity.y += dy;
  for (const wall of colliders) {
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

function spawnWallImpact(x, y, oldX, oldY) {
  const angle = Math.atan2(y - oldY, x - oldX) + Math.PI;
  for (let i = 0; i < 9; i++) {
    const spread = (Math.random() - 0.5) * 1.4;
    const speed = 70 + Math.random() * 170;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle + spread) * speed,
      vy: Math.sin(angle + spread) * speed,
      life: 0.16 + Math.random() * 0.2,
      maxLife: 0.36,
      color: Math.random() < 0.55 ? "#ffd166" : "#9aaeba",
      size: 1.3 + Math.random() * 2.4,
    });
  }
}

function spawnDashTrail(entity, fromX, fromY, toX, toY, color) {
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    game.dashGhosts.push({
      x: fromX + (toX - fromX) * t,
      y: fromY + (toY - fromY) * t,
      r: entity.r,
      color,
      life: 0.18 + i * 0.025,
      maxLife: 0.36,
    });
  }
  spawnParticles(fromX, fromY, color, 6, 120);
  spawnParticles(toX, toY, color, 10, 180);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function jitterPoint(point, amount = 44) {
  const candidate = {
    x: clamp(point.x + (Math.random() - 0.5) * amount * 2, 44, map.width - 44),
    y: clamp(point.y + (Math.random() - 0.5) * amount * 2, 44, map.height - 44),
  };
  return nearestWalkablePoint(candidate, { x: candidate.x, y: candidate.y, r: 18 });
}

function randomizedBotRoutes(currentMap) {
  const routes = buildMapRoutes(currentMap).map((route) => route.map((point, index) => {
    if (index === 0 || index === route.length - 1) return { ...point };
    return jitterPoint(point, 52);
  }));
  return routes.sort(() => Math.random() - 0.5);
}

function spawnDamageNumber(entity, amount, headshot = false) {
  game.damageNumbers.push({
    x: entity.x + (Math.random() - 0.5) * 10,
    y: entity.y - entity.r - 8,
    vy: headshot ? -42 : -30,
    drift: (Math.random() - 0.5) * 18,
    text: `-${Math.max(1, Math.round(amount))}`,
    life: headshot ? 0.72 : 0.58,
    maxLife: headshot ? 0.72 : 0.58,
    color: headshot ? "#ff4d5d" : "#f8fafc",
    size: headshot ? 22 : 15,
    weight: headshot ? "900" : "700",
  });
}

function shakeForWeapon(weapon) {
  if (weapon.id === "sniper") return 0.22;
  if (weapon.id === "dmr" || weapon.id === "rifle") return 0.11;
  if (weapon.id === "lmg") return 0.1;
  if (weapon.id === "shotgun" || weapon.id === "revolver") return 0.09;
  return 0.045;
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
  ui.roundBanner.classList.toggle("spike-alert", title.toLowerCase().includes("spike") || text.toLowerCase().includes("spike plant"));
  game.roundBannerTimer = duration;
}

function updateScoreboard() {
  const shopClosed = ui.shop?.classList?.contains("hidden") ?? true;
  const canShow = game.scoreboardVisible
    && game.menuState === "none"
    && shopClosed
    && ["buy", "action", "ended"].includes(game.phase);
  if (ui.scoreboard?.classList) ui.scoreboard.classList.toggle("hidden", !canShow);
  if (ui.scoreboardTitle) ui.scoreboardTitle.textContent = `${game.playerScore} - ${game.enemyScore} | ${game.mapName}`;
  if (ui.kills) ui.kills.textContent = game.stats.kills;
  if (ui.deaths) ui.deaths.textContent = game.stats.deaths;
  if (ui.headshots) ui.headshots.textContent = game.stats.headshots;
  if (ui.plants) ui.plants.textContent = game.stats.plants;
  if (ui.defuses) ui.defuses.textContent = game.stats.defuses;
  if (ui.scoreMoney) ui.scoreMoney.textContent = `$${game.money}`;
}

function setTutorialPrompt(kicker, instruction, progress = "") {
  if (ui.tutorialKicker) ui.tutorialKicker.textContent = kicker;
  if (ui.tutorialInstruction) ui.tutorialInstruction.textContent = instruction;
  if (ui.tutorialProgress) ui.tutorialProgress.textContent = progress;
  ui.tutorialPrompt?.classList.remove("hidden", "fade-out");
}

function tutorialAgentDescription(agent) {
  const descriptions = {
    neon: ["Entrada agressiva", "Dash direcional e Ultimate de velocidade com tiros neon."],
    viper: ["Controle de espaço", "Nuvem venenosa e Ultimate química para negar áreas."],
    sage: ["Suporte da equipe", "Cura direta e Ultimate que restaura vida e escudos aliados."],
    omen: ["Controle tático", "Smoke para cortar visão e criar rotas seguras."],
  };
  return descriptions[agent.id] || [agent.role, agent.ability];
}

function showTutorialAgentChoice() {
  game.tutorialStep = 4;
  game.tutorialStage = "agents";
  game.paused = true;
  ui.tutorialPrompt?.classList.add("hidden");
  ui.tutorialAgentPanel?.classList.remove("hidden");
  if (!ui.tutorialAgentGrid) return;
  ui.tutorialAgentGrid.innerHTML = "";
  for (const agent of agents) {
    const [role, description] = tutorialAgentDescription(agent);
    const presentation = agentPresentation(agent);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-agent-card";
    button.style.setProperty("--agent-color", agent.color);
    button.innerHTML = `
      <span class="tutorial-agent-portrait" aria-hidden="true">
        <img src="${presentation.icon}" alt="">
      </span>
      <b>${agent.name}</b>
      <span>${role}</span>
      <small>${description}</small>`;
    attachButtonFeedback(button);
    button.addEventListener("click", () => {
      game.selectedAgent = agent;
      game.agentLocked = true;
      ui.tutorialAgentPanel?.classList.add("hidden");
      ui.tutorialPrompt?.classList.remove("hidden");
      game.paused = false;
      game.tutorialStage = "agent-test";
      game.tutorialAbilityUsed = false;
      game.abilityCooldown = 0;
      game.player.agentId = agent.id;
      setTutorialPrompt("Fase 5 - Agentes", `${agent.name}: ${description}`, "Use E para testar a habilidade");
    });
    ui.tutorialAgentGrid.appendChild(button);
  }
}

function resetTutorialSpike(state = "disabled", point = game.player) {
  game.spike = {
    state,
    owner: state === "carried" ? "player" : null,
    x: point.x,
    y: point.y,
    timer: state === "planted" ? SPIKE_DETONATE_TIME : 0,
    site: null,
    plantProgress: 0,
    defuseProgress: 0,
    defuseCheckpoint: 0,
    defuserId: null,
  };
}

function clearTutorialEntities() {
  game.bots = [];
  game.allies = [];
  game.bullets = [];
  game.particles = [];
  game.smokes = [];
  game.shadowZones = [];
  game.medkits = [];
  game.ultOrbs = [];
  game.destructibles = [];
  game.explosions = [];
  game.hitMarkers = [];
  game.damageNumbers = [];
  game.ultimateEffects = [];
}

function safeTutorialSpawn(preferredPoint, fallback = map.attackersSpawn, radius = 18) {
  const base = nearestWalkablePoint({ ...preferredPoint, r: radius }, { ...fallback, r: radius });
  const offsets = [
    { x: 0, y: 0 },
    { x: 54, y: 0 },
    { x: -54, y: 0 },
    { x: 0, y: 54 },
    { x: 0, y: -54 },
    { x: 72, y: 48 },
    { x: -72, y: 48 },
    { x: 72, y: -48 },
    { x: -72, y: -48 },
  ];
  for (const offset of offsets) {
    const point = nearestWalkablePoint({ x: base.x + offset.x, y: base.y + offset.y, r: radius }, { ...fallback, r: radius });
    const probe = { x: point.x, y: point.y, r: radius };
    if (!isEntityBlocked(probe)) return point;
  }
  return { x: fallback.x, y: fallback.y };
}

function movePlayerToTutorial(point, fallback = point) {
  const safe = safeTutorialSpawn(point, fallback, game.player.r || 18);
  game.player.x = safe.x;
  game.player.y = safe.y;
  game.player.lastX = safe.x;
  game.player.lastY = safe.y;
  game.player.alive = true;
}

function tutorialSiteA() {
  return map.sites.find((site) => site.id === "A") || map.sites[0];
}

function tutorialSiteB() {
  return map.sites.find((site) => site.id === "B") || map.sites[1] || map.sites[0];
}

function tutorialSiteCenter(site = tutorialSiteA()) {
  return { x: site.x + site.w / 2, y: site.y + site.h / 2 };
}

function spawnTutorialBot(point, index, options = {}) {
  const safe = safeTutorialSpawn(point, game.player, 17);
  const bot = makeBot(safe, index);
  bot.id = `tutorial-bot-${index}`;
  bot.hasSpike = false;
  bot.hp = options.hp || 65;
  bot.maxHp = bot.hp;
  bot.armor = 0;
  bot.maxArmor = 0;
  bot.speed = options.static ? 0 : (options.speed || 78);
  bot.fireTimer = options.fireTimer ?? 1.5;
  bot.tutorialStatic = Boolean(options.static);
  bot.aiState = options.static ? "hold" : "push";
  sanitizeEntityPosition(bot);
  return bot;
}

function setTutorialSide(side) {
  game.playerSide = side;
  game.startingSide = side;
  game.player.agentId = game.selectedAgent.id;
}

function placeTutorialOrbs() {
  const points = [
    { x: map.width * 0.25, y: map.height * 0.42 },
    { x: map.width * 0.5, y: map.height * 0.28 },
    { x: map.width * 0.75, y: map.height * 0.42 },
  ];
  game.ultOrbs = points.map((point, index) => ({
    ...safeTutorialSpawn(point, map.attackersSpawn, 18),
    id: `tutorial-orb-${index}`,
    phase: index * 2.1,
    reservadaPor: null,
  }));
}

function placeTutorialMedkits() {
  const points = [
    { x: map.width * 0.35, y: map.height * 0.42 },
    { x: map.width * 0.5, y: map.height * 0.34 },
    { x: map.width * 0.65, y: map.height * 0.42 },
  ];
  game.medkits = points.map((point, index) => ({
    ...safeTutorialSpawn(point, map.attackersSpawn, 18),
    id: `tutorial-medkit-${index}`,
    phase: index * 1.7,
  }));
}

function completeTutorialPhase(nextStep, label = "Fase concluida") {
  if (game.tutorialTransitioning) return;
  game.tutorialTransitioning = true;
  game.paused = true;
  game.bullets = [];
  setTutorialPrompt(label, "Preparando a proxima fase", "1.00 segundo");
  showRoundBanner(label, "Preparando a proxima fase", "Tutorial", 1);
  setTimeout(() => {
    if (!game.tutorial) return;
    game.tutorialTransitioning = false;
    game.paused = false;
    setTutorialPhase(nextStep);
  }, 1000);
}

function setTutorialPhase(step) {
  game.tutorialStep = step;
  game.tutorialTransitioning = false;
  game.tutorialMoveTime = 0;
  game.tutorialMoveRemaining = 3;
  game.tutorialSlowTimer = 0;
  game.tutorialTimer = 0;
  game.phase = "action";
  game.phaseTime = 9999;
  game.clockActive = true;
  game.paused = false;
  game.player.hp = game.player.maxHp;
  game.player.armor = game.armor;
  game.player.ammo = currentMagSize();
  game.reloadTimer = 0;
  clearTutorialEntities();
  resetTutorialSpike();
  ui.tutorialOverlay?.classList.remove("hidden");
  ui.tutorialAgentPanel?.classList.add("hidden");

  if (step === 0) {
    game.tutorialStage = "movement";
    setTutorialSide("attackers");
    movePlayerToTutorial({ x: map.width / 2, y: map.height / 2 }, map.attackersSpawn);
    setTutorialPrompt("Fase 1 - Movimento", "Use WASD para andar", "3.00 segundos");
    return;
  }

  if (step === 1) {
    game.tutorialStage = "combat";
    setTutorialSide("attackers");
    movePlayerToTutorial({ x: map.width * 0.34, y: map.height * 0.5 }, map.attackersSpawn);
    game.bots = [spawnTutorialBot({ x: game.player.x + 260, y: game.player.y }, 0, {
      static: true,
      hp: Math.min(60, game.selectedWeapon.damage || 35),
    })];
    game.tutorialKillsAtStart = game.stats.kills;
    setTutorialPrompt("Fase 2 - Eliminar inimigos", "Ande, mire e clique com o Botao Esquerdo para atirar", "Elimine o alvo");
    return;
  }

  if (step === 2) {
    game.tutorialStage = "defuse";
    setTutorialSide("defenders");
    const site = tutorialSiteB();
    const spikePoint = safeTutorialSpawn(tutorialSiteCenter(site), site, 18);
    const spawnPoint = randomAccessiblePickupPoint([spikePoint]);
    movePlayerToTutorial(spawnPoint, map.playerDefenderSpawn || map.defendersSpawn[0]);
    resetTutorialSpike("planted", spikePoint);
    game.spike.site = site.id;
    game.tutorialDefusesAtStart = game.stats.defuses;
    setTutorialPrompt("Fase 3 - Desarmar Spike", "Encontre a Spike no site B e segure F para desarmar", "Sem caixas, sem inimigos");
    return;
  }

  if (step === 3) {
    game.tutorialStage = "plant-spike";
    setTutorialSide("attackers");
    const site = tutorialSiteA();
    movePlayerToTutorial(tutorialSiteCenter(site), map.attackersSpawn);
    resetTutorialSpike("carried", game.player);
    setTutorialPrompt("Fase 4 - Defender Spike", "Segure F na area A para plantar", "Depois elimine 3 bots em camera lenta");
    return;
  }

  if (step === 4) {
    game.tutorialStage = "agents";
    showTutorialAgentChoice();
    return;
  }

  if (step === 5) {
    game.tutorialStage = "orbs";
    setTutorialSide("attackers");
    movePlayerToTutorial({ x: map.width / 2, y: map.height - 70 }, map.attackersSpawn);
    setUltimatePoints(game.player, 0);
    game.tutorialFreeUlts = 0;
    placeTutorialOrbs();
    setTutorialPrompt("Fase 6 - Orbs", "Segure F em cada orb para carregar a Ultimate", "Colete 3 orbs");
    return;
  }

  if (step === 6) {
    game.tutorialStage = "medkits";
    setTutorialSide("attackers");
    movePlayerToTutorial({ x: map.width / 2, y: map.height - 70 }, map.attackersSpawn);
    game.player.hp = 5;
    placeTutorialMedkits();
    setTutorialPrompt("Fase 7 - Medkits", "Colete medkits ate ficar com vida cheia", `${Math.ceil(game.player.hp)}/${game.player.maxHp} HP`);
  }
}

function updateTutorial(dt) {
  if (!game.tutorial || game.paused) return;
  const safeDt = Number.isFinite(dt) && dt > 0 ? dt : 0;
  game.tutorialTimer += safeDt;
  if (game.tutorialStep === 0) {
    const movementKeyPressed = ["w", "a", "s", "d"].some((key) => keys.has(key));
    if (!Number.isFinite(game.tutorialMoveRemaining)) game.tutorialMoveRemaining = 3;
    if (!Number.isFinite(game.tutorialMoveTime)) game.tutorialMoveTime = 0;
    if (movementKeyPressed) {
      game.tutorialMoveTime += safeDt;
      game.tutorialMoveRemaining = Math.max(0, game.tutorialMoveRemaining - safeDt);
    }
    if (ui.tutorialProgress) {
      ui.tutorialProgress.textContent = `${game.tutorialMoveRemaining.toFixed(2)} segundos`;
    }
    if (game.tutorialMoveRemaining <= 0) {
      ui.tutorialPrompt?.classList.add("fade-out");
      completeTutorialPhase(1);
    }
    return;
  }

  if (game.tutorialStep === 1) {
    if (game.stats.kills > game.tutorialKillsAtStart) completeTutorialPhase(2);
    return;
  }

  if (game.tutorialStep === 2) {
    if (ui.tutorialProgress) {
      const distance = Math.hypot(game.player.x - game.spike.x, game.player.y - game.spike.y);
      ui.tutorialProgress.textContent = distance < 46 ? `Defuse ${Math.round(game.spike.defuseProgress * 100)}%` : "Ande ate a Spike";
    }
    if (game.stats.defuses > game.tutorialDefusesAtStart || game.phase === "ended") completeTutorialPhase(3);
    return;
  }

  if (game.tutorialStep === 3 && game.tutorialStage === "plant-spike" && game.spike.state === "planted") {
    game.tutorialStage = "defend";
    game.tutorialSlowTimer = 999;
    const site = tutorialSiteA();
    const center = tutorialSiteCenter(site);
    game.bots = [
      spawnTutorialBot({ x: center.x + 210, y: center.y - 86 }, 0, { hp: 55, speed: 64 }),
      spawnTutorialBot({ x: center.x + 250, y: center.y + 12 }, 1, { hp: 55, speed: 70 }),
      spawnTutorialBot({ x: center.x + 210, y: center.y + 96 }, 2, { hp: 55, speed: 76 }),
    ];
    game.tutorialKillsAtStart = game.stats.kills;
    setTutorialPrompt("Fase 4 - Defender Spike", "Elimine os 3 bots inimigos", "Camera lenta ativa");
  }

  if (game.tutorialStep === 3 && game.tutorialStage === "defend") {
    const kills = Math.max(0, game.stats.kills - game.tutorialKillsAtStart);
    if (ui.tutorialProgress) ui.tutorialProgress.textContent = `${Math.min(3, kills)}/3 bots`;
    if (kills >= 3) completeTutorialPhase(4);
    return;
  }

  if (game.tutorialStep === 4) {
    if (game.tutorialStage === "agent-test" && game.tutorialAbilityUsed) {
      if (ui.tutorialProgress) ui.tutorialProgress.textContent = "Habilidade testada";
      if (game.tutorialTimer > 1.2) completeTutorialPhase(5);
    }
    return;
  }

  if (game.tutorialStep === 5) {
    const collected = Math.max(0, 3 - game.ultOrbs.length);
    if (ui.tutorialProgress) ui.tutorialProgress.textContent = game.tutorialStage === "ult-test"
      ? `${game.tutorialFreeUlts} ultimates gratis restantes`
      : `${collected}/3 orbs`;
    if (game.tutorialStage === "orbs" && game.ultOrbs.length === 0) {
      game.tutorialStage = "ult-test";
      game.tutorialTimer = 0;
      game.tutorialFreeUlts = 3;
      setUltimatePoints(game.player, ULT_MAX_POINTS);
      setTutorialPrompt("Fase 6 - Ultimate", "Aperte Q para testar a Ultimate escolhida", "3 ultimates gratis");
      return;
    }
    if (game.tutorialStage === "ult-test" && (game.tutorialFreeUlts <= 0 || game.tutorialTimer > 10)) completeTutorialPhase(6);
    return;
  }

  if (game.tutorialStep === 6) {
    if (ui.tutorialProgress) ui.tutorialProgress.textContent = `${Math.ceil(game.player.hp)}/${game.player.maxHp} HP`;
    if (game.tutorialStage === "medkits" && game.player.hp >= game.player.maxHp) {
      game.tutorialStage = "complete";
      setTutorialPrompt("Tutorial finalizado!", "Deixe o seu 'GG' nos comentarios.", "Voltando ao menu principal");
      setTimeout(() => {
        game.tutorial = false;
        game.paused = false;
        ui.tutorialOverlay?.classList.add("hidden");
        showMainMenu();
      }, 2000);
    }
  }
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
  for (const wall of solidWalls()) {
    if (lineIntersectsRect(x1, y1, x2, y2, wall)) return true;
  }
  return false;
}

function firstWallPointOnLine(x1, y1, x2, y2) {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.max(1, Math.ceil(distance / 4));
  let lastClear = { x: x1, y: y1 };
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (solidWalls().some((wall) => rectContains(wall, x, y))) {
      return lastClear;
    }
    lastClear = { x, y };
  }
  return { x: x2, y: y2 };
}

function hasLineOfSight(a, b) {
  if (isBlindedByShadow(a)) return false;
  if (lineIntersectsAnyWall(a.x, a.y, b.x, b.y)) return false;
  for (const smoke of game.smokes) {
    const dist = pointLineDistance(smoke.x, smoke.y, a.x, a.y, b.x, b.y);
    if (dist < smoke.r) return false;
  }
  return true;
}

function hasCombatLineOfSight(a, b) {
  if (isBlindedByShadow(a)) return false;
  if (hasLineOfSight(a, b)) return true;
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const side = angle + Math.PI / 2;
  const offsets = [-10, 10];
  for (const offset of offsets) {
    const ax = a.x + Math.cos(side) * offset;
    const ay = a.y + Math.sin(side) * offset;
    const bx = b.x + Math.cos(side) * offset;
    const by = b.y + Math.sin(side) * offset;
    if (!lineIntersectsAnyWall(ax, ay, bx, by)) {
      let blockedBySmoke = false;
      for (const smoke of game.smokes) {
        if (pointLineDistance(smoke.x, smoke.y, ax, ay, bx, by) < smoke.r) {
          blockedBySmoke = true;
          break;
        }
      }
      if (!blockedBySmoke) return true;
    }
  }
  return false;
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

function smoothStep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function distanceDamageMultiplier(bullet) {
  const traveled = Math.hypot(bullet.x - bullet.startX, bullet.y - bullet.startY);
  const curve = damageFalloff[bullet.weaponId] || { start: 360, end: 960, min: 0.7 };
  if (traveled <= curve.start) return 1;
  if (traveled >= curve.end) return curve.min;
  const progress = smoothStep((traveled - curve.start) / (curve.end - curve.start));
  const multiplier = 1 - (1 - curve.min) * progress;
  return bullet.ultimateTrail ? Math.max(multiplier, 0.82) : multiplier;
}

function damageForHit(bullet, target, region) {
  const falloff = distanceDamageMultiplier(bullet);
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
    game.shake = Math.max(game.shake, shakeForWeapon(weapon));
    playWeaponSound(weapon, "shot");
    spawnParticles(owner.x + Math.cos(owner.angle) * 24, owner.y + Math.sin(owner.angle) * 24, "#ffe6a8", 5, 90);
    if (owner.ammo <= 0) reload();
  }
  const count = weapon.pellets || 1;
  for (let i = 0; i < count; i++) {
    const base = Math.atan2(targetY - owner.y, targetX - owner.x);
    const movingPenalty = owner.moving ? 1.8 : 1;
    const recoilPenalty = team === "player" ? 1 + game.recoilHeat * 0.85 : 1 + (owner.aiState === "plant" || owner.aiState === "defuse" ? 0.55 : 0);
    const neonUltimate = owner.ultimate?.type === "neon";
    const spread = neonUltimate ? 0 : (Math.random() - 0.5) * weapon.spread * 2 * movingPenalty * recoilPenalty;
    const startX = owner.x + Math.cos(base) * owner.r;
    const startY = owner.y + Math.sin(base) * owner.r;
    game.bullets.push({
      x: startX,
      y: startY,
      startX,
      startY,
      vx: Math.cos(base + spread) * (neonUltimate ? weapon.speed * 1.25 : weapon.speed),
      vy: Math.sin(base + spread) * (neonUltimate ? weapon.speed * 1.25 : weapon.speed),
      life: 0.9,
      damage: neonUltimate ? Math.min(55, weapon.damage * 1.25) : weapon.damage,
      team,
      weaponId: weapon.id,
      ultimateTrail: neonUltimate,
      hitIds: [],
    });
  }
}

function reload() {
  if (game.reloadTimer > 0) return;
  if (game.player.ammo >= currentMagSize()) return;
  game.reloadTimer = currentReloadTime();
  playWeaponSound(game.selectedWeapon, "reload");
}

function entityTeam(entity) {
  if (entity.id === "player" || entity.id?.startsWith("ally-")) return "player";
  return "bot";
}

function hostileShadowAt(entity) {
  const team = entityTeam(entity);
  return game.shadowZones.find((zone) =>
    zone.ownerTeam !== team && Math.hypot(entity.x - zone.x, entity.y - zone.y) <= zone.r + entity.r
  ) || null;
}

function shadowSlowMultiplier(entity) {
  return hostileShadowAt(entity)?.slowMultiplier || 1;
}

function isBlindedByShadow(entity) {
  return Boolean(hostileShadowAt(entity));
}

function getUltimatePoints(entity) {
  if (entity.id === "player") return Number.isFinite(entity.ultPoints) ? entity.ultPoints : 0;
  return Number.isFinite(entity.ultimatePoints) ? entity.ultimatePoints : 0;
}

function setUltimatePoints(entity, value) {
  const points = Math.max(0, Math.min(ULT_MAX_POINTS, Number(value) || 0));
  if (entity.id === "player") {
    entity.ultPoints = points;
    game.playerUltPoints = points;
  } else {
    entity.ultimatePoints = points;
  }
}

function agentById(id) {
  return agents.find((agent) => agent.id === id) || agents[0];
}

function addUltimateEffect(type, entity, color, life = 5) {
  game.ultimateEffects.push({
    type,
    entityId: entity.id,
    x: entity.x,
    y: entity.y,
    color,
    life,
    maxLife: life,
    radius: 8,
  });
  spawnParticles(entity.x, entity.y, color, 36, 240);
  game.shake = Math.max(game.shake, 0.38);
}

function limitedCastPoint(origin, target, maxRange) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const distance = Math.hypot(dx, dy) || 1;
  const scale = Math.min(1, maxRange / distance);
  return { x: origin.x + dx * scale, y: origin.y + dy * scale };
}

function activateUltimate(entity) {
  const infiniteSandboxUlt = game.sandbox && entity?.id === "player";
  const tutorialFreeUlt = game.tutorial && entity?.id === "player" && game.tutorialFreeUlts > 0;
  if (!entity?.alive || (!infiniteSandboxUlt && !tutorialFreeUlt && getUltimatePoints(entity) < ULT_MAX_POINTS) || (!infiniteSandboxUlt && entity.ultimate)) return false;
  const agent = agentById(entity.agentId);
  const team = entityTeam(entity);
  if (infiniteSandboxUlt) entity.ultimate = null;
  else if (tutorialFreeUlt) {
    game.tutorialFreeUlts = Math.max(0, game.tutorialFreeUlts - 1);
    game.tutorialUltUses += 1;
    if (game.tutorialFreeUlts > 0) setUltimatePoints(entity, ULT_MAX_POINTS);
    else setUltimatePoints(entity, 0);
  }
  else {
    setUltimatePoints(entity, 0);
  }

  if (agent.id === "neon") {
    entity.ultimate = { type: "neon", life: 7, maxLife: 7 };
    addUltimateEffect("wind", entity, "#7df9ff", 7);
  } else if (agent.id === "viper") {
    entity.ultimate = { type: "viper", life: 9, maxLife: 9 };
    const requested = entity.id === "player" ? mouse : entity;
    const center = limitedCastPoint(entity, requested, VIPER_CAST_RANGE);
    game.smokes.push({
      ...nearestWalkablePoint(center, entity),
      r: 36,
      targetR: 168,
      life: 9,
      poison: true,
      damagePerSecond: 26,
      ownerTeam: team,
      ultimate: true,
    });
    addUltimateEffect("chemical-fog", entity, "#35c46a", 9);
  } else if (agent.id === "sage") {
    entity.ultimate = { type: "sage", life: 4, maxLife: 4 };
    const squad = team === "player" ? [game.player, ...game.allies] : game.bots;
    for (const target of squad) {
      if (!target.alive) continue;
      target.hp = target.maxHp;
      target.armor = target.maxArmor || 0;
      if (target.id === "player") game.armor = target.armor;
      spawnParticles(target.x, target.y, "#62e6a0", 22, 150);
    }
    addUltimateEffect("healing-beam", entity, "#62e6a0", 4);
  } else {
    entity.ultimate = { type: "omen", life: 9, maxLife: 9 };
    const requested = entity.id === "player" ? mouse : entity;
    const center = limitedCastPoint(entity, requested, 300);
    const offsets = [{ x: 0, y: 0 }, { x: 88, y: 42 }, { x: -82, y: -48 }];
    for (const offset of offsets) {
      const point = nearestWalkablePoint({ x: center.x + offset.x, y: center.y + offset.y }, entity);
      game.shadowZones.push({
        x: point.x,
        y: point.y,
        r: 92,
        life: 9,
        maxLife: 9,
        ownerTeam: team,
        slowMultiplier: 0.48,
      });
    }
    addUltimateEffect("shadow-field", entity, "#7650b8", 9);
  }
  setMessage(`${agent.name} ativou a Ultimate!`);
  playSound("ability");
  return true;
}

function nearestPickup(entity, pickups) {
  return pickups
    .slice()
    .sort((a, b) => Math.hypot(entity.x - a.x, entity.y - a.y) - Math.hypot(entity.x - b.x, entity.y - b.y))[0] || null;
}

function completeOrbCollection(entity, orb) {
   setUltimatePoints(entity, getUltimatePoints(entity) + 1);
   entity.orbChannel = null;
   entity.orbAssignment = null;
   if (orb) orb.reservadaPor = null;
   game.ultOrbs = game.ultOrbs.filter((item) => item !== orb);
   game.ultimateEffects.push({ type: "orb-beam", x: orb.x, y: orb.y, color: "#bd67ff", life: 1.5, maxLife: 1.5, radius: 12 });
   spawnParticles(orb.x, orb.y, "#bd67ff", 28, 180);
 }

function updateOrbChannel(entity, orb, dt) {
   if (!orb || getUltimatePoints(entity) >= ULT_MAX_POINTS) {
     entity.orbChannel = null;
     return;
   }
   const playerHolding = entity.id === "player" && keys.has("f");
   const botHolding = entity.id !== "player" && entity.aiState === "seek-ult";
   const holding = playerHolding || botHolding;
   const previous = entity.orbChannel;
   const moved = entity.moving || (previous && Math.hypot(entity.x - previous.x, entity.y - previous.y) > 2.5);
   if (!holding || moved || Math.hypot(entity.x - orb.x, entity.y - orb.y) >= entity.r + 21) {
     entity.orbChannel = null;
     return;
   }
   if (!previous || previous.orbId !== orb.id) {
     entity.orbChannel = { orbId: orb.id, progress: 0, x: entity.x, y: entity.y };
     return;
   }
   previous.progress = Math.min(1, previous.progress + dt / ORB_CHANNEL_TIME);
   previous.x = entity.x;
   previous.y = entity.y;
   entity.moving = false;
   if (previous.progress >= 1) completeOrbCollection(entity, orb);
 }

function livingBotLikeEntities() {
  return [...game.allies, ...game.bots].filter((entity) => entity?.alive);
}

function orbReservationOwner(orb) {
  if (!orb?.reservadaPor) return null;
  return livingBotLikeEntities().find((entity) => entity.id === orb.reservadaPor) || null;
}

function releaseEntityOrbReservation(entity) {
  if (!entity?.orbAssignment) return;
  const reservedOrb = game.ultOrbs.find((orb) => orb.id === entity.orbAssignment);
  if (reservedOrb?.reservadaPor === entity.id) reservedOrb.reservadaPor = null;
  entity.orbAssignment = null;
  entity.orbChannel = null;
}

function updateOrbReservations() {
  const livingIds = new Set(livingBotLikeEntities().map((entity) => entity.id));
  for (const orb of game.ultOrbs) {
    if (orb.reservadaPor && (!livingIds.has(orb.reservadaPor) || game.spike.state === "planted")) {
      orb.reservadaPor = null;
    }
  }
  for (const entity of livingBotLikeEntities()) {
    const assignedOrb = game.ultOrbs.find((orb) => orb.id === entity.orbAssignment);
    if (!assignedOrb || assignedOrb.reservadaPor !== entity.id || entity.aiState !== "seek-ult" || game.spike.state === "planted") {
      if (assignedOrb?.reservadaPor === entity.id) assignedOrb.reservadaPor = null;
      entity.orbAssignment = null;
      entity.orbChannel = null;
    }
  }
}

function reserveOrbForEntity(entity, orb) {
  if (!entity || !orb) return false;
  const owner = orbReservationOwner(orb);
  if (owner && owner.id !== entity.id) return false;
  if (entity.orbAssignment && entity.orbAssignment !== orb.id) releaseEntityOrbReservation(entity);
  orb.reservadaPor = entity.id;
  entity.orbAssignment = orb.id;
  return true;
}

function collectPickups(entity, dt) {
   if (!entity?.alive) return;
   const medkit = game.medkits.find((item) => Math.hypot(entity.x - item.x, entity.y - item.y) < entity.r + 22);
   if (medkit && entity.hp < entity.maxHp) {
     entity.hp = Math.min(entity.maxHp, entity.hp + MEDKIT_HEAL);
     game.medkits = game.medkits.filter((item) => item !== medkit);
     spawnParticles(medkit.x, medkit.y, "#62e6a0", 30, 190);
     setMessage(`${entity.id === "player" ? "Med-Kit coletado" : "Bot coletou Med-Kit"}: +${MEDKIT_HEAL} HP.`);
   }
   const orb = game.ultOrbs.find((item) => Math.hypot(entity.x - item.x, entity.y - item.y) < entity.r + 21);
   if (orb && entity.id !== "player" && entity.orbAssignment !== orb.id) {
     entity.orbChannel = null;
     return;
   }
   updateOrbChannel(entity, orb, dt);
 }

function updatePickups(dt) {
   updateOrbReservations();
   collectPickups(game.player, dt);
   game.allies.forEach((ally) => collectPickups(ally, dt));
   game.bots.forEach((bot) => collectPickups(bot, dt));
 }

function plantOrDefuse(dt) {
  if (game.training) return;
  const p = game.player;
  if (game.phase !== "action") return;
  if (game.ultOrbs.some((orb) => Math.hypot(p.x - orb.x, p.y - orb.y) < p.r + 21)) return;

  if (game.playerSide === "defenders") {
    if (game.spike.state === "planted" && keys.has("f") && Math.hypot(p.x - game.spike.x, p.y - game.spike.y) < 46) {
      const complete = advanceDefuse("player", dt, currentPlayerDefuseTime());
      setMessage("Desarmando spike. Continue segurando F.");
      if (complete) {
        spawnParticles(game.spike.x, game.spike.y, "#66e48f", 28, 180);
        game.stats.defuses += 1;
        if (!game.sandbox) game.money += ECONOMY.objective;
        endRound("defenders", "Spike desarmada. Defensores venceram.", "defuse");
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
    if (!game.sandbox) game.money += ECONOMY.objective;
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
   const movementLocked = false;
   p.moving = !movementLocked && (dx !== 0 || dy !== 0);
  p.moveX = p.moving ? dx / len : 0;
  p.moveY = p.moving ? dy / len : 0;
  const ultimateSpeed = p.ultimate?.type === "neon" ? 1.28 : 1;
  const shadowSlow = shadowSlowMultiplier(p);
  if (!movementLocked) {
    moveEntity(p, (dx / len) * p.speed * ultimateSpeed * shadowSlow * dt, (dy / len) * p.speed * ultimateSpeed * shadowSlow * dt, map.walls);
  }
  p.angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  if (game.spike.state === "carried" && game.spike.owner === "player") {
    game.spike.x = p.x;
    game.spike.y = p.y;
  }

  if (mouse.down) shoot(p, mouse.x, mouse.y, game.selectedWeapon, "player");
  if (keys.has("r")) reload();
  if (pressed.has("e") && game.abilityCooldown <= 0 && game.phase === "action") {
    const used = game.selectedAgent.use(game);
    if (used !== false) {
      game.abilityCooldown = game.sandbox ? 0 : game.tutorial ? 2 : game.selectedAgent.cooldown;
      if (game.tutorial && game.tutorialStep === 4) {
        game.tutorialAbilityUsed = true;
        game.tutorialTimer = 0;
      }
      playSound("ability");
      setMessage(game.sandbox
        ? `${game.selectedAgent.ability} usada. Sandbox: habilidade sem recarga.`
        : `${game.selectedAgent.ability} usada. Recarga iniciada.`);
    }
  }
  if (pressed.has("q") && game.phase === "action") activateUltimate(p);
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
  return !solidWalls().some((wall) => circleRectCollides(probe, wall));
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
  return solidWalls().some((wall) => circleRectCollides(entity, wall))
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
    if (solidWalls().some((wall) => circleRectCollides(probe, wall))) return true;
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
    if (!solidWalls().some((wall) => circleRectCollides(probe, wall))) {
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
  if (solidWalls().some((wall) => circleRectCollides(probe, wall))) return false;
  bot.x = step.x;
  bot.y = step.y;
  bot.lastX = step.x;
  bot.lastY = step.y;
  bot.stuck = 0;
  bot.idleTimer = 0;
  return true;
}

function destructibleBlockingPath(bot, target) {
  const candidates = game.destructibles
    .filter((box) => lineIntersectsRect(bot.x, bot.y, target.x, target.y, box))
    .sort((a, b) => Math.hypot(bot.x - (a.x + a.w / 2), bot.y - (a.y + a.h / 2))
      - Math.hypot(bot.x - (b.x + b.w / 2), bot.y - (b.y + b.h / 2)));
  return candidates.find((box) => {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    return Math.hypot(bot.x - cx, bot.y - cy) < 210
      && !map.walls.some((wall) => lineIntersectsRect(bot.x, bot.y, cx, cy, wall));
  }) || null;
}

function attackBlockingDestructible(bot, target, dt) {
  const box = destructibleBlockingPath(bot, target);
  if (!box) return false;
  const aim = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
  bot.angle = Math.atan2(aim.y - bot.y, aim.x - bot.x);
  bot.aiState = "break-box";
  bot.moving = false;
  bot.fireTimer = Math.max(0, (bot.fireTimer || 0) - dt);
  if (bot.fireTimer <= 0) {
    const team = bot.id?.startsWith("ally-") ? "ally" : "bot";
    shoot(bot, aim.x, aim.y, bot.weapon || weapons[0], team);
    bot.fireTimer = (bot.weapon?.fireRate || 0.3) + 0.12;
  }
  return true;
}

function poisonAvoidanceTarget(entity, target) {
  const hostileClouds = game.smokes.filter((smoke) =>
    smoke.poison
    && smoke.ownerTeam !== entityTeam(entity)
    && pointLineDistance(smoke.x, smoke.y, entity.x, entity.y, target.x, target.y) < smoke.r + entity.r + 18
  );
  if (!hostileClouds.length) return target;

  const cloud = hostileClouds.sort((a, b) =>
    Math.hypot(entity.x - a.x, entity.y - a.y) - Math.hypot(entity.x - b.x, entity.y - b.y)
  )[0];
  const pathAngle = Math.atan2(target.y - entity.y, target.x - entity.x);
  const clearance = cloud.r + entity.r + 34;
  const candidates = [-1, 1].map((side) => ({
    x: cloud.x + Math.cos(pathAngle + side * Math.PI / 2) * clearance,
    y: cloud.y + Math.sin(pathAngle + side * Math.PI / 2) * clearance,
  })).map((point) => nearestWalkablePoint(point, entity))
    .filter((point) => Math.hypot(point.x - cloud.x, point.y - cloud.y) > cloud.r + entity.r + 8);

  if (!candidates.length) return target;
  return candidates.sort((a, b) =>
    Math.hypot(entity.x - a.x, entity.y - a.y) + Math.hypot(a.x - target.x, a.y - target.y)
    - Math.hypot(entity.x - b.x, entity.y - b.y) - Math.hypot(b.x - target.x, b.y - target.y)
  )[0];
}

function moveBotToward(bot, target, dt, speedScale = 1) {
  const poisonSafeTarget = poisonAvoidanceTarget(bot, target);
  if (attackBlockingDestructible(bot, poisonSafeTarget, dt)) return 0;
  const safeTarget = resolveBotTarget(bot, poisonSafeTarget);
  const angle = Math.atan2(safeTarget.y - bot.y, safeTarget.x - bot.x);
  bot.angle = angle;
  const ultimateSpeed = bot.ultimate?.type === "neon" ? 1.22 : 1;
  const shadowSlow = shadowSlowMultiplier(bot);
  const movedNow = moveEntity(bot, Math.cos(angle) * bot.speed * speedScale * ultimateSpeed * shadowSlow * dt, Math.sin(angle) * bot.speed * speedScale * ultimateSpeed * shadowSlow * dt, map.walls);
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
  return p.alive && hasCombatLineOfSight(bot, p) && Math.hypot(p.x - bot.x, p.y - bot.y) < 540;
}

function closestVisibleSquadTarget(bot) {
  return [game.player, ...game.allies]
    .filter((target) => canSeeTarget(bot, target, 560))
    .sort((a, b) => Math.hypot(a.x - bot.x, a.y - bot.y) - Math.hypot(b.x - bot.x, b.y - bot.y))[0] || null;
}

function canSeeTarget(bot, target, range = 540) {
  return target?.alive && hasCombatLineOfSight(bot, target) && Math.hypot(target.x - bot.x, target.y - bot.y) < range;
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

function updateBotAwareness(bot, visibleTarget, dt) {
  if (visibleTarget) {
    bot.shootGraceTimer = BOT_SHOOT_GRACE_TIME;
    if (bot.reactionTimer === undefined) {
      bot.reactionTimer = BOT_REACTION_TIME + Math.random() * 0.18;
    }
    if (bot.reactionTimer > 0) {
      bot.reactionTimer = Math.max(0, bot.reactionTimer - dt);
    }
    bot.canShoot = bot.reactionTimer <= 0;
    bot.lastKnownPlayer = { x: visibleTarget.x, y: visibleTarget.y };
    bot.memoryTimer = 3.2;
    bot.revealedTimer = 2.6;
    alertBotSquad(bot, bot.lastKnownPlayer);
  } else {
    bot.shootGraceTimer = Math.max(0, (bot.shootGraceTimer || 0) - dt);
    if (bot.shootGraceTimer <= 0) {
      bot.reactionTimer = BOT_REACTION_TIME;
      bot.canShoot = false;
    }
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

  if (target && bot.canShoot !== false) botShootAt(bot, target, dt, "bot", options.firePenalty || 1);
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
    endRound("defenders", "Atacantes eliminados antes do plant. Defensores venceram.", "elimination");
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
  const threat = closestVisibleSquadTarget(bot);
  bot.aiState = "defuse";
  if (threat && dist <= 62 && game.spike.defuserId !== bot.id) {
    bot.aiState = "fight";
    botFightPlayer(bot, dt, { strafe: true, state: "fight" });
    resetPartialDefuse();
    return true;
  }
  if (threat && game.spike.defuserId === bot.id) {
    botFightPlayer(bot, dt, { strafe: false, state: "defuse", firePenalty: 1.95 });
  }
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
    endRound("defenders", "Bot desarmou a spike. Defensores venceram.", "defuse");
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
      return nearestWalkablePoint({ x: game.player.x + side * 86, y: game.player.y + 58 }, ally);
    }
    const site = map.sites[game.botPlanSiteIndex % map.sites.length] || map.sites[0];
    return siteEntryPoints(site)[index % siteEntryPoints(site).length];
  }
  const site = map.sites[index % map.sites.length] || map.sites[0];
  const center = siteCenter(site);
  const holds = [
    { x: center.x - 92, y: center.y - 54 },
    { x: center.x + 92, y: center.y - 54 },
    { x: map.width * 0.5, y: map.height * 0.42 },
    { x: center.x, y: center.y + 86 },
  ];
  return nearestWalkablePoint(holds[index % holds.length], ally);
}

function closestAliveAllyTo(x, y) {
  return game.allies
    .filter((ally) => ally.alive)
    .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;
}

function seekCriticalMedkit(entity, dt, danger) {
  if (entity.hp > entity.maxHp * 0.32 || !game.medkits.length) return false;
  const medkit = nearestPickup(entity, game.medkits);
  if (!medkit) return false;
  entity.aiState = "seek-medkit";
  if (danger) botShootAt(entity, danger, dt, entityTeam(entity) === "player" ? "ally" : "bot", 1.35);
  moveBotToward(entity, medkit, dt, 1.18);
  return true;
}

function seekUltimateOrb(entity, dt) {
   if (game.spike.state === "planted" || getUltimatePoints(entity) >= ULT_MAX_POINTS || !game.ultOrbs.length) {
     releaseEntityOrbReservation(entity);
     return false;
   }
   updateOrbReservations();
   const currentOrb = game.ultOrbs.find((orb) => orb.id === entity.orbAssignment && orb.reservadaPor === entity.id);
   const targetOrb = currentOrb || game.ultOrbs
     .filter((orb) => !orb.reservadaPor)
     .sort((a, b) => Math.hypot(entity.x - a.x, entity.y - a.y) - Math.hypot(entity.x - b.x, entity.y - b.y))[0];
   if (!targetOrb || !reserveOrbForEntity(entity, targetOrb)) return false;
   entity.aiState = "seek-ult";
   if (Math.hypot(entity.x - targetOrb.x, entity.y - targetOrb.y) > entity.r + 22) {
     moveBotToward(entity, targetOrb, dt, 1.04);
   } else {
     entity.moving = false;
     entity.angle = Math.atan2(targetOrb.y - entity.y, targetOrb.x - entity.x);
   }
   return true;
 }

function maybeUseBotUltimate(bot, visibleTarget) {
  if (getUltimatePoints(bot) < ULT_MAX_POINTS || bot.ultimate) return false;
  const agentId = bot.agentId;
  const alliedSquad = entityTeam(bot) === "player" ? [game.player, ...game.allies] : game.bots;
  if (agentId === "sage") {
    if (alliedSquad.some((entity) => entity.alive && (entity.hp < 58 || entity.armor < (entity.maxArmor || 0) * 0.4))) {
      return activateUltimate(bot);
    }
    return false;
  }
  return visibleTarget ? activateUltimate(bot) : false;
}

function updateAllies(dt) {
  const squad = [game.player, ...game.allies];
  const playerNearSpike = game.player?.alive && Math.hypot(game.player.x - game.spike.x, game.player.y - game.spike.y) < 46;
  const playerActivelyDefusing = game.spike.defuserId === "player" || (playerNearSpike && keys.has("f"));
  const allyDefuser = game.playerSide === "defenders" && game.spike.state === "planted" && !playerActivelyDefusing
    ? closestAliveAllyTo(game.spike.x, game.spike.y)
    : null;
  game.allies.forEach((ally, index) => {
    if (!ally.alive) return;
    const enemy = closestVisibleEnemy(ally);
    // Hierarquia absoluta: sobreviver > objetivo da Spike > recursos opcionais.
    if (seekCriticalMedkit(ally, dt, enemy)) {
      keepSquadSpacing(ally, squad, dt);
      return;
    }
    if (ally === allyDefuser) {
      const dist = Math.hypot(ally.x - game.spike.x, ally.y - game.spike.y);
      ally.aiState = "defuse";
      if (enemy && dist > 46) botShootAt(ally, enemy, dt, "ally", 1.25);
      if (dist > 42) {
        moveBotToward(ally, game.spike, dt, 1.12);
      } else {
        ally.angle = Math.atan2(game.spike.y - ally.y, game.spike.x - ally.x);
        const complete = advanceDefuse(ally.id, dt, BOT_DEFUSE_TIME + 0.7);
        setMessage("Aliado desarmando a spike. Cubra a area.");
        if (complete) {
          spawnParticles(game.spike.x, game.spike.y, "#66e48f", 28, 180);
          game.stats.defuses += 1;
          endRound("defenders", "Aliado desarmou a spike. Defensores venceram.", "defuse");
        }
      }
      keepSquadSpacing(ally, squad, dt);
      return;
    }
    maybeUseBotUltimate(ally, enemy);
    if (game.spike.state !== "planted" && !enemy && seekUltimateOrb(ally, dt)) {
      keepSquadSpacing(ally, squad, dt);
      return;
    }
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
        ally.angle += dt * (0.35 + index * 0.08) * ally.strafe;
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
  const botPlantSite = map.sites[game.botPlanSiteIndex % map.sites.length] || map.sites[0];
  const botPlantTarget = siteCenter(botPlantSite);

  for (const bot of game.bots) {
    if (!bot.alive) continue;
    if (bot.tutorialStatic) {
      bot.moving = false;
      continue;
    }
    const seesPlayer = botCanSeePlayer(bot);
    const visibleTarget = closestVisibleSquadTarget(bot);
    updateBotAwareness(bot, visibleTarget, dt);

    // Hierarquia absoluta: sobreviver > objetivo da Spike > recursos opcionais.
    if (seekCriticalMedkit(bot, dt, visibleTarget)) {
      keepBotSpacing(bot, dt);
      continue;
    }

    maybeUseBotUltimate(bot, visibleTarget);
    if (game.spike.state !== "planted" && !visibleTarget && bot.memoryTimer <= 0 && seekUltimateOrb(bot, dt)) {
      keepBotSpacing(bot, dt);
      continue;
    }

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

function eliminateBot(bot, { playerCredit = false, weaponName = "Poison Cloud", headshot = false } = {}) {
   if (!bot.alive) return;
   bot.alive = false;
   if (game.training) bot.respawnTimer = 1.25 + Math.random() * 0.75;
   if (playerCredit) {
     game.stats.kills += 1;
     addKillFeedEntry(true, weaponName, headshot);
   }
   if (!game.sandbox) {
     game.money += playerCredit ? (headshot ? ECONOMY.headshot : ECONOMY.kill) : Math.floor(ECONOMY.kill * 0.5);
     if (!game.training) game.money = Math.min(game.money, ECONOMY.cap);
   }
   if (game.spike.defuserId === bot.id) resetPartialDefuse();
   if (bot.hasSpike) {
     bot.hasSpike = false;
     game.spike.state = "dropped";
     game.spike.owner = null;
     game.spike.x = bot.x;
     game.spike.y = bot.y;
     game.spike.plantProgress = 0;
     setMessage("Spike derrubada. Bots tentarão recuperar.");
   }
   releaseEntityOrbReservation(bot);
 }

function randomTrainingSpawn() {
  const margin = 70;
  const player = game.player || TRAINING_MAP.attackersSpawn;
  for (let attempt = 0; attempt < 24; attempt++) {
    const edge = Math.floor(Math.random() * 3);
    const point = edge === 0
      ? { x: margin + Math.random() * (map.width - margin * 2), y: margin }
      : edge === 1
        ? { x: margin, y: margin + Math.random() * (map.height * 0.58) }
        : { x: map.width - margin, y: margin + Math.random() * (map.height * 0.58) };
    if (Math.hypot(point.x - player.x, point.y - player.y) >= 360) return point;
  }
  return { x: map.width / 2, y: margin };
}

function createTrainingBot() {
  const bot = makeBot(randomTrainingSpawn(), game.trainingBotSequence++);
  bot.id = `training-bot-${game.trainingBotSequence}`;
  bot.hasSpike = false;
  bot.speed = 108 + Math.random() * 18;
  bot.respawnTimer = 0;
  sanitizeEntityPosition(bot);
  return bot;
}

function updateTrainingArena(dt) {
  if (!game.training || game.phase !== "action") return;
  for (let index = 0; index < game.bots.length; index++) {
    const bot = game.bots[index];
    if (bot.alive) continue;
    bot.respawnTimer = Math.max(0, (Number(bot.respawnTimer) || 0) - dt);
    if (bot.respawnTimer === 0) {
      game.bots[index] = createTrainingBot();
      setMessage("Treino: novo alvo entrou na arena.");
    }
  }
}

function updateBullets(dt) {
  for (const bullet of game.bullets) {
    const oldX = bullet.x;
    const oldY = bullet.y;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
    if (bullet.ultimateTrail) {
      game.neonTrails.push({ x1: oldX, y1: oldY, x2: bullet.x, y2: bullet.y, life: 1.15, maxLife: 1.15, color: "#5df6ff" });
    }

    const hitDestructible = game.destructibles.find((box) => lineIntersectsRect(oldX, oldY, bullet.x, bullet.y, box));
    if (hitDestructible) {
      hitDestructible.hp -= bullet.damage;
      spawnWallImpact(bullet.x, bullet.y, oldX, oldY);
      if (hitDestructible.hp <= 0) {
        spawnParticles(hitDestructible.x + hitDestructible.w / 2, hitDestructible.y + hitDestructible.h / 2, "#ffd166", 20, 210);
        game.destructibles = game.destructibles.filter((box) => box !== hitDestructible);
      }
      bullet.life = 0;
      continue;
    }

    if (map.walls.some((wall) => lineIntersectsRect(oldX, oldY, bullet.x, bullet.y, wall))) {
      spawnWallImpact(bullet.x, bullet.y, oldX, oldY);
      bullet.life = 0;
      continue;
    }

    if (bullet.team === "player" || bullet.team === "ally") {
      for (const bot of game.bots) {
        if (bullet.hitIds?.includes(bot.id)) continue;
        const region = bot.alive ? hitRegion(oldX, oldY, bullet.x, bullet.y, bot, 6) : null;
        if (region) {
          bullet.hitIds?.push(bot.id);
          const damage = damageForHit(bullet, bot, region);
          const actualDamage = applyDamage(bot, damage);
          if (bullet.team === "player") {
            game.stats.damage += Math.round(actualDamage);
            if (region === "head") game.stats.headshots += 1;
            spawnDamageNumber(bot, actualDamage, region === "head");
          }
          game.hitMarkers.push({ x: bot.x, y: bot.y - 28, life: 0.35, maxLife: 0.35, color: region === "head" ? "#ff4d5d" : "#ffd166" });
          spawnParticles(bullet.x, bullet.y, "#4fb3ff", 10, 130);
          playSound(region === "head" ? "headshot" : "hit");
          if (!bullet.ultimateTrail) bullet.life = 0;
          if (bot.hp <= 0) {
            eliminateBot(bot, {
              playerCredit: bullet.team === "player",
              weaponName: game.selectedWeapon.name,
              headshot: region === "head",
            });
          }
          if (!bullet.ultimateTrail) break;
        }
      }
    } else {
      const targets = [game.player, ...game.allies];
      for (const target of targets) {
        if (bullet.hitIds?.includes(target.id)) continue;
        const region = target.alive ? hitRegion(oldX, oldY, bullet.x, bullet.y, target, target.id === "player" ? 3 : 6) : null;
        if (!region) continue;
        bullet.hitIds?.push(target.id);
        const actualDamage = applyDamage(target, damageForHit(bullet, target, region));
        game.hitMarkers.push({ x: target.x, y: target.y - 30, life: 0.3, maxLife: 0.3, color: "#ff5b5b" });
        spawnParticles(bullet.x, bullet.y, "#ff4d5d", 8, 120);
        if (target.id === "player") {
          game.shake = Math.max(game.shake, region === "head" ? 0.34 : 0.24);
          game.damageFlash = Math.max(game.damageFlash, region === "head" ? 0.55 : 0.38);
          game.damageIndicator = {
            angle: Math.atan2(oldY - target.y, oldX - target.x),
            life: 0.72,
            maxLife: 0.72,
          };
        }
        if (!bullet.ultimateTrail) bullet.life = 0;
        if (target.hp <= 0) {
          target.alive = false;
          if (game.spike.defuserId === target.id) {
            resetPartialDefuse();
          }
          if (target.id === "player") {
            game.stats.deaths += 1;
            addKillFeedEntry(false, "", false);
            if (game.tutorial) {
              game.player.alive = true;
              game.player.hp = game.player.maxHp;
              setTutorialPhase(Math.min(game.tutorialStep, 2));
              break;
            }
            if (game.training) {
              game.player.alive = true;
              game.player.hp = game.player.maxHp;
              game.player.armor = game.player.maxArmor;
              game.player.x = map.attackersSpawn.x;
              game.player.y = map.attackersSpawn.y;
              break;
            }
            const winner = game.playerSide === "attackers" ? "defenders" : "attackers";
            endRound(winner, game.playerSide === "attackers"
              ? "Voce foi eliminado. Defensores venceram."
              : "Voce foi eliminado. Atacantes venceram.");
          }
        }
        if (!bullet.ultimateTrail) break;
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
      const playerCaught = game.player.alive
        && Math.hypot(game.player.x - game.spike.x, game.player.y - game.spike.y) <= 320;
      if (playerCaught) {
        game.player.hp = 0;
        game.player.alive = false;
        game.stats.deaths += 1;
      }
      endRound(
        "attackers",
        playerCaught
          ? "Você morreu na explosão da Spike. Punição econômica máxima."
          : "Spike detonou. Atacantes venceram.",
        playerCaught ? "spike_death" : "standard"
      );
    }
  }
}

function updateTimers(dt) {
  if (game.introTimer > 0) {
    game.introTimer = Math.max(0, game.introTimer - dt);
    if (game.introTimer === 0) {
      ui.introOverlay.classList.add("hidden");
      game.clockActive = true;
      if (game.phase === "buy" && !game.sandbox && !game.training) openShop();
    }
  }
  if (game.clockActive && !game.sandbox && !game.training) game.phaseTime -= dt;
  if (game.sandbox || game.training) game.money = 99999;
  game.recoilHeat = Math.max(0, game.recoilHeat - dt * (game.player?.moving ? 0.9 : 1.8));
  if (game.recoilHeat === 0) game.shotChain = 0;
  if (game.roundBannerTimer > 0) {
    game.roundBannerTimer = Math.max(0, game.roundBannerTimer - dt);
    if (game.roundBannerTimer === 0) ui.roundBanner.classList.add("hidden");
  }
  game.abilityCooldown = game.sandbox ? 0 : Math.max(0, game.abilityCooldown - dt);
  game.shake = Math.max(0, game.shake - dt);
  game.damageFlash = Math.max(0, game.damageFlash - dt * 1.9);
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
  for (const smoke of game.smokes) {
    smoke.life -= dt;
    if (smoke.targetR) smoke.r += (smoke.targetR - smoke.r) * Math.min(1, dt * 1.4);
    if (!smoke.poison) continue;
    smoke.tick = (smoke.tick || 0) - dt;
    const targets = smoke.ownerTeam === "bot" ? [game.player, ...game.allies] : game.bots;
    for (const target of targets) {
      if (!target.alive || Math.hypot(target.x - smoke.x, target.y - smoke.y) > smoke.r) continue;
      const damage = (smoke.damagePerSecond || 18) * dt;
      const actualDamage = applyDamage(target, damage);
      if (smoke.ownerTeam !== "bot") game.stats.damage += actualDamage;
      if (smoke.tick <= 0) {
        spawnDamageNumber(target, Math.max(1, Math.round((smoke.damagePerSecond || 18) * POISON_TICK_INTERVAL)), false);
        spawnParticles(target.x, target.y, "#54e36f", 4, 55);
      }
      if (target.hp <= 0) {
        if (target.id?.startsWith("bot-")) {
          eliminateBot(target, { playerCredit: smoke.ownerTeam !== "bot", weaponName: "Poison Cloud" });
        } else {
          target.alive = false;
          if (target.id === "player") {
            game.stats.deaths += 1;
            endRound(opposingSide(game.playerSide), "A névoa química eliminou você.");
          }
        }
      }
    }
    if (smoke.tick <= 0) smoke.tick = POISON_TICK_INTERVAL;
  }
  game.smokes = game.smokes.filter((s) => s.life > 0);
  for (const zone of game.shadowZones) zone.life -= dt;
  game.shadowZones = game.shadowZones.filter((zone) => zone.life > 0);
  for (const entity of [game.player, ...game.allies, ...game.bots]) {
    if (!entity?.ultimate) continue;
    if (!entity.alive) {
      entity.ultimate = null;
      continue;
    }
    entity.ultimate.life -= dt;
    if (entity.ultimate.life <= 0) entity.ultimate = null;
  }
  for (const effect of game.ultimateEffects) {
    effect.life -= dt;
    effect.radius += dt * (effect.type === "global-pulse" ? 360 : 72);
    const source = [game.player, ...game.allies, ...game.bots].find((entity) => entity?.id === effect.entityId);
    if (source) {
      effect.x = source.x;
      effect.y = source.y;
    }
  }
  game.ultimateEffects = game.ultimateEffects.filter((effect) => effect.life > 0);
  for (const trail of game.neonTrails) trail.life -= dt;
  game.neonTrails = game.neonTrails.filter((trail) => trail.life > 0);
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.88;
    particle.vy *= 0.88;
    particle.life -= dt;
  }
  game.particles = game.particles.filter((p) => p.life > 0);
  for (const ghost of game.dashGhosts) ghost.life -= dt;
  game.dashGhosts = game.dashGhosts.filter((ghost) => ghost.life > 0);
  for (const marker of game.hitMarkers) {
    marker.y -= 22 * dt;
    marker.life -= dt;
  }
  game.hitMarkers = game.hitMarkers.filter((marker) => marker.life > 0);
  for (const number of game.damageNumbers) {
    number.x += number.drift * dt;
    number.y += number.vy * dt;
    number.vy *= 0.92;
    number.life -= dt;
  }
  game.damageNumbers = game.damageNumbers.filter((number) => number.life > 0);
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
  if (game.tutorial) return;
  if (game.training) return;
  if (game.bots.every((bot) => !bot.alive)) {
    if (game.training || game.sandbox) {
      const botSpawns = game.playerSide === "attackers" ? map.defendersSpawn : map.attackerBotSpawns;
      game.bots = botSpawns.map(makeBot);
      game.bots.forEach(sanitizeEntityPosition);
      game.bullets = [];
      if (game.sandbox) {
        game.phase = "action";
        game.phaseTime = 9999;
        game.clockActive = true;
        game.roundOverTimer = 0;
        const carrier = game.bots.find((bot) => bot.hasSpike) || game.bots[0] || game.player;
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
        spawnRoundPickups();
      }
      setMessage(game.sandbox ? "Sandbox: nova equipe inimiga gerada." : "Treino: novos bots apareceram.");
      return;
    }
    if (game.playerSide === "defenders" && game.spike.state === "planted") {
      setMessage("Atacantes eliminados. Agora desarme a spike.");
      return;
    }
    endRound(game.playerSide, game.playerSide === "attackers"
      ? "Defensores eliminados. Atacantes venceram."
      : "Atacantes eliminados. Defensores venceram.", "elimination");
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
  if (game.introTimer > 0 || !game.clockActive) return;
  updateTutorial(dt);
  if (game.phase === "action") {
    updatePlayer(dt);
    updateAllies(dt);
    updateBots(dt);
    updateBullets(dt);
    updateTrainingArena(dt);
    updateSpike(dt);
    updatePickups(dt);
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

  for (const site of game.training ? [] : map.sites) {
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

  for (const box of game.destructibles) {
    const ratio = Math.max(0, box.hp / (box.maxHp || box.hp || 1));
    ctx.fillStyle = "#5f4930";
    ctx.strokeStyle = "#d8a657";
    ctx.lineWidth = 2;
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(box.x + 5, box.y + box.h - 9, box.w - 10, 4);
    ctx.fillStyle = ratio > 0.35 ? "#ffd166" : "#ff4d5d";
    ctx.fillRect(box.x + 5, box.y + box.h - 9, (box.w - 10) * ratio, 4);
  }

  const callouts = game.training ? [] : [
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
  if (entity.ultimate) {
    const pulse = 1 + Math.sin(performance.now() / 90) * 0.12;
    const auraColor = entity.ultimate.type === "neon" ? "#65f5ff"
      : entity.ultimate.type === "viper" ? "#35c46a"
        : entity.ultimate.type === "sage" ? "#62e6a0"
          : "#9a70dc";
    ctx.save();
    ctx.strokeStyle = auraColor;
    ctx.shadowColor = auraColor;
    ctx.shadowBlur = 22;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, (entity.r + 11) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
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
  if ((entity.revealedTimer || 0) > 0) {
    ctx.strokeStyle = "#5577ff";
    ctx.shadowColor = "#5577ff";
    ctx.shadowBlur = 20;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
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
    const startX = p.x + Math.cos(p.angle) * (p.r + 18);
    const startY = p.y + Math.sin(p.angle) * (p.r + 18);
    const dx = mouse.x - startX;
    const dy = mouse.y - startY;
    const len = Math.hypot(dx, dy) || 1;
    const rayX = startX + (dx / len) * 2400;
    const rayY = startY + (dy / len) * 2400;
    const aimEnd = firstWallPointOnLine(startX, startY, rayX, rayY);
    ctx.save();
    // linha do cano até a mira
    ctx.strokeStyle = "rgba(255, 209, 102, 0.55)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(aimEnd.x, aimEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
    if (aimEnd.x !== rayX || aimEnd.y !== rayY) {
      ctx.fillStyle = "rgba(255, 209, 102, 0.85)";
      ctx.beginPath();
      ctx.arc(aimEnd.x, aimEnd.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
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

function drawDamageNumbers() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const number of game.damageNumbers) {
    const ratio = Math.max(0, number.life / number.maxLife);
    const scale = 0.82 + (1 - ratio) * 0.28;
    ctx.globalAlpha = ratio;
    ctx.font = `${number.weight} ${number.size * scale}px Segoe UI`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.fillStyle = number.color;
    ctx.strokeText(number.text, number.x, number.y);
    ctx.fillText(number.text, number.x, number.y);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawDamageFlash() {
  if (game.damageFlash <= 0) return;
  const alpha = Math.min(0.42, game.damageFlash);
  const thickness = 92;
  ctx.save();
  ctx.globalAlpha = alpha;

  const top = ctx.createLinearGradient(0, 0, 0, thickness);
  top.addColorStop(0, "rgba(255, 40, 56, 0.95)");
  top.addColorStop(1, "rgba(255, 40, 56, 0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, canvas.width, thickness);

  const bottom = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - thickness);
  bottom.addColorStop(0, "rgba(255, 40, 56, 0.95)");
  bottom.addColorStop(1, "rgba(255, 40, 56, 0)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, canvas.height - thickness, canvas.width, thickness);

  const left = ctx.createLinearGradient(0, 0, thickness, 0);
  left.addColorStop(0, "rgba(255, 40, 56, 0.85)");
  left.addColorStop(1, "rgba(255, 40, 56, 0)");
  ctx.fillStyle = left;
  ctx.fillRect(0, 0, thickness, canvas.height);

  const right = ctx.createLinearGradient(canvas.width, 0, canvas.width - thickness, 0);
  right.addColorStop(0, "rgba(255, 40, 56, 0.85)");
  right.addColorStop(1, "rgba(255, 40, 56, 0)");
  ctx.fillStyle = right;
  ctx.fillRect(canvas.width - thickness, 0, thickness, canvas.height);

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
  const color = game.abilityCooldown <= 0 ? "#62e6a0" : "#46a8ff";
  ctx.fillStyle = color;
  ctx.fillRect(bx, by, bw * Math.min(1, cooldownRatio), bh);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "11px Segoe UI";
  ctx.textAlign = "center";
  const label = game.sandbox ? "E livre" : game.abilityCooldown > 0 ? `${Math.ceil(game.abilityCooldown)}s` : "E pronto";
  ctx.fillText(`${game.selectedAgent.ability} — ${label}`, canvas.width / 2, by - 4);
  ctx.textAlign = "left";
}

function drawWorldActionBar() {
  let actor = null;
  let progress = 0;
  let color = "#ffd166";

  if (game.spike.state === "planting") {
    actor = game.player;
    progress = game.spike.plantProgress;
  } else if (game.spike.state === "bot_planting") {
    actor = game.bots.find((bot) => bot.alive && bot.hasSpike);
    progress = game.spike.plantProgress;
  }

  if (!actor || !actor.alive || progress <= 0) return;
  const width = 62;
  const height = 6;
  const x = actor.x - width / 2;
  const y = actor.y + actor.r + 12;
  ctx.save();
  ctx.fillStyle = "rgba(3, 8, 12, 0.82)";
  ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * Math.max(0, Math.min(1, progress)), height);
  ctx.strokeStyle = "rgba(255,255,255,0.34)";
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
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

function drawMedkitsAndOrbs() {
  const now = performance.now() / 1000;
  for (const kit of game.medkits) {
    const floatY = Math.sin(now * 1.8 + kit.phase) * 4;
    const pulse = 0.7 + Math.sin(now * 1.4 + kit.phase) * 0.22;
    ctx.save();
    ctx.translate(kit.x, kit.y + floatY);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 16, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#303a40";
    ctx.strokeStyle = "#77838a";
    ctx.lineWidth = 2;
    ctx.fillRect(-23, -13, 46, 29);
    ctx.strokeRect(-23, -13, 46, 29);
    ctx.fillStyle = "#1b2226";
    ctx.fillRect(-9, -19, 18, 7);
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#62e6a0";
    ctx.shadowColor = "#62e6a0";
    ctx.shadowBlur = 18 * pulse;
    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();
    ctx.fillStyle = `rgba(98,230,160,${pulse})`;
    ctx.font = "bold 14px Segoe UI";
    ctx.fillText("+", -31, -14);
    ctx.fillText("+", 25, 5);
    ctx.restore();
  }
  for (const orb of game.ultOrbs) {
    const pulse = 1 + Math.sin(now * 1.5 + orb.phase) * 0.12;
    ctx.save();
    ctx.translate(orb.x, orb.y);
    ctx.strokeStyle = "rgba(189,103,255,0.5)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, 22 + i * 8 + Math.sin(now + i) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#000";
    ctx.shadowColor = "#bd67ff";
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(0, 0, 15 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d7a0ff";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }
}

function drawOrbChannelBars() {
  for (const entity of [game.player, ...game.allies, ...game.bots]) {
    const channel = entity?.orbChannel;
    if (!entity?.alive || !channel || channel.progress <= 0) continue;
    const width = 58;
    const height = 5;
    const x = entity.x - width / 2;
    const y = entity.y + entity.r + 12;
    ctx.save();
    ctx.fillStyle = "rgba(3, 5, 10, 0.88)";
    ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
    ctx.fillStyle = "#bd67ff";
    ctx.shadowColor = "#bd67ff";
    ctx.shadowBlur = 10;
    ctx.fillRect(x, y, width * Math.max(0, Math.min(1, channel.progress)), height);
    ctx.strokeStyle = "rgba(238,247,251,0.42)";
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }
}

function drawShadowBlindness() {
  if (!isBlindedByShadow(game.player)) return;
  const gradient = ctx.createRadialGradient(game.player.x, game.player.y, 38, game.player.x, game.player.y, 190);
  gradient.addColorStop(0, "rgba(12, 8, 20, 0.18)");
  gradient.addColorStop(0.45, "rgba(8, 5, 14, 0.72)");
  gradient.addColorStop(1, "rgba(2, 1, 5, 0.96)");
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawUltimateEffects() {
  for (const trail of game.neonTrails) {
    const alpha = Math.max(0, trail.life / trail.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = trail.color;
    ctx.shadowColor = trail.color;
    ctx.shadowBlur = 18;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(trail.x1, trail.y1);
    ctx.lineTo(trail.x2, trail.y2);
    ctx.stroke();
    ctx.restore();
  }
  for (const effect of game.ultimateEffects) {
    const alpha = Math.max(0, effect.life / effect.maxLife);
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha * 1.5);
    ctx.strokeStyle = effect.color;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 28;
    if (effect.type === "global-pulse") {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "healing-beam" || effect.type === "orb-beam") {
      ctx.fillStyle = effect.color;
      const width = effect.type === "healing-beam" ? 34 : 12;
      ctx.fillRect(effect.x - width / 2, 0, width, effect.y);
    } else {
      ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const angle = performance.now() / 260 + i * Math.PI * 2 / 3;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius + i * 12, angle, angle + Math.PI * 1.25);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
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
  if (game.tutorial) {
    ctx.fillStyle = game.tutorialStep === 2 ? "rgba(1, 6, 10, 0.48)" : "rgba(1, 6, 10, 0.28)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawMedkitsAndOrbs();

  for (const zone of game.shadowZones) {
    const alpha = Math.max(0, zone.life / zone.maxLife);
    const pulse = 0.92 + Math.sin(performance.now() / 180 + zone.x) * 0.06;
    ctx.save();
    ctx.globalAlpha = Math.min(0.82, alpha);
    ctx.fillStyle = "#130d22";
    ctx.shadowColor = "#7650b8";
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.ellipse(zone.x, zone.y, zone.r * pulse, zone.r * 0.68 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(154, 112, 220, 0.58)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  for (const smoke of game.smokes) {
    ctx.fillStyle = smoke.poison ? "rgba(47, 179, 78, 0.62)" : "rgba(82, 71, 115, 0.78)";
    ctx.beginPath();
    ctx.arc(smoke.x, smoke.y, smoke.r, 0, Math.PI * 2);
    ctx.fill();
    if (smoke.poison) {
      ctx.strokeStyle = "rgba(121, 255, 139, 0.82)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  drawSpike();
  if (!game.tutorial || game.tutorialStep === 2) drawObjectiveHints();

  for (const ghost of game.dashGhosts) {
    const alpha = Math.max(0, ghost.life / ghost.maxLife) * 0.34;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, ghost.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

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
  drawWorldActionBar();
  drawOrbChannelBars();
  drawUltimateEffects();

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
  drawDamageNumbers();

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
  if (!game.tutorial) {
    drawAbilityBar();
    drawSpikeHint();
    drawRadar();
  }
  if (!game.tutorial || game.tutorialStep > 0) drawCrosshair();
  drawDamageFlash();
  drawShadowBlindness();
  ctx.restore();
}

function updateUi() {
  const setText = (element, value) => {
    if (element) element.textContent = value;
  };
  const setClassName = (element, value) => {
    if (element) element.className = value;
  };
  const toggleClass = (element, className, force) => {
    if (element?.classList) element.classList.toggle(className, force);
  };
  const setStyle = (element, property, value) => {
    if (element?.style) element.style[property] = value;
  };
  if (!game.player) return;

  // Side pill
  const atk = game.playerSide === "attackers";
  setText(ui.sidePill, atk ? "ATK" : "DEF");
  setClassName(ui.sidePill, "hud-pill side-pill " + (atk ? "atk" : "def"));

  // Timer com urgência
  const t = Math.max(0, Math.ceil(game.phaseTime));
  const spikePlanted = game.spike.state === "planted";
  toggleClass(ui.topHud, "spike-planted", spikePlanted);
  toggleClass(ui.timerPill, "spike-alert", spikePlanted);
  setClassName(ui.timer, spikePlanted || (t <= 5 && game.phase !== "action") ? "urgent" : t <= 10 && game.phase !== "action" ? "warn" : "");

  // Buy bar
  updateBuyBar();

  // Agent dot cor
  setStyle(ui.agentDot, "background", game.selectedAgent.color);

  // Armor bar separada
  const hasArmor = (game.player?.maxArmor || 0) > 0;
  toggleClass(ui.armorBarWrap, "hidden", !hasArmor);
  toggleClass(ui.armorText, "hidden", !hasArmor);
  if (hasArmor) {
    const armorRatio = Math.max(0, game.player.armor) / game.player.maxArmor;
    setStyle(ui.armorBar, "transform", `scaleX(${armorRatio})`);
    setText(ui.armorValueText, Math.ceil(game.player.armor));
  }

  setText(ui.phase, game.paused
    ? "Pause"
    : game.phase === "buy"
        ? "Compra"
        : game.phase === "action"
          ? "Round"
          : game.phase === "matchOver"
            ? "Partida"
            : "Fim");
  const timerLabel = game.spike.state === "planted"
    ? `Spike ${Math.max(0, Math.ceil(game.spike.timer))}`
    : game.sandbox || game.training ? "∞" : t.toString();
  setText(ui.timer, timerLabel);
  setText(ui.score, `${game.playerScore} - ${game.enemyScore}`);

  // Money com delta
  const newMoney = game.money;
  if (newMoney !== lastMoney) flashMoneyDelta(newMoney);
  setText(ui.money, `${newMoney}`);

  setText(ui.agent, `${game.selectedAgent.name} ${atk ? "ATK" : "DEF"} · ${game.sandbox ? "E livre" : game.abilityCooldown > 0 ? `${Math.ceil(game.abilityCooldown)}s` : "E"}`);
  setText(ui.weapon, game.selectedWeapon.name);
  setText(ui.hp, `${Math.max(0, Math.ceil(game.player.hp))}`);
  setText(ui.ultPoints, game.sandbox ? "∞" : `${game.player.ultPoints}/${ULT_MAX_POINTS}`);
  toggleClass(ui.ultCounter, "ready", game.player.ultPoints >= ULT_MAX_POINTS);
  setText(ui.ammo, game.reloadTimer > 0 ? "Recarregando" : `${game.player.ammo}`);
  setText(ui.spike, game.spike.state === "carried"
    ? game.spike.owner === "player" ? "Com você" : "Em transporte"
    : game.spike.state === "dropped"
      ? "Derrubada"
    : game.spike.state === "planted"
      ? (game.spike.defuseProgress > 0 ? `Defuse ${Math.round(game.spike.defuseProgress * 100)}%` : `${Math.ceil(game.spike.timer)}s`)
      : "Plantando");
  toggleClass(ui.spike, "planted", spikePlanted);
  setStyle(ui.hpBar, "transform", `scaleX(${Math.max(0, game.player.hp) / game.player.maxHp})`);
  setStyle(ui.ammoBar, "transform", `scaleX(${game.reloadTimer > 0 ? 1 - game.reloadTimer / currentReloadTime() : game.player.ammo / currentMagSize()})`);
  setText(ui.message?.querySelector?.("strong"), game.message);
  setText(ui.message?.querySelector?.("span"), game.paused
    ? (game.menuState === "pause" ? "Jogo pausado. Aperte Esc ou P para continuar." : "Escolha uma opção no menu.")
    : game.playerSide === "attackers"
      ? "WASD move, E habilidade, Q Ultimate, F planta, B loja, Esc pause."
      : "WASD move, E habilidade, Q Ultimate, F desarma, B loja, Esc pause.");
  toggleClass(ui.sandboxTools, "hidden", !game.sandbox || game.menuState !== "none");
  setText(ui.godModeButton, `God: ${game.godMode ? "ON" : "OFF"}`);
  updateScoreboard();
  const gameplayHudVisible = game.menuState === "none" && ["buy", "action", "ended"].includes(game.phase);
  const tutorialActive = game.tutorial && game.menuState === "none";
  toggleClass(ui.topHud, "hidden", !gameplayHudVisible || tutorialActive);
  toggleClass(ui.message, "hidden", !gameplayHudVisible || tutorialActive);
  const gameWrap = document.querySelector(".game-wrap");
  gameWrap?.classList.toggle("gameplay-ui-hidden", !gameplayHudVisible);
  gameWrap?.classList.toggle("tutorial-mode", tutorialActive);
  if (gameWrap) gameWrap.dataset.tutorialStep = tutorialActive ? String(game.tutorialStep) : "";
}

function togglePause() {
  if (game.phase === "matchOver") return;
  if (game.menuState === "pause") {
    resumeFromPause();
    return;
  }
  if (game.menuState === "agent") {
    returnFromAgentSelect();
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
  const hasAllies = game.allyCount > 0 || game.sandbox || game.training;
  const nextTab = !hasAllies && tab === "allies" ? "weapons" : tab;
  const alliesTab = document.getElementById("alliesTab");
  alliesTab?.classList.toggle("hidden", !hasAllies);
  game.shopTab = tab;
  document.querySelectorAll("[data-shop-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.shopPanel !== nextTab);
  });
  if (ui.shopTabs) {
    ui.shopTabs.querySelectorAll("[data-shop-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.shopTab === nextTab);
    });
  }
  game.shopTab = nextTab;
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
  if (game.menuState === "agent") {
    returnFromAgentSelect();
    return;
  }
  if (game.menuState !== "none") return;
  if (!ui.shop.classList.contains("hidden")) {
    closeShop();
    updateUi();
    return;
  }
  if (!canOpenPauseMenu()) return;
  showPauseMenu();
}

function canOpenPauseMenu() {
  return game.menuState === "none"
    && ["buy", "action"].includes(game.phase)
    && !game.introTimer;
}

function setMenu(title, text, buttons, kicker = "Valorant2D", state = "menu") {
  hidePauseOverlay();
  if (ui.menuKicker) ui.menuKicker.textContent = kicker;
  if (ui.menuTitle) ui.menuTitle.textContent = title;
  if (ui.menuText) ui.menuText.textContent = "";
  if (!ui.menuButtons) return;
  ui.menuButtons.innerHTML = "";
  buttons.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "menu-button";
    button.style.setProperty("--menu-index", index);
    const isBack = item.back || item.label.toLowerCase().includes("voltar");
    if (isBack) {
      button.classList.add("menu-back", "icon-only");
      button.setAttribute("aria-label", item.label);
      button.title = item.label;
      button.innerHTML = "";
    } else if (state === "main") {
      button.innerHTML = `<span class="menu-icon menu-icon-${item.icon || "star"}" aria-hidden="true"></span><b>${item.label}</b>`;
    } else if (state === "difficulty") {
      const stars = Math.max(1, item.stars || 1);
      button.classList.add("difficulty-button", `difficulty-button-${stars}`);
      button.setAttribute("aria-label", item.label);
      button.title = item.label;
      button.innerHTML = `<span class="difficulty-glyph" aria-hidden="true"></span><b>${item.label}</b>`;
    } else {
      button.innerHTML = `<b>${item.label}</b>`;
    }
    attachButtonFeedback(button);
    button.addEventListener("click", item.action);
    ui.menuButtons.appendChild(button);
  });
  ui.menuOverlay.className = `menu-overlay menu-state-${state}`;
  ui.menuOverlay?.classList.remove("hidden");
  game.paused = true;
  game.menuState = state;
}

function attachButtonFeedback(button) {
  if (!button || button.dataset.feedbackReady) return;
  button.dataset.feedbackReady = "true";
  button.addEventListener("pointerdown", () => {
    button.classList.remove("click-feedback");
    void button.offsetWidth;
    button.classList.add("click-feedback");
  });
  button.addEventListener("animationend", (event) => {
    if (event.animationName === "buttonShockwave") button.classList.remove("click-feedback");
  });
}

function hideMenuOverlay() {
  ui.menuOverlay.classList.add("hidden");
  game.menuState = "none";
}

function hidePauseOverlay() {
  if (ui.pauseOverlay?.contains(document.activeElement)) document.activeElement.blur();
  ui.pauseOverlay?.classList.remove("is-open");
  ui.pauseOverlay?.setAttribute("aria-hidden", "true");
}

function hideAgentSelect() {
  ui.agentOverlay.classList.add("hidden");
  game.menuState = "none";
}

function returnFromAgentSelect() {
  ui.agentOverlay?.classList.add("hidden");
  game.paused = true;
  if (game.agentReturnState === "difficulty") {
    showDifficultyMenu(true);
  } else {
    showMainMenu();
  }
}

function agentPresentation(agent) {
  const details = {
    neon: {
      className: "Duelista",
      tagline: "Velocidade e avanço agressivo",
      ultimate: "Sobrecarga Cinética",
      icon: "assets/images/Neon_icon.webp",
      artwork: "assets/images/Neon_Artwork_Full.webp",
    },
    viper: {
      className: "Controladora",
      tagline: "Domínio territorial com toxinas",
      ultimate: "Poço Químico",
      icon: "assets/images/Viper_icon.webp",
      artwork: "assets/images/Viper_Artwork_Full.webp",
    },
    sage: {
      className: "Sentinela",
      tagline: "Sustentação e recuperação da equipe",
      ultimate: "Restauração Total",
      icon: "assets/images/Sage_icon.webp",
      artwork: "assets/images/Sage_Artwork_Full.webp",
    },
    omen: {
      className: "Controlador",
      tagline: "Cegueira e redução de mobilidade",
      ultimate: "Domínio das Sombras",
      icon: "assets/images/Omen_icon.webp",
      artwork: "assets/images/Omen_Artwork_Full.webp",
    },
  };
  return details[agent.id] || {
    className: agent.role,
    tagline: agent.ability,
    ultimate: "Ultimate",
    icon: "",
    artwork: "",
  };
}

function showAgentSelect(onPick, returnState = "main") {
  closeShop();
  game.agentReturnState = returnState;
  const selector = ui.agentSelectGrid.parentElement;
  selector.querySelector(".agent-preview")?.remove();
  ui.agentSelectGrid.innerHTML = "";
  ui.agentSelectGrid.classList.remove("has-selection");

  const preview = document.createElement("section");
  preview.className = "agent-preview";
  preview.setAttribute("aria-live", "polite");
  preview.innerHTML = `
     <div class="agent-preview-art"><img alt=""></div>
     <div class="agent-preview-copy">
       <span class="agent-class"></span>
       <h3></h3>
       <p></p>
       <div class="agent-abilities">
         <div class="ability-chip ability-chip-basic agent-preview-ability">
           <i>E</i><span><small>Habilidade</small><b></b><span class="agent-ability-cooldown"></span></span>
         </div>
         <div class="ability-chip ability-chip-ultimate agent-preview-ability">
           <i>Q</i><span><small>Ultimate</small><b></b></span>
         </div>
       </div>
       <button type="button" class="agent-confirm" disabled>Confirmar agente</button>
     </div>`;
  selector.appendChild(preview);

  const confirmButton = preview.querySelector(".agent-confirm");
  let selectedAgent = null;
  let agenteTravado = false;

  const renderPreview = (agent) => {
     const presentation = agentPresentation(agent);
     preview.style.setProperty("--agent-color", agent.color);
     preview.dataset.agent = agent.id;
     const previewImage = preview.querySelector(".agent-preview-art img");
     previewImage.src = presentation.artwork;
     previewImage.alt = `Arte da agente ${agent.name}`;
     preview.querySelector(".agent-class").textContent = presentation.className;
     preview.querySelector("h3").textContent = agent.name;
     preview.querySelector("p").textContent = presentation.tagline;
     preview.querySelector(".ability-chip-basic b").textContent = agent.ability;
     const cooldownEl = preview.querySelector(".agent-ability-cooldown");
     if (cooldownEl) cooldownEl.textContent = `(${agent.cooldown}s recarga)`;
     preview.querySelector(".ability-chip-ultimate b").textContent = presentation.ultimate;
  };

  const confirmSelection = () => {
    if (!selectedAgent) return;
    game.selectedAgent = selectedAgent;
    game.agentLocked = true;
    hideAgentSelect();
    game.paused = false;
    onPick();
    updateUi();
  };

  attachButtonFeedback(confirmButton);
  confirmButton.addEventListener("click", confirmSelection);

  for (const agent of agents) {
    const presentation = agentPresentation(agent);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "agent-card";
    button.style.setProperty("--agent-color", agent.color);
    button.innerHTML = `
      <span class="agent-card-portrait"><img src="${presentation.icon}" alt="Retrato de ${agent.name}"></span>
      <span class="agent-card-copy"><b>${agent.name}</b><small>${presentation.className}</small></span>`;
    attachButtonFeedback(button);
    button.addEventListener("mouseenter", () => {
      if (!agenteTravado) renderPreview(agent);
    });
    button.addEventListener("focus", () => {
      if (!agenteTravado) renderPreview(agent);
    });
    button.addEventListener("click", () => {
      agenteTravado = true;
      selectedAgent = agent;
      renderPreview(agent);
      ui.agentSelectGrid.classList.add("has-selection");
      for (const card of ui.agentSelectGrid.querySelectorAll(".agent-card")) {
        card.classList.toggle("selected", card === button);
      }
      confirmButton.disabled = false;
      confirmButton.textContent = `Confirmar ${agent.name}`;
    });
    button.addEventListener("dblclick", confirmSelection);
    ui.agentSelectGrid.appendChild(button);
  }
  renderPreview(game.selectedAgent || agents[0]);
  ui.agentOverlay.classList.remove("hidden");
  game.paused = true;
  game.menuState = "agent";
}

function resumeFromPause() {
  hidePauseOverlay();
  hideMenuOverlay();
  if (game.pauseReturnState === "agent") {
    game.pauseReturnState = null;
    ui.agentOverlay.classList.remove("hidden");
    game.menuState = "agent";
    game.paused = true;
    updateUi();
    return;
  }
  game.paused = false;
  setMessage("Jogo retomado.");
  updateUi();
}

function showPauseMenu(returnState = null) {
  if (returnState === "agent" || !canOpenPauseMenu()) return;
  closeShop();
  game.pauseReturnState = returnState;
  ui.menuOverlay?.classList.add("hidden");
  ui.pauseOverlay?.classList.add("is-open");
  ui.pauseOverlay?.setAttribute("aria-hidden", "false");
  game.menuState = "pause";
  game.paused = true;
  setMessage("Jogo pausado.");
  updateUi();
}

function restartCurrentMatch() {
  hidePauseOverlay();
  ui.matchOverlay?.classList.add("hidden");
  game.pauseReturnState = null;
  game.paused = false;
  game.menuState = "none";
  if (game.training) {
    startTrainingMode();
  } else if (game.sandbox) {
    startSandboxMode();
  } else {
    startNewMatch();
  }
  updateUi();
}

function openPauseOptions() {
  hidePauseOverlay();
  showOptionsMenu();
}

function quitToMainMenu() {
  hidePauseOverlay();
  showMainMenu();
}

function showMainMenu() {
  hidePauseOverlay();
  ui.introOverlay?.classList.add("hidden");
  ui.matchOverlay?.classList.add("hidden");
  ui.agentOverlay?.classList.add("hidden");
  ui.tutorialOverlay?.classList.add("hidden");
  closeShop();
  game.tutorial = false;
  game.tutorialStage = "idle";
  game.phase = "idle";
  game.clockActive = false;
  game.paused = false;
  game.menuMapTimer = 0;
  game.pauseReturnState = null;
  fullReset();
  setMenu("Valorant 2D", "", [
    { label: "JOGAR", icon: "gamepad", action: showDifficultyMenu },
    { label: "OPÇÕES", icon: "tools", action: showOptionsMenu },
    { label: "SANDBOX", icon: "money", action: startSandboxMode },
    { label: "TREINO", icon: "star", action: startTrainingMode },
    { label: "TUTORIAL", icon: "link", action: startTutorialMode },
  ], "MENU", "main");
}

function showDifficultyMenu(immediate = false) {
  if (!immediate && game.menuState === "main") {
    ui.menuOverlay?.classList.add("menu-carousel-out");
    setTimeout(() => {
      ui.menuOverlay?.classList.remove("menu-carousel-out");
      showDifficultyMenu(true);
    }, 220);
    return;
  }
  setMenu("Dificuldade", "", [
    { label: "FÁCIL", stars: 1, action: () => startMode("Fácil", "easy") },
    { label: "MÉDIO", stars: 2, action: () => startMode("Médio", "normal") },
    { label: "DIFÍCIL", stars: 3, action: () => startMode("Difícil", "hard") },
    { label: "VOLTAR", back: true, action: showMainMenu },
  ], "JOGAR", "difficulty");
}

function showOptionsMenu() {
  setMenu("Opções", "", [
    { label: `Mira: ${game.crosshairStyle === "default" ? "Padrao" : "Minimalista"}`, icon: "tools", action: () => { game.crosshairStyle = game.crosshairStyle === "default" ? "minimal" : "default"; showOptionsMenu(); } },
    { label: `Tamanho mira: ${Math.round(game.crosshairScale * 100)}%`, icon: "star", action: () => { game.crosshairScale = game.crosshairScale >= 1.25 ? 0.85 : game.crosshairScale + 0.2; showOptionsMenu(); } },
    { label: `Movimento: ${game.arrowKeys ? "WASD + setinhas" : "WASD"}`, icon: "gamepad", action: () => { game.arrowKeys = !game.arrowKeys; showOptionsMenu(); } },
    { label: `Rotas: ${game.debugRoutes ? "visiveis" : "ocultas"}`, icon: "link", action: () => { game.debugRoutes = !game.debugRoutes; showOptionsMenu(); } },
    { label: `Som: ${audio.enabled ? "ligado" : "desligado"}`, icon: "tools", action: () => { audio.enabled = !audio.enabled; showOptionsMenu(); } },
    { label: `Volume: ${Math.round(audio.volume * 100)}%`, icon: "star", action: () => { audio.volume = audio.volume >= 1 ? 0.35 : audio.volume + 0.325; showOptionsMenu(); } },
    { label: "TELA CHEIA", icon: "gamepad", action: () => { if (document.fullscreenElement) document.exitFullscreen?.(); else document.querySelector(".game-wrap")?.requestFullscreen?.(); showOptionsMenu(); } },
    { label: "VOLTAR", back: true, action: showMainMenu },
  ], "OPÇÕES", "options");
}

function applyDifficulty(difficulty) {
  game.difficulty = difficulty;
  game.sandbox = false;
  game.godMode = false;
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
  ui.menuOverlay?.classList.add("menu-carousel-out");
  setTimeout(() => {
    ui.menuOverlay?.classList.remove("menu-carousel-out");
    hideMenuOverlay();
    showAgentSelect(startNewMatch, "difficulty");
  }, 220);
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
  showAgentSelect(() => {
    startNewMatch();
    startActionRound();
    game.phaseTime = 9999;
    setMessage("Sandbox: use o painel para spawnar bots, resetar spike, ativar God ou limpar o mapa.");
  }, "main");
}

function startTrainingMode() {
  game.mode = "Treino";
  game.difficulty = "training";
  game.sandbox = false;
  game.training = true;
  game.tutorial = false;
  game.godMode = true;
  game.trainingBotSequence = 0;
  game.allyCount = 0;
  game.enemyFireMultiplier = 2.4;
  hideMenuOverlay();
  showAgentSelect(() => {
    startNewMatch();
    game.money = 99999;
    startActionRound();
    game.phaseTime = 9999;
    game.destructibles = [];
    game.medkits = [];
    game.ultOrbs = [];
    game.spike.state = "disabled";
    game.spike.owner = null;
    game.bots = Array.from({ length: 3 }, () => createTrainingBot());
    setMessage("Treino livre: arena aberta e alvos com respawn infinito.");
  }, "main");
}

function startTutorialMode() {
  game.mode = "Tutorial";
  game.difficulty = "tutorial";
  game.sandbox = false;
  game.training = false;
  game.tutorial = true;
  game.tutorialStep = 0;
  game.tutorialStage = "movement";
  game.tutorialTimer = 0;
  game.tutorialAbilityUsed = false;
  game.tutorialFreeUlts = 0;
  game.tutorialUltUses = 0;
  game.tutorialTransitioning = false;
  game.allyCount = 0;
  game.enemyFireMultiplier = 2.2;
  hideMenuOverlay();
  game.selectedAgent = agents[0];
  startNewMatch();
  game.startingSide = "attackers";
  game.playerSide = "attackers";
  game.roundNumber = 1;
  resetRound();
  startActionRound();
  game.phaseTime = 9999;
  game.introTimer = 0;
  game.clockActive = true;
  game.paused = false;
  ui.introOverlay?.classList.add("hidden");
  closeShop();
  setTutorialPhase(0);
}

function showIntro() {
  ui.introMode.textContent = game.mode;
  ui.introMap.textContent = game.mapName;
  ui.introTeam.textContent = `${game.playerSide === "attackers" ? "Ataque" : "Defesa"} - ${map.vibe}`;
  ui.introOverlay.classList.remove("hidden");
  game.introTimer = 5;
  game.clockActive = false;
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
  if (!el) return;
  el.className = "money-delta " + (diff > 0 ? "pos" : "neg");
  el.textContent = (diff > 0 ? "+" : "") + "$" + diff;
  void el.offsetWidth;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "";
}

function updateBuyBar() {
  if (game.phase === "buy" && !game.sandbox && !game.training) {
    if (ui.buyBar?.classList) ui.buyBar.classList.remove("hidden");
    const ratio = Math.max(0, game.phaseTime / BUY_TIME);
    if (ui.buyBarFill?.style) ui.buyBarFill.style.transform = `scaleX(${ratio})`;
  } else {
    if (ui.buyBar?.classList) ui.buyBar.classList.add("hidden");
  }
}

function buildShop() {
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
  const hasAllies = game.allyCount > 0 || game.sandbox || game.training;
  const alliesTab = document.getElementById("alliesTab");
  const alliesPanel = document.querySelector('[data-shop-panel="allies"]');
  alliesTab?.classList.toggle("hidden", !hasAllies);
  alliesPanel?.classList.toggle("disabled", !hasAllies);
  if (!hasAllies && game.shopTab === "allies") game.shopTab = "weapons";
  setShopTab(game.shopTab);
  [...(ui.weaponButtons?.children || [])].forEach((button, i) => {
    const weapon = weapons[i];
    if (!weapon) return;
    const owned = game.ownedWeapons.has(weapon.id);
    button.classList.toggle("active", weapon === game.selectedWeapon);
    button.classList.toggle("owned", owned);
    const status = button.querySelector("em");
    if (status) status.textContent = weapon === game.selectedWeapon ? "Equipada" : owned ? "Comprada" : `$${weapon.price}`;
  });
  [...(ui.equipmentButtons?.children || [])].forEach((button, i) => button.classList.toggle("active", equipmentOwned(equipment[i])));
  [...(ui.allyButtons?.children || [])].forEach((button, i) => {
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
  const tutorialSlowMotion = game.tutorial
    && game.tutorialStage === "defend"
    && game.tutorialSlowTimer > 0;
  update(dt * (tutorialSlowMotion ? 0.2 : 1));
  draw();
  updateUi();
  pressed.clear();
  requestAnimationFrame(loop);
}
loop.last = performance.now();

// Ouvintes de eventos com checagem de seguranca contra valores nulos.
if (window) window.addEventListener("keydown", (event) => {
  initAudio();
  if (event.key === "Tab" && game.menuState === "none" && ["buy", "action", "ended"].includes(game.phase) && ui.shop?.classList?.contains("hidden")) {
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
  if (!event.repeat && event.key.toLowerCase() === "b" && game.menuState === "none") {
    toggleShop();
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

if (window) window.addEventListener("keyup", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    game.scoreboardVisible = false;
    updateUi();
    return;
  }
  keys.delete(event.key.toLowerCase());
});

if (canvas) canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

if (canvas) canvas.addEventListener("contextmenu", (event) => event.preventDefault());

if (canvas) canvas.addEventListener("mousedown", (event) => {
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

if (window) window.addEventListener("mouseup", () => {
  mouse.down = false;
});

if (ui.shopBackdrop) ui.shopBackdrop.addEventListener("click", () => { closeShop(); updateUi(); });

if (ui.shopTabs && typeof ui.shopTabs.querySelectorAll === "function") {
  ui.shopTabs.querySelectorAll("[data-shop-tab]").forEach((button) => {
    if (button) button.addEventListener("click", () => setShopTab(button.dataset.shopTab));
  });
}

if (ui.spawnBotButton) ui.spawnBotButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  const bot = makeBot({ x: mouse.x || map.width / 2, y: mouse.y || map.height / 2 }, game.bots.length);
  bot.hasSpike = false;
  sanitizeEntityPosition(bot);
  game.bots.push(bot);
  setMessage("Sandbox: inimigo criado.");
});

if (ui.spawnAllyButton) ui.spawnAllyButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  const ally = makeAlly({ x: mouse.x || map.width / 2, y: mouse.y || map.height / 2 }, game.allies.length);
  sanitizeEntityPosition(ally);
  game.allies.push(ally);
  setMessage("Sandbox: aliado criado.");
});

if (ui.resetSpikeButton) ui.resetSpikeButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  game.spike = {
    state: "dropped",
    owner: null,
    x: game.player.x + Math.cos(game.player.angle) * 34,
    y: game.player.y + Math.sin(game.player.angle) * 34,
    timer: 0,
    site: null,
    plantProgress: 0,
    defuseProgress: 0,
    defuseCheckpoint: 0,
    defuserId: null,
  };
  setMessage("Sandbox: spike reposicionada.");
});

if (ui.godModeButton) ui.godModeButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  game.godMode = !game.godMode;
  setMessage(`Sandbox: God Mode ${game.godMode ? "ligado" : "desligado"}.`);
});

if (ui.clearSandboxButton) ui.clearSandboxButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  game.bots = [];
  game.allies = [];
  game.destructibles = [];
  setMessage("Sandbox: mapa limpo.");
});

if (ui.newGameButton) ui.newGameButton.addEventListener("click", () => {
  ui.matchOverlay?.classList.add("hidden");
  showMainMenu();
});

if (ui.pauseResumeButton) ui.pauseResumeButton.addEventListener("click", resumeFromPause);
if (ui.pauseOptionsButton) ui.pauseOptionsButton.addEventListener("click", openPauseOptions);
if (ui.pauseRestartButton) ui.pauseRestartButton.addEventListener("click", restartCurrentMatch);
if (ui.pauseQuitButton) ui.pauseQuitButton.addEventListener("click", quitToMainMenu);

buildShop();
setShopTab(game.shopTab);
game.menuMapTimer = 0;
startNewMatch();
showMainMenu();
requestAnimationFrame(loop);
