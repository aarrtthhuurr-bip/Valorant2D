const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

const ui = {
  gameRoot: document.getElementById("game-root"),
  gameViewport: document.getElementById("game-viewport"),
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
  weaponCategoryTabs: document.getElementById("weaponCategoryTabs"),
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
  matchConfetti: document.getElementById("matchConfetti"),
  matchMvp: document.getElementById("matchMvp"),
  matchPrimaryLabel: document.getElementById("matchPrimaryLabel"),
  matchKills: document.getElementById("matchKills"),
  matchScore: document.getElementById("matchScore"),
  matchSecondaryLabel: document.getElementById("matchSecondaryLabel"),
  matchSyncStatus: document.getElementById("matchSyncStatus"),
  newGameButton: document.getElementById("newGameButton"),
  outbreakMenuButton: document.getElementById("outbreakMenuButton"),
  vitalsPanel: document.getElementById("hud-player-info"),
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
  sandboxMenuButton: document.getElementById("sandboxMenuButton"),
  clearSandboxButton: document.getElementById("clearSandboxButton"),
  sandboxPanel: document.getElementById("sandboxPanel"),
  sandboxPanelClose: document.getElementById("sandboxPanelClose"),
  sandboxTabs: document.getElementById("sandboxTabs"),
  sandboxBotCount: document.getElementById("sandboxBotCount"),
  sandboxBotTeam: document.getElementById("sandboxBotTeam"),
  sandboxBotBehavior: document.getElementById("sandboxBotBehavior"),
  sandboxBotAgent: document.getElementById("sandboxBotAgent"),
  sandboxBotCanShoot: document.getElementById("sandboxBotCanShoot"),
  sandboxBotCanMove: document.getElementById("sandboxBotCanMove"),
  sandboxPlaceBotButton: document.getElementById("sandboxPlaceBotButton"),
  sandboxSpawnCenterButton: document.getElementById("sandboxSpawnCenterButton"),
  sandboxBotList: document.getElementById("sandboxBotList"),
  sandboxMapSelect: document.getElementById("sandboxMapSelect"),
  sandboxLoadMapButton: document.getElementById("sandboxLoadMapButton"),
  sandboxAddWallButton: document.getElementById("sandboxAddWallButton"),
  sandboxRemoveWallButton: document.getElementById("sandboxRemoveWallButton"),
  sandboxClearWallsButton: document.getElementById("sandboxClearWallsButton"),
  sandboxItemType: document.getElementById("sandboxItemType"),
  sandboxPlaceItemButton: document.getElementById("sandboxPlaceItemButton"),
  sandboxClearItemsButton: document.getElementById("sandboxClearItemsButton"),
  sandboxPierceWallsToggle: document.getElementById("sandboxPierceWallsToggle"),
  sandboxGodToggle: document.getElementById("sandboxGodToggle"),
  sandboxBlackoutToggle: document.getElementById("sandboxBlackoutToggle"),
  sandboxSaveButton: document.getElementById("sandboxSaveButton"),
  sandboxLoadButton: document.getElementById("sandboxLoadButton"),
  pauseSandboxButton: document.getElementById("pauseSandboxButton"),
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
  neonStaminaWrap: document.getElementById("neonStaminaWrap"),
  neonStaminaBar: document.getElementById("neonStaminaBar"),
  jettKnifeHud: document.getElementById("jettKnifeHud"),
  killFeed: document.getElementById("killFeed"),
  tutorialOverlay: document.getElementById("tutorialOverlay"),
  tutorialPrompt: document.getElementById("tutorialPrompt"),
  tutorialKicker: document.getElementById("tutorialKicker"),
  tutorialInstruction: document.getElementById("tutorialInstruction"),
  tutorialProgress: document.getElementById("tutorialProgress"),
  tutorialAgentPanel: document.getElementById("tutorialAgentPanel"),
  tutorialAgentGrid: document.getElementById("tutorialAgentGrid"),
  fpsCounter: document.getElementById("fpsCounter"),
  audioDebugLabel: document.getElementById("audioDebugLabel"),
  authOverlay: document.getElementById("authOverlay"),
  authSessionCheck: document.getElementById("authSessionCheck"),
  authForm: document.getElementById("authForm"),
  authUsername: document.getElementById("authUsername"),
  authPassword: document.getElementById("authPassword"),
  authFeedback: document.getElementById("authFeedback"),
  loginButton: document.getElementById("loginButton"),
  registerButton: document.getElementById("registerButton"),
  guestButton: document.getElementById("guestButton"),
  accountSummary: document.getElementById("accountSummary"),
  accountType: document.getElementById("accountType"),
  accountUsername: document.getElementById("accountUsername"),
  logoutButton: document.getElementById("logoutButton"),
  authRegistrationFields: document.getElementById("authRegistrationFields"),
  authSecurityQuestion: document.getElementById("authSecurityQuestion"),
  authSecurityAnswer: document.getElementById("authSecurityAnswer"),
  forgotPasswordButton: document.getElementById("forgotPasswordButton"),
  recoveryForm: document.getElementById("recoveryForm"),
  recoveryUsername: document.getElementById("recoveryUsername"),
  recoveryChallenge: document.getElementById("recoveryChallenge"),
  recoveryQuestion: document.getElementById("recoveryQuestion"),
  recoveryAnswer: document.getElementById("recoveryAnswer"),
  recoveryNewPassword: document.getElementById("recoveryNewPassword"),
  recoveryFeedback: document.getElementById("recoveryFeedback"),
  recoverySubmitButton: document.getElementById("recoverySubmitButton"),
  recoveryBackButton: document.getElementById("recoveryBackButton"),
};

/**
 * A tela de autenticação precisa acompanhar a viewport do navegador, não a
 * transformação aplicada ao Canvas de 1280 x 720. Em telas estreitas, mantê-la
 * dentro de gameViewport reduziria o formulário junto com o jogo.
 */
function mountAuthenticationAtViewportRoot() {
  if (ui.authOverlay && ui.gameRoot && ui.authOverlay.parentElement !== ui.gameRoot) {
    ui.gameRoot.appendChild(ui.authOverlay);
  }
}

mountAuthenticationAtViewportRoot();

const AUTH_STORAGE_KEY = "valorant2d-auth-session";
const configuredApiUrl = document
  .querySelector('meta[name="valorant2d-api-url"]')
  ?.getAttribute("content")
  ?.trim();
// Todas as execuções do cliente, inclusive via Live Server, usam o mesmo
// back-end no Render. Assim, contas e progresso pertencem a uma única base.
const API_BASE_URL = (configuredApiUrl || "https://valorant2d.onrender.com").replace(/\/$/, "");
// O Render pode precisar de alguns segundos extras para sair do estado de suspensão.
const API_REQUEST_TIMEOUT = 45000;

// Dispara o despertar do Render antes de o jogador enviar o formulário.
function wakeRenderServer() {
  return fetch(`${API_BASE_URL}/`, { cache: "no-store", mode: "cors" }).catch(() => null);
}

void wakeRenderServer();

let currentProfile = null;
let authMode = "login";
let recoveryQuestionLoaded = false;

function readStoredSession() {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    if (!session || typeof session.token !== "string") return null;
    return session;
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function saveSession(payload) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    token: payload.token,
    expiresAt: payload.expiresAt,
    user: payload.user,
  }));
}

function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function requestApi(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    let payload = {};
    try {
      payload = await response.json();
    } catch (error) {
      payload = {};
    }

    if (!response.ok) {
      const requestError = new Error(payload.error || "Não foi possível concluir a solicitação.");
      requestError.status = response.status;
      requestError.code = payload.code;
      throw requestError;
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError" || error instanceof TypeError) {
      const offlineError = new Error("Servidor offline. Tente novamente em alguns instantes.");
      offlineError.code = "SERVER_OFFLINE";
      throw offlineError;
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function setAuthFeedback(message = "", type = "") {
  if (!ui.authFeedback) return;
  ui.authFeedback.textContent = message;
  ui.authFeedback.className = `auth-feedback${type ? ` is-${type}` : ""}`;
}

function setAuthBusy(isBusy, action = "login") {
  [ui.loginButton, ui.registerButton, ui.guestButton].forEach((button) => {
    if (button) button.disabled = isBusy;
  });

  if (ui.loginButton) ui.loginButton.textContent = isBusy
    ? (action === "register" ? "Criando conta..." : "Entrando...")
    : (authMode === "register" ? "Criar conta" : "Entrar");
  if (ui.registerButton) {
    ui.registerButton.textContent = authMode === "register" ? "Voltar para entrar" : "Cadastrar nova conta";
  }
}

function validateAuthForm(action) {
  const username = ui.authUsername?.value.trim() || "";
  const password = ui.authPassword?.value || "";
  const usernameIsValid = /^[A-Za-z0-9_]{3,24}$/.test(username);
  const passwordIsValid = password.length >= 8 && password.length <= 72;

  ui.authUsername?.setAttribute("aria-invalid", String(!usernameIsValid));
  ui.authPassword?.setAttribute("aria-invalid", String(!passwordIsValid));

  if (!usernameIsValid) {
    setAuthFeedback("Use de 3 a 24 letras, números ou sublinhados no nome de usuário.", "error");
    ui.authUsername?.focus();
    return null;
  }

  if (!passwordIsValid) {
    setAuthFeedback("A senha deve ter entre 8 e 72 caracteres.", "error");
    ui.authPassword?.focus();
    return null;
  }

  const credentials = { username, password };
  if (action === "register") {
    const securityQuestion = ui.authSecurityQuestion?.value || "";
    const securityAnswer = ui.authSecurityAnswer?.value.trim() || "";
    if (!securityQuestion || securityAnswer.length < 2) {
      setAuthFeedback("Selecione uma pergunta e informe sua resposta de segurança.", "error");
      return null;
    }
    credentials.securityQuestion = securityQuestion;
    credentials.securityAnswer = securityAnswer;
  }
  return credentials;
}

function updateAccountSummary(profile) {
  if (!ui.accountSummary || !profile) return;
  ui.accountSummary.classList.remove("hidden");
  ui.accountSummary.classList.toggle("is-guest", profile.isGuest);
  if (ui.accountType) {
    ui.accountType.textContent = profile.isGuest
      ? "Convidado, recordes apenas locais"
      : "Conta conectada";
  }
  if (ui.accountUsername) ui.accountUsername.textContent = profile.username;
  if (ui.logoutButton) ui.logoutButton.textContent = profile.isGuest ? "Entrar" : "Sair";
}

function enterGameWithProfile(profile) {
  currentProfile = profile;
  game.playerName = profile.username;
  updateAccountSummary(profile);
  showMainMenu();
  if (!profile.isGuest) void synchronizePreferencesFromServer();

  if (!ui.authOverlay) return;
  ui.authOverlay.classList.add("is-leaving");
  window.setTimeout(() => {
    ui.authOverlay.classList.add("hidden");
    ui.authOverlay.classList.remove("is-leaving");
    ui.authSessionCheck?.classList.add("hidden");
  }, 300);
}

async function submitAuthentication(action) {
  const credentials = validateAuthForm(action);
  if (!credentials) return;

  setAuthBusy(true, action);
  setAuthFeedback(action === "register" ? "Criando sua conta segura..." : "Validando credenciais...");

  try {
    const payload = await requestApi(`/api/${action}`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    saveSession(payload);
    setAuthFeedback(payload.message || "Acesso autorizado.", "success");
    enterGameWithProfile({ ...payload.user, isGuest: false, token: payload.token });
  } catch (error) {
    setAuthFeedback(error.message, "error");
  } finally {
    setAuthBusy(false);
  }
}

function toggleRegistrationMode() {
  authMode = authMode === "login" ? "register" : "login";
  ui.authRegistrationFields?.classList.toggle("hidden", authMode !== "register");
  if (ui.authPassword) ui.authPassword.autocomplete = authMode === "register" ? "new-password" : "current-password";
  setAuthFeedback("");
  setAuthBusy(false);
}

function setRecoveryFeedback(message = "", type = "") {
  if (!ui.recoveryFeedback) return;
  ui.recoveryFeedback.textContent = message;
  ui.recoveryFeedback.className = `auth-feedback${type ? ` is-${type}` : ""}`;
}

function showPasswordRecovery(show) {
  ui.authForm?.classList.toggle("hidden", show);
  ui.recoveryForm?.classList.toggle("hidden", !show);
  document.querySelector(".auth-divider")?.classList.toggle("hidden", show);
  ui.guestButton?.classList.toggle("hidden", show);
  document.querySelector(".auth-guest-note")?.classList.toggle("hidden", show);
  recoveryQuestionLoaded = false;
  ui.recoveryChallenge?.classList.add("hidden");
  if (ui.recoverySubmitButton) ui.recoverySubmitButton.textContent = "Ver pergunta";
  setRecoveryFeedback("");
  if (show) {
    if (ui.recoveryUsername) ui.recoveryUsername.value = ui.authUsername?.value.trim() || "";
    ui.recoveryUsername?.focus();
  } else {
    ui.authUsername?.focus();
  }
}

async function submitPasswordRecovery() {
  const username = ui.recoveryUsername?.value.trim() || "";
  if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
    setRecoveryFeedback("Informe um nome de usuário válido.", "error");
    return;
  }

  if (!recoveryQuestionLoaded) {
    try {
      const payload = await requestApi("/api/security-question", {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      if (ui.recoveryQuestion) ui.recoveryQuestion.textContent = payload.securityQuestion;
      ui.recoveryChallenge?.classList.remove("hidden");
      if (ui.recoverySubmitButton) ui.recoverySubmitButton.textContent = "Redefinir senha";
      recoveryQuestionLoaded = true;
      ui.recoveryAnswer?.focus();
    } catch (error) {
      setRecoveryFeedback(error.message, "error");
    }
    return;
  }

  const securityAnswer = ui.recoveryAnswer?.value.trim() || "";
  const newPassword = ui.recoveryNewPassword?.value || "";
  if (securityAnswer.length < 2 || newPassword.length < 8 || newPassword.length > 72) {
    setRecoveryFeedback("Informe a resposta e uma nova senha de 8 a 72 caracteres.", "error");
    return;
  }

  try {
    const payload = await requestApi("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ username, securityAnswer, newPassword }),
    });
    showPasswordRecovery(false);
    if (ui.authUsername) ui.authUsername.value = username;
    if (ui.authPassword) ui.authPassword.value = "";
    setAuthFeedback(payload.message, "success");
  } catch (error) {
    setRecoveryFeedback(error.message, "error");
  }
}

function enterAsGuest() {
  clearStoredSession();
  const suffix = cryptoRandomGuestSuffix();
  enterGameWithProfile({ username: `Convidado_${suffix}`, isGuest: true });
  setMessage("Modo convidado: recordes globais não serão salvos.");
}

function cryptoRandomGuestSuffix() {
  if (window.crypto?.getRandomValues) {
    const value = new Uint16Array(1);
    window.crypto.getRandomValues(value);
    return String(1000 + (value[0] % 9000));
  }
  return String(1000 + Math.floor(Math.random() * 9000));
}

async function bootstrapAuthentication() {
  const storedSession = readStoredSession();
  if (!storedSession) {
    ui.authSessionCheck?.classList.add("hidden");
    ui.authUsername?.focus();
    return;
  }

  ui.authSessionCheck?.classList.remove("hidden");
  try {
    const payload = await requestApi("/api/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${storedSession.token}` },
    });
    saveSession({ ...storedSession, ...payload });
    enterGameWithProfile({ ...payload.user, isGuest: false, token: storedSession.token });
  } catch (error) {
    clearStoredSession();
    ui.authSessionCheck?.classList.add("hidden");
    setAuthFeedback(
      error.code === "SERVER_OFFLINE"
        ? error.message
        : "Sua sessão expirou. Entre novamente.",
      "error",
    );
    ui.authUsername?.focus();
  }
}

async function logoutCurrentProfile() {
  const storedSession = readStoredSession();
  if (storedSession?.token) {
    try {
      await requestApi("/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${storedSession.token}` },
      });
    } catch (error) {
      // A sessão local deve ser removida mesmo se o servidor estiver indisponível.
    }
  }

  clearStoredSession();
  currentProfile = null;
  ui.accountSummary?.classList.add("hidden");
  ui.menuOverlay?.classList.add("hidden");
  ui.authPassword.value = "";
  setAuthFeedback("");
  ui.authOverlay?.classList.remove("hidden", "is-leaving");
  ui.authUsername?.focus();
}

const keys = new Set();
const pressed = new Set();
const mouse = { x: BASE_WIDTH / 2, y: BASE_HEIGHT / 2, down: false, rightDown: false };

function escalarViewport() {
  if (!ui.gameViewport) return;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  ui.gameViewport.style.transform = `scale(${scale})`;
}

const SPIKE_DETONATE_TIME = 38;
const BOT_REACTION_TIME = 0.22;
const BOT_SHOOT_GRACE_TIME = 0.42;
const PLAYER_DEFUSE_TIME = 3.2;
const BOT_DEFUSE_TIME = 5.2;
const PLANT_TIME = 2.0;
const BUY_TIME = 8;
const MATCH_ROUNDS = 9;
const POISON_TICK_INTERVAL = 0.35;
const FOV_VISIBILITY_RADIUS = 99999; // visão "infinita" — vai até a parede ou borda do mapa
const FOV_ANGLE_EPSILON = 0.0001;    // desvio menor = polígono mais preciso nas quinas
const FOV_DARKNESS_OPACITY = 0.5;
const FOV_STORAGE_KEY = "valorant2d-fov-mode";
// Custo de orbs por agente para ativar a ultimate
const ULT_COSTS = {
  neon:     5,
  viper:    6,
  sage:     5,
  omen:     6,
  jett:     4,
  killjoy:  4,
  raze:     8,
  yoru:     5,
};
const ULT_MAX_POINTS = 8; // máximo de orbs que o jogador pode acumular
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
  enabled: false,
  volume: 0.4,
  last: 0,
  lastByType: new Map(),
  cache: new Map(),
  cachePrimed: false,
  buffers: new Map(),
  buffersPrimed: false,
  outputReady: false,
  masterGain: null,
  compressor: null,
};
const AUDIO_MASTER_HEADROOM = 0.75;
const AUDIO_MIX = {
  shot: 0.34,
  reload: 0.24,
  hit: 0.28,
  headshot: 0.34,
  plant: 0.32,
  round_win: 0.42,
  round_lose: 0.36,
  spike: 0.44,
  ability: 0.3,
  pickup: 0.32,
  denied: 0.24,
};
const AUDIO_THROTTLE_MS = {
  shot: 24,
  reload: 120,
  hit: 32,
  headshot: 48,
  pickup: 70,
  denied: 90,
};
const AUDIO_NAMES = {
  shot: "Tiro",
  hit: "Acerto",
  headshot: "Headshot",
  reload: "Recarga",
  plant: "Plantando Spike",
  round_win: "Round Vencido",
  round_lose: "Round Perdido",
  spike: "Explos\u00e3o da Spike",
  ability: "Habilidade",
};
let audioDebugTimeoutId = null;
function announceAudioDebug(label) {
  if (!game.showAudioDebug || !ui.audioDebugLabel) return;
  ui.audioDebugLabel.textContent = `\u{1F50A} ${label}`;
  ui.audioDebugLabel.classList.remove("hidden");
  clearTimeout(audioDebugTimeoutId);
  audioDebugTimeoutId = setTimeout(() => {
    ui.audioDebugLabel?.classList.add("hidden");
  }, 1100);
}
const agents = [
  {
    id: "neon",
    name: "Neon",
    role: "Entrada",
    color: "#00d9ff",
    ultCost: 5,
    ability: "Alta Voltagem",
    cooldown: 0,
    use(game) {
      if ((game.neonStamina || 0) <= 0) {
        game.neonStaminaFlash = 0.42;
        setMessage("Neon: energia esgotada.");
        return false;
      }
      game.neonSpeedHeld = true;
      return "noCooldown";
    },
  },
  {
    id: "viper",
    name: "Viper",
    role: "Controle",
    color: "#0f7f3b",
    ultCost: 6,
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
    ultCost: 5,
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
    ultCost: 6,
    ability: "Smoke",
    cooldown: 8,
    use(game) {
      const p = game.player;
      const castPoint = limitedCastPoint(p, mouse, VIPER_CAST_RANGE);
      game.smokes.push({
        ...nearestWalkablePoint(castPoint, p),
        r: 22,
        targetR: 94,
        life: 7.5,
        maxLife: 7.5,
        omenSmoke: true,
        ownerTeam: "player",
        visualPhase: Math.random() * Math.PI * 2,
      });
    },
  },
  {
    id: "jett",
    name: "Jett",
    role: "Duelista",
    color: "#9fe8ff",
    ultCost: 4,
    ability: "Brisa de Impulso",
    cooldown: 7,
    use(game) {
      const p = game.player;
      const length = Math.hypot(p.moveX || 0, p.moveY || 0);
      const angle = length > 0.1 ? Math.atan2(p.moveY, p.moveX) : p.angle;
      const fromX = p.x;
      const fromY = p.y;
      safeDisplaceEntity(p, Math.cos(angle) * 170, Math.sin(angle) * 170, 12);
      spawnDashTrail(p, fromX, fromY, p.x, p.y, "#d7f7ff");
      game.screenTint = { color: "rgba(120, 220, 255, 0.22)", life: 0.22, maxLife: 0.22 };
      return Math.hypot(p.x - fromX, p.y - fromY) > 8;
    },
  },
  {
    id: "killjoy",
    name: "Killjoy",
    role: "Sentinela",
    color: "#f7d84a",
    ultCost: 4,
    ability: "Torreta",
    cooldown: 12,
    use(game) {
      const p = game.player;
      const point = nearestWalkablePoint({
        x: p.x + Math.cos(p.angle) * 46,
        y: p.y + Math.sin(p.angle) * 46,
      }, p);
      game.turrets = game.turrets.filter((turret) => turret.ownerId !== "player");
      game.turrets.push({
        x: point.x,
        y: point.y,
        r: 14,
        angle: p.angle,
        ownerTeam: "player",
        ownerId: "player",
        fireTimer: 0.2,
        burst: 0,
        burstTimer: 0,
        life: 28,
        maxLife: 28,
        targetId: null,
      });
      spawnParticles(point.x, point.y, "#f7d84a", 18, 115);
      return true;
    },
  },
  {
    id: "raze",
    name: "Raze",
    role: "Duelista",
    color: "#ff8a2a",
    ultCost: 8,
    ability: "Cartuchos de Tinta",
    cooldown: 10,
    use(game) {
      const p = game.player;
      launchRazeGrenade(p, p.angle, false);
      return true;
    },
  },
  {
    id: "yoru",
    name: "Yoru",
    role: "Duelista",
    color: "#3e6bff",
    ultCost: 5,
    ability: "Passagem Dimensional",
    cooldown: 8,
    use(game) {
      const p = game.player;
      const gate = game.yoruGatecrash;
      if (gate?.active) {
        const destination = nearestWalkablePoint({ x: gate.x, y: gate.y }, p);
        if (!isPointSafeForEntity(p, destination.x, destination.y)) {
          setMessage("Passagem bloqueada por parede.");
          return false;
        }
        spawnParticles(p.x, p.y, "#315cff", 26, 180);
        p.x = destination.x;
        p.y = destination.y;
        spawnParticles(p.x, p.y, "#80a0ff", 32, 220);
        game.screenTint = { color: "rgba(20, 40, 140, 0.48)", life: 0.32, maxLife: 0.32 };
        game.yoruGatecrash = null;
        return true;
      }
      game.yoruGatecrash = {
        active: true,
        x: p.x + Math.cos(p.angle) * 28,
        y: p.y + Math.sin(p.angle) * 28,
        vx: Math.cos(p.angle) * 360,
        vy: Math.sin(p.angle) * 360,
        life: 5,
        maxLife: 5,
      };
      return "noCooldown";
    },
  },
];

const weapons = [
  { id: "pistol", name: "Classic", price: 0, damage: 28, fireRate: 0.34, speed: 980, spread: 0.04, mag: 12, reload: 1.1 },
  { id: "light-pistol", name: "Shorty", price: 650, damage: 20, fireRate: 0.18, speed: 930, spread: 0.075, mag: 15, reload: 1.2 },
  { id: "revolver", name: "Sheriff", price: 1050, damage: 54, fireRate: 0.44, speed: 1180, spread: 0.035, mag: 6, reload: 1.35 },
  { id: "smg", name: "Spectre", price: 1450, damage: 18, fireRate: 0.09, speed: 900, spread: 0.09, mag: 25, reload: 1.4 },
  { id: "shotgun", name: "Judge", price: 2150, damage: 15, fireRate: 0.65, speed: 760, spread: 0.22, mag: 6, reload: 1.5, pellets: 6 },
  { id: "carbine", name: "Bulldog", price: 3200, damage: 33, fireRate: 0.12, speed: 1080, spread: 0.055, mag: 24, reload: 1.6 },
  { id: "rifle", name: "Vandal", price: 3900, damage: 39, fireRate: 0.15, speed: 1120, spread: 0.045, mag: 25, reload: 1.7 },
  { id: "dmr", name: "Guardian", price: 4600, damage: 62, fireRate: 0.36, speed: 1260, spread: 0.022, mag: 12, reload: 1.75 },
  { id: "lmg", name: "Odin", price: 5600, damage: 24, fireRate: 0.14, speed: 930, spread: 0.12, mag: 50, reload: 3.2 },
  { id: "sniper", name: "Operator", price: 6900, damage: 95, fireRate: 0.9, speed: 1450, spread: 0.01, mag: 5, reload: 2.1 },
];

const weaponCategories = [
  { id: "pistols", label: "Pistolas", key: "1", weaponIds: ["pistol", "light-pistol", "revolver"] },
  { id: "smgs", label: "SMGs", key: "2", weaponIds: ["smg"] },
  { id: "rifles", label: "Rifles", key: "3", weaponIds: ["carbine", "rifle", "dmr"] },
  { id: "shotguns", label: "Shotguns", key: "4", weaponIds: ["shotgun"] },
  { id: "snipers", label: "Snipers", key: "5", weaponIds: ["sniper"] },
  { id: "heavy", label: "Pesadas", key: "6", weaponIds: ["lmg"] },
];

const weaponCategoryById = new Map(weaponCategories.map((category) => [category.id, category]));
const weaponCategoryByKey = new Map(weaponCategories.map((category) => [category.key, category.id]));

const weaponImageFiles = {
  pistol: "Classic_icon.webp",
  "light-pistol": "Shorty_icon.webp",
  revolver: "Sheriff_icon.webp",
  smg: "Spectre_icon.webp",
  shotgun: "Judge_icon.webp",
  carbine: "Bulldog_icon.webp",
  // O projeto ainda não possui Vandal_icon.webp; usa o ícone disponível sem gerar 404.
  rifle: "Phantom_icon.webp",
  dmr: "Guardian_icon.webp",
  lmg: "Odin_icon.webp",
  sniper: "Operator_icon.webp",
};

const weaponImageFallbackFiles = {};

const weaponImageCache = new Map();

const weaponSpriteFiles = {
  pistol: "Classic.webp",
  "light-pistol": "Classic.webp",
  revolver: "Sheriff.webp",
  smg: "Spectre.webp",
  shotgun: "Judge.webp",
  carbine: "Bulldog.webp",
  rifle: "Phantom.webp",
  dmr: "Bulldog.webp",
  lmg: "Odin.webp",
  sniper: "Operator.webp",
};

const weaponSpriteVisuals = {
  pistol: { width: 32, gripX: -3, gripY: 1 },
  "light-pistol": { width: 30, gripX: -3, gripY: 1 },
  revolver: { width: 34, gripX: -3, gripY: 1 },
  smg: { width: 40, gripX: -4, gripY: 1 },
  shotgun: { width: 45, gripX: -5, gripY: 1 },
  carbine: { width: 45, gripX: -5, gripY: 1 },
  rifle: { width: 47, gripX: -5, gripY: 1 },
  dmr: { width: 47, gripX: -5, gripY: 1 },
  lmg: { width: 50, gripX: -6, gripY: 2 },
  sniper: { width: 54, gripX: -6, gripY: 1 },
};

const weaponSpriteCache = new Map();

function weaponImagePath(weapon) {
  return `./assets/weapon-incon/${weaponImageFiles[weapon.id] || `${weapon.name}_icon.webp`}`;
}

function fallbackWeaponImagePath(weapon) {
  const fallbackFile = weaponImageFallbackFiles[weapon.id];
  return fallbackFile ? `./assets/weapon-incon/${fallbackFile}` : "";
}

function weaponSpritePath(weapon) {
  const file = weaponSpriteFiles[weapon?.id] || weaponSpriteFiles.pistol;
  return `./assets/models/${file}`;
}

function getWeaponSprite(weapon) {
  const src = weaponSpritePath(weapon);
  const cached = weaponSpriteCache.get(src);
  if (cached) return cached;
  const image = new Image();
  const entry = { image, ready: false, failed: false };
  image.onload = () => { entry.ready = true; };
  image.onerror = () => { entry.failed = true; };
  image.src = src;
  weaponSpriteCache.set(src, entry);
  return entry;
}

function preloadWeaponSprites() {
  for (const weapon of weapons) getWeaponSprite(weapon);
}

function weaponPlaceholderImage(weapon) {
  const label = weapon.name.slice(0, 12).toUpperCase().replace(/[&<>]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="112" viewBox="0 0 240 112"><rect width="240" height="112" rx="10" fill="#101926"/><path d="M37 69h112l16-18h34v13h-28l-15 18H37z" fill="#ff4655" opacity=".9"/><path d="M56 49h85l10-12h24l-10 22H56z" fill="#d7edff" opacity=".22"/><text x="24" y="31" fill="#d7edff" font-family="Arial, sans-serif" font-size="16" font-weight="700">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function preloadWeaponAsset(src) {
  if (!src || typeof Image === "undefined") return Promise.resolve(src || "");
  const cached = weaponImageCache.get(src);
  if (cached) return cached.promise;
  const image = new Image();
  const promise = new Promise((resolve) => {
    image.onload = () => {
      if (image.decode) {
        image.decode().catch(() => {}).finally(() => resolve(src));
        return;
      }
      resolve(src);
    };
    image.onerror = () => resolve("");
  });
  image.src = src;
  weaponImageCache.set(src, { image, promise });
  return promise;
}

function preloadAllWeaponImages() {
  for (const weapon of weapons) {
    preloadWeaponAsset(weaponImagePath(weapon)).then((src) => {
      if (!src) preloadWeaponAsset(fallbackWeaponImagePath(weapon));
    });
  }
}

function weaponsForCurrentCategory() {
  const category = weaponCategoryById.get(game.shopWeaponCategory) || weaponCategories[0];
  return category.weaponIds
    .map((id) => weapons.find((weapon) => weapon.id === id))
    .filter(Boolean);
}

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
  "jett-knife": { start: 900, end: 1600, min: 0.9 },
};

const weaponAudio = {
  pistol: {
    sonsTiro: [
      "./assets/Sounds/pistol/pistol_shot_01.mp3",
      "./assets/Sounds/pistol/pistol_shot_02.mp3",
      "./assets/Sounds/pistol/pistol_shot_03.mp3",
      "./assets/Sounds/pistol/pistol_shot_04.mp3",
    ],
    sonsReload: [
      "./assets/Sounds/pistol/pistol_reload_01.mp3",
      "./assets/Sounds/pistol/pistol_reload_02.mp3",
      "./assets/Sounds/pistol/pistol_reload_03.mp3",
    ],
  },
  "light-pistol": {
    sonsTiro: ["./assets/Sounds/light-pistol/light_pistol_shot_01.mp3"],
    sonsReload: ["./assets/Sounds/light-pistol/light_pistol_reload_01.mp3"],
  },
  revolver: {
    sonsTiro: ["./assets/Sounds/revolver/revolver_shot_01.mp3"],
    sonsReload: ["./assets/Sounds/revolver/revolver_reload_01.mp3"],
  },
  smg: {
    sonsTiro: [
      "./assets/Sounds/smg/smg_shot_01.mp3",
      "./assets/Sounds/smg/smg_shot_02.mp3",
      "./assets/Sounds/smg/smg_shot_03.mp3",
    ],
    sonsReload: [
      "./assets/Sounds/smg/smg_reload_01.mp3",
      "./assets/Sounds/smg/smg_reload_02.mp3",
    ],
  },
  shotgun: {
    sonsTiro: ["./assets/Sounds/shotgun/shotgun_shot_01.mp3"],
    sonsReload: ["./assets/Sounds/shotgun/shotgun_reload_01.mp3"],
  },
  carbine: {
    sonsTiro: ["./assets/Sounds/carbine/carbine_shot_01.mp3"],
    sonsReload: [
      "./assets/Sounds/carbine/carbine_reload_01.mp3",
      "./assets/Sounds/carbine/carbine_reload_02.mp3",
      "./assets/Sounds/carbine/carbine_reload_03.mp3",
    ],
  },
  rifle: {
    sonsTiro: ["./assets/Sounds/rifle/rifle_shot_01.mp3"],
    sonsReload: [
      "./assets/Sounds/rifle/rifle_reload_01.mp3",
      "./assets/Sounds/rifle/rifle_reload_02.mp3",
    ],
  },
  dmr: {
    sonsTiro: ["./assets/Sounds/dmr/dmr_shot_01.mp3"],
    sonsReload: [
      "./assets/Sounds/dmr/dmr_reload_01.mp3",
      "./assets/Sounds/dmr/dmr_reload_02.mp3",
      "./assets/Sounds/dmr/dmr_reload_03.mp3",
    ],
  },
  lmg: {
    sonsTiro: [
      "./assets/Sounds/lmg/lmg_shot_01.mp3",
      "./assets/Sounds/lmg/lmg_shot_02.mp3",
      "./assets/Sounds/lmg/lmg_shot_03.mp3",
    ],
    sonsReload: [
      "./assets/Sounds/lmg/lmg_reload_01.mp3",
      "./assets/Sounds/lmg/lmg_reload_02.mp3",
    ],
  },
  sniper: {
    sonsTiro: [
      "./assets/Sounds/sniper/sniper_shot_01.mp3",
      "./assets/Sounds/sniper/sniper_shot_02.mp3",
      "./assets/Sounds/sniper/sniper_shot_03.mp3",
    ],
    sonsReload: [
      "./assets/Sounds/sniper/sniper_reload_01.mp3",
      "./assets/Sounds/sniper/sniper_reload_02.mp3",
      "./assets/Sounds/sniper/sniper_reload_03.mp3",
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

function clamp01(value) {
  return Math.max(0, Math.min(1, Number.isFinite(Number(value)) ? Number(value) : 0));
}

function soundMix(name, multiplier = 1) {
  const sfx = Number(settings?.sfxVolume);
  const sfxScale = Number.isFinite(sfx) ? sfx / 100 : 1;
  return clamp01((AUDIO_MIX[name] ?? AUDIO_MIX.ability) * multiplier * sfxScale);
}

function audioOutputNode() {
  return audio.masterGain || audio.ctx?.destination || null;
}

function refreshAudioOutputGain() {
  if (audio.masterGain) {
    audio.masterGain.gain.value = AUDIO_MASTER_HEADROOM * clamp01(audio.volume);
  }
}

function ensureAudioOutputGraph() {
  if (!audio.ctx || audio.outputReady) return;
  audio.masterGain = audio.ctx.createGain();
  audio.compressor = audio.ctx.createDynamicsCompressor?.() || null;
  refreshAudioOutputGain();
  if (audio.compressor) {
    audio.compressor.threshold.value = -28;
    audio.compressor.knee.value = 28;
    audio.compressor.ratio.value = 8;
    audio.compressor.attack.value = 0.004;
    audio.compressor.release.value = 0.18;
    audio.masterGain.connect(audio.compressor);
    audio.compressor.connect(audio.ctx.destination);
  } else {
    audio.masterGain.connect(audio.ctx.destination);
  }
  audio.outputReady = true;
}

function shouldThrottleAudio(name) {
  const minGap = AUDIO_THROTTLE_MS[name] || 0;
  if (!minGap) return false;
  const now = performance.now();
  const last = audio.lastByType.get(name) || 0;
  if (now - last < minGap) return true;
  audio.lastByType.set(name, now);
  return false;
}

function setMasterAudioVolume(value) {
  audio.volume = clamp01(value);
  refreshAudioOutputGain();
  for (const pool of audio.cache.values()) {
    for (const clip of pool.clips || []) clip.volume = Math.min(clip.volume, audio.volume);
  }
}

function panForAudioOrigin(origin) {
  if (!origin || !game.player) return 0;
  return Math.max(-1, Math.min(1, (origin.x - game.player.x) / 460));
}

function initAudio() {
  if (!audio.enabled) return;
  if (!audio.ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audio.ctx = new AudioContext();
  }
  if (audio.ctx?.state === "suspended") audio.ctx.resume?.()?.catch?.(() => {});
  ensureAudioOutputGraph();
  primeWeaponAudioBuffers();
  primeWeaponAudioCache();
}

function playTone(freq, duration = 0.06, type = "square", gain = 0.035) {
  if (!audio.enabled) return;
  initAudio();
  if (!audio.ctx) return;
  const output = audioOutputNode();
  if (!output) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const amp = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(output);
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
  return src.includes("/Tiro/") ? 3 : 2;
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

function playDecodedAudioBuffer(src, volume = soundMix("shot"), origin = null) {
  if (!audio.enabled || !audio.ctx || !src) return false;
  if (audio.ctx.state === "suspended") audio.ctx.resume?.()?.catch?.(() => {});
  ensureAudioOutputGraph();
  const output = audioOutputNode();
  if (!output) return false;
  const entry = audio.buffers.get(src);
  if (!entry?.buffer) {
    loadAudioBuffer(src);
    return false;
  }
  const source = audio.ctx.createBufferSource();
  const gain = audio.ctx.createGain();
  source.buffer = entry.buffer;
  gain.gain.value = clamp01(volume);
  source.connect(gain);
  if (audio.ctx.createStereoPanner && origin) {
    const panner = audio.ctx.createStereoPanner();
    panner.pan.value = panForAudioOrigin(origin);
    gain.connect(panner);
    panner.connect(output);
  } else {
    gain.connect(output);
  }
  source.start(0);
  return true;
}

function playAudioElement(src, volume = soundMix("shot")) {
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
  if (pool && !clip.paused && !clip.ended && clip.currentTime > 0 && clips.length >= pool.max) return false;
  if (pool) pool.index = (clips.indexOf(clip) + 1) % clips.length;
  clip.volume = clamp01(volume * audio.volume);
  clip.currentTime = 0;
  const playback = clip.play();
  if (playback?.catch) playback.catch(() => {});
  return true;
}

function playWeaponSound(weapon, action, origin = null) {
  const soundName = action === "reload" ? "reload" : "shot";
  const config = weaponAudio[weapon?.id];
  const paths = action === "reload" ? config?.sonsReload : config?.sonsTiro;
  const src = randomAudioPath(paths);
  if (!src) {
    playSound(soundName);
    return false;
  }
  if (shouldThrottleAudio(soundName)) return false;
  const weaponBoost = weapon?.id === "sniper" ? 1.08 : weapon?.id === "lmg" ? 0.9 : 1;
  const volume = soundMix(soundName, weaponBoost);
  return playDecodedAudioBuffer(src, volume, origin) || playAudioElement(src, volume);
}

function playSound(name) {
  if (shouldThrottleAudio(name)) return;
  const mix = soundMix(name);
  if (name === "shot")    playTone(110, 0.05, "square",   0.08 * mix);
  if (name === "hit")     { playTone(900, 0.04, "triangle", 0.12 * mix); playTone(600, 0.06, "triangle", 0.06 * mix); }
  if (name === "headshot"){ playTone(1200,0.05, "triangle", 0.14 * mix); playTone(800, 0.08, "sine",     0.08 * mix); }
  if (name === "reload")  playTone(280, 0.1,  "sawtooth",  0.09 * mix);
  if (name === "plant")   { playTone(440, 0.08, "sine", 0.11 * mix); playTone(660, 0.12, "sine", 0.08 * mix); }
  if (name === "round_win")  { playTone(523, 0.1, "sine", 0.09 * mix); playTone(659, 0.1, "sine", 0.09 * mix); playTone(784, 0.2, "sine", 0.1 * mix); }
  if (name === "round_lose") { playTone(392, 0.1, "sine", 0.09 * mix); playTone(330, 0.1, "sine", 0.09 * mix); playTone(262, 0.22,"sine", 0.1 * mix); }
  if (name === "spike")   playTone(80,  0.3,  "sawtooth",  0.12 * mix);
  if (name === "ability") playTone(620, 0.14, "triangle",  0.11 * mix);
  if (name === "pickup")  { playTone(760, 0.06, "sine", 0.12 * mix); playTone(1040, 0.08, "sine", 0.09 * mix); }
  if (name === "denied")  { playTone(180, 0.08, "sawtooth", 0.11 * mix); playTone(120, 0.12, "sawtooth", 0.08 * mix); }
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

/**
 * Gera a arena exclusiva do Outbreak.
 *
 * A área central fica deliberadamente livre para que o jogador nunca nasça
 * preso. As coberturas são distribuídas em dois anéis laterais, com pequenas
 * variações a cada partida, preservando corredores largos entre elas.
 */
function generateOutbreakMap() {
  const width = 1280;
  const height = 720;
  const jitter = (amount) => (Math.random() - 0.5) * amount;
  const coverSlots = [
    { x: 150, y: 135, w: 150, h: 34 }, { x: 480, y: 105, w: 105, h: 34 },
    { x: 695, y: 105, w: 105, h: 34 }, { x: 980, y: 135, w: 150, h: 34 },
    { x: 105, y: 300, w: 42, h: 120 }, { x: 1133, y: 300, w: 42, h: 120 },
    { x: 180, y: 540, w: 150, h: 34 }, { x: 470, y: 580, w: 110, h: 34 },
    { x: 700, y: 580, w: 110, h: 34 }, { x: 950, y: 540, w: 150, h: 34 },
  ];
  const walls = [
    { x: 0, y: 0, w: width, h: 28 }, { x: 0, y: height - 28, w: width, h: 28 },
    { x: 0, y: 0, w: 28, h: height }, { x: width - 28, y: 0, w: 28, h: height },
    ...coverSlots.map((slot) => ({
      ...slot,
      x: Math.round(slot.x + jitter(24)),
      y: Math.round(slot.y + jitter(18)),
    })),
  ];
  const destructibles = [
    { x: 245 + jitter(20), y: 300 + jitter(24), w: 54, h: 54, hp: 90, maxHp: 90 },
    { x: 981 + jitter(20), y: 300 + jitter(24), w: 54, h: 54, hp: 90, maxHp: 90 },
    { x: 365 + jitter(20), y: 465 + jitter(18), w: 58, h: 58, hp: 90, maxHp: 90 },
    { x: 857 + jitter(20), y: 465 + jitter(18), w: 58, h: 58, hp: 90, maxHp: 90 },
  ];
  const spawnPoints = [
    { x: 82, y: 82 }, { x: width / 2, y: 72 }, { x: width - 82, y: 82 },
    { x: 82, y: height - 82 }, { x: width / 2, y: height - 72 }, { x: width - 82, y: height - 82 },
  ];

  return {
    name: "Zona de Contenção",
    vibe: "Sobrevivência procedural",
    width,
    height,
    theme: {
      ...DEFAULT_MAP.theme,
      floor: "#151719",
      grid: "rgba(255, 70, 85, 0.045)",
      wall: "#30343a",
      wallStroke: "#555b63",
    },
    // Outbreak não possui objetivos de Spike.
    sites: [],
    walls,
    destructibles,
    botRoutes: spawnPoints.map((spawn) => [spawn, { x: width / 2, y: height / 2 }]),
    attackersSpawn: { x: width / 2, y: height / 2 },
    playerDefenderSpawn: { x: width / 2, y: height / 2 },
    defendersSpawn: spawnPoints.slice(0, 3),
    attackerBotSpawns: spawnPoints.slice(3),
  };
}

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
  playMode: "default",
  outbreak: false,
  outbreakWave: 1,
  outbreakElapsed: 0,
  outbreakLastDamageAt: 0,
  outbreakWaveDelay: 0,
  difficulty: "normal",
  sandbox: false,
  godMode: false,
  sandboxPanelOpen: false,
  sandboxTab: "bots",
  sandboxPlacement: null,
  sandboxBotLimit: 18,
  sandboxBulletsPierceWalls: false,
  sandboxCustomWalls: [],
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
  hudOpacity: 1,
  showFps: false,
  showPing: false,
  playerName: "Player",
  currentFps: 0,
  pingMs: 32,
  messageTimer: 0,
  showAudioDebug: false,
  showHitboxes: false,
  timeScale: 1,
  fogMode: false,
  omenUlt: null,
  fovMode: localStorage.getItem(FOV_STORAGE_KEY) === "on",
  fovSegmentsCache: { key: null, segments: null },
  fovPolygonCache: { key: null, polygon: null },
  ultFlashTimer: 0,
  devModeUnlocked: false,
  crosshairUnlockClicks: 0,
  agentLocked: false,
  shopTab: "weapons",
  shopWeaponCategory: "pistols",
  shopTransactionLocked: false,
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
  turrets: [],
  grenades: [],
  rockets: [],
  paintDecals: [],
  yoruGatecrash: null,
  screenTint: null,
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
  neonStamina: 100,
  neonSpeedHeld: false,
  neonSpeedActive: false,
  neonVignette: 0,
  neonStaminaFlash: 0,
  playerUltPoints: 0,
  lastShot: 0,
  reloadTimer: 0,
  roundOverTimer: 0,
  shake: 0,
  damageFlash: 0,
  botPlanSiteIndex: 0,
  pauseReturnState: null,
  optionsReturnState: null,
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
    armor: game.outbreak ? 50 : game.armor,
    maxArmor: game.outbreak ? 50 : game.upgrades.armorCapacity,
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

const SANDBOX_SAVE_KEY = "valorant2d-sandbox-config";

function sandboxEntityCount() {
  return game.bots.filter((bot) => bot.alive).length + game.allies.filter((ally) => ally.alive).length;
}

function sandboxValidPoint(point, radius = 18) {
  if (!point) return false;
  if (point.x < radius || point.x > map.width - radius || point.y < radius || point.y > map.height - radius) return false;
  return !solidWalls().some((wall) => circleRectCollides({ x: point.x, y: point.y, r: radius }, wall));
}

function sandboxSafePoint(point, radius = 18) {
  const fallback = game.player || map.attackersSpawn;
  const safe = nearestWalkablePoint({ x: point.x, y: point.y }, fallback);
  return sandboxValidPoint(safe, radius) ? safe : { x: fallback.x, y: fallback.y };
}

function sandboxBotTemplateFromUi() {
  const behavior = ui.sandboxBotBehavior?.value || "combat";
  const canShoot = ui.sandboxBotCanShoot?.classList.contains("is-on") ?? true;
  const canMove = ui.sandboxBotCanMove?.classList.contains("is-on") ?? true;
  return {
    team: ui.sandboxBotTeam?.value || "enemy",
    behavior,
    canShoot: behavior === "static" ? canShoot : canShoot,
    canMove: behavior === "static" ? false : canMove,
    agentId: ui.sandboxBotAgent?.value || agents[0].id,
  };
}

function applySandboxConfigToEntity(entity, config) {
  entity.sandboxControl = true;
  entity.sandboxBehavior = config.behavior;
  entity.sandboxCanShoot = config.canShoot;
  entity.sandboxCanMove = config.canMove;
  entity.agentId = config.agentId || entity.agentId;
  entity.aiState = config.canMove ? config.behavior : "static";
  if (!config.canMove) entity.speed = 0;
  return entity;
}

function sandboxSpawnBotAt(point, config = sandboxBotTemplateFromUi()) {
  if (sandboxEntityCount() >= game.sandboxBotLimit) {
    setMessage(`Sandbox: limite de ${game.sandboxBotLimit} bots atingido.`);
    return null;
  }
  const safe = sandboxSafePoint(point, 18);
  const baseIndex = config.team === "ally" ? game.allies.length : game.bots.length;
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const entity = config.team === "ally" ? makeAlly(safe, baseIndex) : makeBot(safe, baseIndex);
  entity.id = `${config.team === "ally" ? "ally" : "bot"}-sandbox-${uniqueId}`;
  entity.hasSpike = false;
  applySandboxConfigToEntity(entity, config);
  sanitizeEntityPosition(entity);
  if (config.team === "ally") game.allies.push(entity);
  else game.bots.push(entity);
  spawnParticles(entity.x, entity.y, config.team === "ally" ? "#62e6a0" : "#ff4d5d", 18, 145);
  renderSandboxPanel();
  return entity;
}

function sandboxSpawnMany(point, config = sandboxBotTemplateFromUi()) {
  const amount = Math.max(1, Math.min(12, Number(ui.sandboxBotCount?.value) || 1));
  for (let i = 0; i < amount; i++) {
    const angle = (Math.PI * 2 * i) / amount;
    sandboxSpawnBotAt({ x: point.x + Math.cos(angle) * 26 * i, y: point.y + Math.sin(angle) * 26 * i }, config);
  }
  setMessage(`Sandbox: ${amount} ${config.team === "ally" ? "aliado(s)" : "inimigo(s)"} criado(s).`);
}

function sandboxPlaceItemAt(point) {
  const safe = sandboxSafePoint(point, 18);
  const type = ui.sandboxItemType?.value || "spike";
  if (type === "spike") {
    game.spike = { state: "dropped", owner: null, x: safe.x, y: safe.y, timer: 0, site: null, plantProgress: 0, defuseProgress: 0, defuseCheckpoint: 0, defuserId: null };
    spawnParticles(safe.x, safe.y, "#66e48f", 20, 145);
  } else if (type === "orb") {
    game.ultOrbs.push({ x: safe.x, y: safe.y, id: `sandbox-orb-${Date.now()}`, phase: Math.random() * 3, reservadaPor: null });
    spawnParticles(safe.x, safe.y, "#bd67ff", 18, 145);
  } else {
    game.medkits.push({ x: safe.x, y: safe.y, id: `sandbox-medkit-${Date.now()}`, phase: Math.random() * 3 });
    spawnParticles(safe.x, safe.y, "#62e6a0", 18, 145);
  }
  setMessage(`Sandbox: ${type} posicionado.`);
}

function sandboxAddWallAt(point) {
  const x = Math.max(20, Math.min(map.width - 100, point.x - 50));
  const y = Math.max(20, Math.min(map.height - 30, point.y - 15));
  const wall = { x, y, w: 100, h: 30, hp: 9999, sandboxWall: true };
  game.destructibles.push(wall);
  game.sandboxCustomWalls.push(wall);
  spawnParticles(x + wall.w / 2, y + wall.h / 2, "#ffd166", 14, 100);
  setMessage("Sandbox: parede adicionada.");
}

function sandboxRemoveWallNear(point) {
  const walls = game.sandboxCustomWalls.length ? game.sandboxCustomWalls : game.destructibles;
  const nearest = walls
    .map((wall) => ({ wall, dist: Math.hypot(point.x - (wall.x + wall.w / 2), point.y - (wall.y + wall.h / 2)) }))
    .sort((a, b) => a.dist - b.dist)[0];
  if (!nearest || nearest.dist > 130) {
    setMessage("Sandbox: nenhuma parede custom proxima.");
    return;
  }
  game.destructibles = game.destructibles.filter((wall) => wall !== nearest.wall);
  game.sandboxCustomWalls = game.sandboxCustomWalls.filter((wall) => wall !== nearest.wall);
  spawnParticles(nearest.wall.x + nearest.wall.w / 2, nearest.wall.y + nearest.wall.h / 2, "#ffd166", 14, 120);
  setMessage("Sandbox: parede removida.");
}

function setSandboxPlacement(type) {
  if (!game.sandbox) return;
  game.sandboxPlacement = { type };
  setMessage("Sandbox: escolha a posicao no mapa.");
}

function cancelSandboxPlacement() {
  game.sandboxPlacement = null;
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

/** Cria exatamente dois kits em solo acessível e afastados entre si. */
function spawnOutbreakMedkits() {
  const occupied = [];
  const center = { x: map.width / 2, y: map.height / 2 };
  for (let index = 0; index < 2; index++) {
    let point = null;
    for (let attempt = 0; attempt < 100 && !point; attempt++) {
      const candidate = randomAccessiblePickupPoint(occupied);
      const fromCenter = Math.hypot(candidate.x - center.x, candidate.y - center.y);
      if (fromCenter >= 150 && fromCenter <= 560) point = candidate;
    }
    point ||= nearestWalkablePoint({ x: center.x + (index ? 330 : -330), y: center.y + 120 }, center);
    occupied.push(point);
  }
  game.medkits = occupied.map((point, index) => ({
    ...point,
    id: `outbreak-medkit-${game.outbreakWave}-${index}`,
    phase: index * Math.PI,
  }));
}

function resetRound() {
  game.roundNumber += game.phase === "ended" ? 1 : 0;
  if (!game.outbreak) map.botRoutes = randomizedBotRoutes(map);
  game.botPlanSiteIndex = game.outbreak ? 0 : Math.floor(Math.random() * map.sites.length);
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
   game.turrets = [];
   game.grenades = [];
   game.rockets = [];
   game.paintDecals = [];
   game.yoruGatecrash = null;
   game.omenUlt = null;
   game.timeScale = 1;
   resetFogRenderState();
   game.screenTint = null;
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
  game.neonStamina = 100;
  game.neonSpeedHeld = false;
  game.neonSpeedActive = false;
  game.neonVignette = 0;
  game.neonStaminaFlash = 0;
  game.player.ultPoints = game.playerUltPoints;
  game.lastShot = 0;
  game.reloadTimer = 0;
  game.roundOverTimer = 0;
  const carrier = game.bots.find((bot) => bot.hasSpike);
  const spikeCarrierPoint = carrier || game.player || map.attackersSpawn;
  game.spike = {
    state: game.training ? "disabled" : "carried",
    owner: game.training ? null : game.playerSide === "attackers" ? "player" : "bot",
    x: game.playerSide === "attackers" ? game.player.x : spikeCarrierPoint.x,
    y: game.playerSide === "attackers" ? game.player.y : spikeCarrierPoint.y,
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

let shopKeyHandler = null;

function isShopOpen() {
  return !!ui.shop && !ui.shop.classList.contains("hidden");
}

function canUseShop() {
  return !!game.player?.alive && (game.phase === "buy" || game.sandbox);
}

function attachShopKeyboard() {
  if (shopKeyHandler || !window) return;
  shopKeyHandler = (event) => {
    if (!isShopOpen()) return;
    const key = event.key;
    if (weaponCategoryByKey.has(key)) {
      event.preventDefault();
      event.stopPropagation();
      setWeaponCategory(weaponCategoryByKey.get(key));
      return;
    }
    if (key === "ArrowLeft" || key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      const currentIndex = Math.max(0, weaponCategories.findIndex((category) => category.id === game.shopWeaponCategory));
      const offset = key === "ArrowLeft" ? -1 : 1;
      const nextIndex = (currentIndex + offset + weaponCategories.length) % weaponCategories.length;
      setWeaponCategory(weaponCategories[nextIndex].id);
    }
  };
  window.addEventListener("keydown", shopKeyHandler, true);
}

function detachShopKeyboard() {
  if (!shopKeyHandler || !window) return;
  window.removeEventListener("keydown", shopKeyHandler, true);
  shopKeyHandler = null;
}

function openShop() {
  if (!canUseShop()) {
    setMessage(game.player?.alive ? "A loja so abre na fase de compra." : "Voce precisa estar vivo para comprar.");
    updateUi();
    return false;
  }
  updateShopState();
  ui.shop?.classList.remove("hidden");
  ui.shopBackdrop?.classList.remove("hidden");
  attachShopKeyboard();
  updateUi();
  return true;
}

function closeShop() {
  ui.shop?.classList.add("hidden");
  ui.shopBackdrop?.classList.add("hidden");
  game.shopTransactionLocked = false;
  detachShopKeyboard();
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
  game.statisticsRecorded = false;
  game.startingSide = game.outbreak ? "attackers" : Math.random() < 0.5 ? "attackers" : "defenders";
  game.playerSide = game.startingSide;
  map = game.training ? TRAINING_MAP : game.outbreak ? generateOutbreakMap() : MAPS[Math.floor(Math.random() * MAPS.length)];
  if (!game.outbreak) map.botRoutes = randomizedBotRoutes(map);
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
  const kills = Math.max(0, Math.round(game.stats?.kills || 0));
  const score = Math.max(0, kills * 100 + game.playerScore * 500);
  game.phase = "matchOver";
  game.phaseTime = 0;
  game.paused = false;
  closeShop();
  ui.matchOverlay.classList.remove("hidden");
  ui.matchOverlay.classList.remove("is-outbreak");
  ui.matchOverlay.classList.toggle("is-defeat", !won);
  ui.overlayKicker.textContent = won ? "MISSÃO CONCLUÍDA" : "RELATÓRIO DA MISSÃO";
  ui.overlayTitle.textContent = won ? "VITÓRIA" : "DERROTA";
  ui.overlayText.innerHTML = `${game.playerScore} <span>:</span> ${game.enemyScore}`;
  if (ui.matchMvp) ui.matchMvp.textContent = currentProfile?.username || game.playerName || "Agente";
  if (ui.matchPrimaryLabel) ui.matchPrimaryLabel.textContent = "MVP DA PARTIDA";
  if (ui.matchKills) ui.matchKills.textContent = String(kills);
  if (ui.matchScore) ui.matchScore.textContent = score.toLocaleString("pt-BR");
  if (ui.matchSecondaryLabel) ui.matchSecondaryLabel.textContent = "PONTUAÇÃO";
  if (ui.matchSyncStatus) ui.matchSyncStatus.textContent = currentProfile?.isGuest ? "Partida local: entre com uma conta para salvar o desempenho." : "Sincronizando desempenho...";
  renderMatchConfetti(won);
  ui.newGameButton.style.display = "";
  ui.newGameButton.querySelector("span").textContent = "CONTINUAR";
  ui.outbreakMenuButton?.classList.add("hidden");
  recordCompletedMatch();
}

function formatSurvivalTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function showOutbreakGameOver(reason = "Sinal vital perdido") {
  if (!game.outbreak || game.phase === "matchOver") return;
  game.phase = "matchOver";
  game.phaseTime = 0;
  game.clockActive = false;
  game.paused = false;
  closeShop();
  ui.matchOverlay.classList.remove("hidden");
  ui.matchOverlay.classList.add("is-defeat", "is-outbreak");
  ui.overlayKicker.textContent = "PROTOCOLO OUTBREAK ENCERRADO";
  ui.overlayTitle.textContent = "FIM DE JOGO";
  ui.overlayText.innerHTML = `<span>${reason}</span>`;
  if (ui.matchPrimaryLabel) ui.matchPrimaryLabel.textContent = "ONDA ALCANÇADA";
  if (ui.matchMvp) ui.matchMvp.textContent = String(game.outbreakWave);
  if (ui.matchKills) ui.matchKills.textContent = String(Math.max(0, game.stats?.kills || 0));
  if (ui.matchSecondaryLabel) ui.matchSecondaryLabel.textContent = "SOBREVIVÊNCIA";
  if (ui.matchScore) ui.matchScore.textContent = formatSurvivalTime(game.outbreakElapsed);
  if (ui.matchSyncStatus) ui.matchSyncStatus.textContent = "Dados da incursão preparados para sincronização futura.";
  ui.matchConfetti?.replaceChildren();
  if (ui.newGameButton) {
    ui.newGameButton.style.display = "";
    ui.newGameButton.querySelector("span").textContent = "TENTAR DE NOVO";
  }
  ui.outbreakMenuButton?.classList.remove("hidden");
  playSound("round_lose");
}

function renderMatchConfetti(won) {
  if (!ui.matchConfetti) return;
  ui.matchConfetti.replaceChildren();
  if (!won || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#00d9ff", "#7df9ff", "#ff4655", "#ffffff", "#62e6a0"];
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 46; index += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${(index * 37 + Math.random() * 18) % 100}%`;
    piece.style.setProperty("--confetti-color", colors[index % colors.length]);
    piece.style.setProperty("--fall-time", `${3.8 + (index % 9) * 0.24}s`);
    piece.style.setProperty("--fall-delay", `${-((index % 13) * 0.31)}s`);
    piece.style.setProperty("--drift", `${-70 + (index % 11) * 14}px`);
    fragment.appendChild(piece);
  }
  ui.matchConfetti.appendChild(fragment);
}

async function recordCompletedMatch() {
  if (game.statisticsRecorded || game.sandbox || game.training || game.tutorial || currentProfile?.isGuest) return;
  const session = readStoredSession();
  if (!session?.token) {
    if (ui.matchSyncStatus) ui.matchSyncStatus.textContent = "Sessão indisponível; desempenho salvo apenas nesta partida.";
    return;
  }
  game.statisticsRecorded = true;
  const score = Math.max(0, Math.round((game.stats?.kills || 0) * 100 + game.playerScore * 500));
  try {
    const payload = await requestApi("/api/statistics/match", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({
        victory: game.playerScore > game.enemyScore,
        kills: Math.max(0, Math.round(game.stats?.kills || 0)),
        score,
      }),
    });
    optionsStatisticsState = { status: "ready", data: payload.statistics, message: "Atualizado agora" };
    window.dispatchEvent(new CustomEvent("valorant2d:statistics-updated", { detail: payload.statistics }));
    if (ui.matchSyncStatus) ui.matchSyncStatus.textContent = "Desempenho salvo na nuvem.";
  } catch (error) {
    // A partida permanece jogável mesmo se a sincronização estiver indisponível.
    console.warn("Não foi possível sincronizar as estatísticas:", error.message);
    if (ui.matchSyncStatus) ui.matchSyncStatus.textContent = "A partida foi concluída, mas a sincronização está indisponível.";
  }
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
  if (entity.invulnerable || entity.untargetable) return 0;
  if (entity.ultimate?.type === "yoru") return 0;
  if (amount > 0 && entity.orbChannel) entity.orbChannel = null;
  let remaining = amount;
  if (entity.armor > 0) {
    const absorbed = Math.min(entity.armor, game.outbreak && entity.id === "player" ? remaining : remaining * 0.7);
    entity.armor -= absorbed;
    remaining -= absorbed;
  }
  entity.hp -= remaining;
  if (entity.id === "player") {
    game.armor = Math.max(0, entity.armor || 0);
    if (game.outbreak && amount > 0) game.outbreakLastDamageAt = game.outbreakElapsed;
  }
  return remaining;
}

function updateOutbreak(dt) {
  if (!game.outbreak || game.phase !== "action" || !game.player?.alive) return;
  game.outbreakElapsed += dt;
  const secondsWithoutDamage = game.outbreakElapsed - game.outbreakLastDamageAt;
  if (secondsWithoutDamage >= 5 && game.player.armor < 50) {
    game.player.armor = Math.min(50, game.player.armor + 12 * dt);
    game.armor = game.player.armor;
  }
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    bot.lastKnownPlayer = { x: game.player.x, y: game.player.y };
    bot.memoryTimer = 10;
  }
  if (game.outbreakWaveDelay > 0) {
    game.outbreakWaveDelay = Math.max(0, game.outbreakWaveDelay - dt);
    if (game.outbreakWaveDelay === 0) deployOutbreakWave(game.outbreakWave + 1);
  }
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

function isPointSafeForEntity(entity, x, y) {
  const probe = { x, y, r: entity.r || 18 };
  if (x < probe.r || y < probe.r || x > map.width - probe.r || y > map.height - probe.r) return false;
  return !solidWalls().some((wall) => circleRectCollides(probe, wall));
}

function safeDisplaceEntity(entity, dx, dy, stepSize = 10) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / stepSize));
  let moved = 0;
  for (let i = 0; i < steps; i++) {
    const beforeX = entity.x;
    const beforeY = entity.y;
    moveEntity(entity, dx / steps, dy / steps, map.walls);
    const stepMoved = Math.hypot(entity.x - beforeX, entity.y - beforeY);
    moved += stepMoved;
    if (stepMoved < 0.5) break;
  }
  return moved;
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

function updateNeonStamina(dt) {
  const isNeon = game.selectedAgent?.id === "neon" && game.player?.alive && game.phase === "action";
  if (!isNeon) {
    game.neonSpeedHeld = false;
    game.neonSpeedActive = false;
    game.neonVignette = Math.max(0, game.neonVignette - dt * 3.2);
    return 1;
  }
  const wantsBoost = keyHeld("neonRun") || keyHeld("ability1") || mouse.rightDown || game.neonSpeedHeld;
  const canBoost = wantsBoost && game.neonStamina > 0;
  game.neonSpeedActive = canBoost;
  if (canBoost) {
    game.neonStamina = Math.max(0, game.neonStamina - dt * 24);
    game.neonVignette = Math.min(1, game.neonVignette + dt * 4.2);
    if (game.neonStamina <= 0) {
      game.neonStaminaFlash = 0.45;
      game.neonSpeedActive = false;
      setMessage("Neon: stamina esgotada.");
    }
  } else {
    game.neonStamina = Math.min(100, game.neonStamina + dt * 18);
    game.neonVignette = Math.max(0, game.neonVignette - dt * 3.1);
  }
  game.neonStaminaFlash = Math.max(0, game.neonStaminaFlash - dt);
  game.neonSpeedHeld = false;
  return game.neonSpeedActive ? 1.33 : 1;
}

function addPaintDecal(x, y, color, radius = 42, life = 7) {
  game.paintDecals.push({ x, y, color, radius, life, maxLife: life });
}

function explodeArea(x, y, radius, damage, color, options = {}) {
  game.explosions.push({ x, y, r: 0, maxR: radius, life: 0.42, maxLife: 0.42, color });
  addPaintDecal(x, y, color, Math.max(30, radius * 0.45), 8);
  spawnParticles(x, y, color, options.particles || 30, options.power || 230);
  game.shake = Math.max(game.shake, options.shake || 0.28);
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    const distance = Math.hypot(bot.x - x, bot.y - y);
    if (distance > radius + bot.r) continue;
    const falloff = 1 - Math.min(0.72, distance / Math.max(1, radius) * 0.72);
    const actualDamage = applyDamage(bot, damage * falloff);
    game.stats.damage += Math.round(actualDamage);
    spawnDamageNumber(bot, actualDamage, false);
    if (bot.hp <= 0) eliminateBot(bot, { playerCredit: true, weaponName: options.weaponName || "Explosao" });
  }
}

function launchRazeGrenade(owner, angle, mini = false) {
  game.grenades.push({
    x: owner.x + Math.cos(angle) * (owner.r + 8),
    y: owner.y + Math.sin(angle) * (owner.r + 8),
    vx: Math.cos(angle) * (mini ? 270 : 430),
    vy: Math.sin(angle) * (mini ? 270 : 430),
    life: mini ? 0.85 : 0.72,
    maxLife: mini ? 0.85 : 0.72,
    r: mini ? 7 : 10,
    mini,
    color: mini ? "#ffcf45" : "#ff7b2f",
  });
}

function throwJettKnife(owner, angle = owner?.angle || 0, spread = 0) {
  if (!owner.ultimate || owner.ultimate.type !== "jett" || owner.ultimate.knives <= 0) return false;
  const shotAngle = (Number.isFinite(owner.angle) ? owner.angle : angle) + spread;
  owner.ultimate.knives -= 1;
  owner.ultimate.spent = Math.min(6, (owner.ultimate.spent || 0) + 1);
  game.bullets.push({
    x: owner.x + Math.cos(shotAngle) * owner.r,
    y: owner.y + Math.sin(shotAngle) * owner.r,
    startX: owner.x,
    startY: owner.y,
    vx: Math.cos(shotAngle) * 1420,
    vy: Math.sin(shotAngle) * 1420,
    life: 0.92,
    damage: 84,
    team: entityTeam(owner) === "player" ? "player" : "bot",
    weaponId: "jett-knife",
    ultimateTrail: true,
    knife: true,
    pierceLeft: 1,
    angle: shotAngle,
    hitIds: [],
  });
  game.neonTrails.push({ x1: owner.x - Math.cos(shotAngle) * 18, y1: owner.y - Math.sin(shotAngle) * 18, x2: owner.x + Math.cos(shotAngle) * 54, y2: owner.y + Math.sin(shotAngle) * 54, life: 0.42, maxLife: 0.42, color: "#c9f7ff", wind: true });
  spawnParticles(owner.x + Math.cos(shotAngle) * 22, owner.y + Math.sin(shotAngle) * 22, "#dff9ff", 8, 120);
  if (owner.ultimate.knives <= 0) owner.ultimate.life = 0;
  return true;
}

function fireJettKnifeBurst(owner) {
  const count = owner.ultimate?.knives || 0;
  if (count <= 0) return false;
  const spreadStep = 0.12;
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * spreadStep;
    throwJettKnife(owner, owner.angle, offset);
  }
  owner.ultimate.knives = 0;
  owner.ultimate.life = Math.min(owner.ultimate.life, 0.5);
  return true;
}

function fireRazeRocket(owner) {
  if (!owner.ultimate || owner.ultimate.type !== "raze" || owner.ultimate.fired) return false;
  owner.ultimate.fired = true;
  game.rockets.push({
    x: owner.x + Math.cos(owner.angle) * (owner.r + 16),
    y: owner.y + Math.sin(owner.angle) * (owner.r + 16),
    vx: Math.cos(owner.angle) * 620,
    vy: Math.sin(owner.angle) * 620,
    life: 1.9,
    maxLife: 1.9,
    r: 13,
  });
  game.shake = Math.max(game.shake, 0.22);
  return true;
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
  game.messageTimer = Math.max(1, Math.min(5, Number(settings.messageDuration) || 3));
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
    neon: ["Entrada agressiva", "Speed boost com energia e Ultimate de tiros neon."],
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
    const movementKeys = game.arrowKeys ? ["arrowup", "arrowleft", "arrowdown", "arrowright"] : ["w", "a", "s", "d"];
    const movementKeyPressed = movementKeys.some((key) => keys.has(key));
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

function smokeBlockingSight(a, b) {
  return game.smokes.find((smoke) =>
    pointLineDistance(smoke.x, smoke.y, a.x, a.y, b.x, b.y) < smoke.r
  ) || null;
}

function entityInsideSmoke(entity) {
  if (!entity?.alive) return null;
  return game.smokes.find((smoke) => Math.hypot(entity.x - smoke.x, entity.y - smoke.y) <= smoke.r + entity.r) || null;
}

function botSmokeProbeTarget(bot, target = game.player) {
  if (!target?.alive || target.ultimate?.type === "yoru") return null;
  if (lineIntersectsAnyWall(bot.x, bot.y, target.x, target.y)) return null;
  const smoke = entityInsideSmoke(target) || smokeBlockingSight(bot, target);
  if (!smoke) return null;
  const centerVisible = !lineIntersectsAnyWall(bot.x, bot.y, smoke.x, smoke.y);
  if (!centerVisible || Math.hypot(bot.x - smoke.x, bot.y - smoke.y) > 620) return null;
  const jitter = smoke.r * 0.48;
  return {
    x: smoke.x + (Math.random() - 0.5) * jitter,
    y: smoke.y + (Math.random() - 0.5) * jitter,
    smoke,
  };
}

function pointLineDistance(px, py, x1, y1, x2, y2) {
  const len2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / len2));
  const x = x1 + t * (x2 - x1);
  const y = y1 + t * (y2 - y1);
  return Math.hypot(px - x, py - y);
}

function fovCacheKey() {
  return `${game.mapName}:${map.width}x${map.height}:${map.walls.length}:${game.destructibles.length}:${game.destructibles.map((wall) => `${wall.x},${wall.y},${wall.w},${wall.h}`).join("|")}`;
}

function isFovModeEnabled() {
  return Boolean(game.fovMode);
}

function resetCanvasCompositeState() {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

function resetFogRenderState() {
  game.fovSegmentsCache = { key: null, segments: null };
  game.fovPolygonCache = { key: null, polygon: null };
  resetCanvasCompositeState();
}

function isRoundTransitionRevealActive() {
  return game.introTimer > 0 && !ui.introOverlay?.classList.contains("hidden");
}

function wallsToSegments() {
  const key = fovCacheKey();
  if (game.fovSegmentsCache.key === key && game.fovSegmentsCache.segments) return game.fovSegmentsCache.segments;
  const segments = solidWalls().flatMap((wall) => {
    const x1 = wall.x;
    const y1 = wall.y;
    const x2 = wall.x + wall.w;
    const y2 = wall.y + wall.h;
    return [
      { p1: { x: x1, y: y1 }, p2: { x: x2, y: y1 } },
      { p1: { x: x2, y: y1 }, p2: { x: x2, y: y2 } },
      { p1: { x: x2, y: y2 }, p2: { x: x1, y: y2 } },
      { p1: { x: x1, y: y2 }, p2: { x: x1, y: y1 } },
    ];
  });
  segments.push(
    { p1: { x: 0, y: 0 }, p2: { x: map.width, y: 0 } },
    { p1: { x: map.width, y: 0 }, p2: { x: map.width, y: map.height } },
    { p1: { x: map.width, y: map.height }, p2: { x: 0, y: map.height } },
    { p1: { x: 0, y: map.height }, p2: { x: 0, y: 0 } }
  );
  game.fovSegmentsCache = { key, segments };
  return segments;
}

function raySegmentIntersection(rayOrigin, rayDir, segment) {
  const sx = segment.p2.x - segment.p1.x;
  const sy = segment.p2.y - segment.p1.y;
  const denom = rayDir.x * sy - rayDir.y * sx;
  if (Math.abs(denom) < 0.00001) return null;
  const qpx = segment.p1.x - rayOrigin.x;
  const qpy = segment.p1.y - rayOrigin.y;
  const t = (qpx * sy - qpy * sx) / denom;
  const u = (qpx * rayDir.y - qpy * rayDir.x) / denom;
  if (t < 0 || u < 0 || u > 1) return null;
  return t;
}

function fovRayDistanceLimit(origin) {
  const width = map.width || canvas.width || BASE_WIDTH;
  const height = map.height || canvas.height || BASE_HEIGHT;
  return Math.max(
    Math.hypot(origin.x, origin.y),
    Math.hypot(width - origin.x, origin.y),
    Math.hypot(origin.x, height - origin.y),
    Math.hypot(width - origin.x, height - origin.y)
  ) + 32;
}

function castFovRay(radians) {
  const rayDir = { x: Math.cos(radians), y: Math.sin(radians) };
  const origin = game.player || { x: BASE_WIDTH / 2, y: BASE_HEIGHT / 2 };
  let nearest = Math.min(FOV_VISIBILITY_RADIUS, fovRayDistanceLimit(origin));
  for (const segment of wallsToSegments()) {
    const hit = raySegmentIntersection(origin, rayDir, segment);
    if (hit !== null && hit < nearest) nearest = hit;
  }
  return {
    x: Math.max(0, Math.min(map.width, origin.x + rayDir.x * nearest)),
    y: Math.max(0, Math.min(map.height, origin.y + rayDir.y * nearest)),
    angle: radians,
  };
}

function buildFovPolygon() {
  if (!game.player?.alive) return [];
  const origin = game.player;
  const cacheKey = `${Math.round(origin.x * 10)},${Math.round(origin.y * 10)}:${fovCacheKey()}`;
  if (game.fovPolygonCache.key === cacheKey && game.fovPolygonCache.polygon) return game.fovPolygonCache.polygon;

  const angles = [];
  const seen = new Set();
  const addAngle = (angle) => {
    for (const offset of [-FOV_ANGLE_EPSILON, 0, FOV_ANGLE_EPSILON]) {
      const adjusted = angle + offset;
      const bucket = Math.round(adjusted * 1000000);
      if (seen.has(bucket)) continue;
      seen.add(bucket);
      angles.push(adjusted);
    }
  };

  for (const segment of wallsToSegments()) {
    for (const point of [segment.p1, segment.p2]) {
      // Sem filtro de distância: todos os vértices recebem raios extras, evitando vazamento nas quinas
      addAngle(Math.atan2(point.y - origin.y, point.x - origin.x));
    }
  }

  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) addAngle(angle);

  const polygon = angles
    .map(castFovRay)
    .sort((a, b) => a.angle - b.angle)
    .map(({ x, y }) => ({ x, y }));
  game.fovPolygonCache = { key: cacheKey, polygon };
  return polygon;
}

function pointInsidePolygon(point, polygon) {
  if (!point || !polygon || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersects = ((yi > point.y) !== (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / ((yj - yi) || 0.00001) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function estaNoCampoDeVisao(objeto, radius = 0) {
  if (!isFovModeEnabled()) return true;
  if (isRoundTransitionRevealActive()) return true;
  if (!game.player?.alive || !objeto) return false;
  const dx = objeto.x - game.player.x;
  const dy = objeto.y - game.player.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= (game.player.r || 18) + radius + 8) return true;
  if (distance > FOV_VISIBILITY_RADIUS + radius) return false;
  const polygon = buildFovPolygon();
  const samples = [
    objeto,
    { x: objeto.x + radius, y: objeto.y },
    { x: objeto.x - radius, y: objeto.y },
    { x: objeto.x, y: objeto.y + radius },
    { x: objeto.x, y: objeto.y - radius },
  ];
  if (!samples.some((sample) => pointInsidePolygon(sample, polygon))) return false;
  const dir = { x: dx / (distance || 1), y: dy / (distance || 1) };
  return !wallsToSegments().some((segment) => {
    const hit = raySegmentIntersection(game.player, dir, segment);
    return hit !== null && hit < distance - radius;
  });
}

function isBotVisible(bot) {
  if (!bot?.alive) return false;
  return estaNoCampoDeVisao(bot, bot.r || 0);
}

function renderFOV() {
  if (!isFovModeEnabled() || !game.player?.alive || isRoundTransitionRevealActive()) {
    resetCanvasCompositeState();
    return;
  }
  const polygon = buildFovPolygon();
  if (polygon.length < 3) return;
  ctx.save();
  try {
    resetCanvasCompositeState();
    ctx.fillStyle = `rgba(15, 15, 20, ${FOV_DARKNESS_OPACITY})`;
    ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 3, canvas.height * 3);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i].x, polygon[i].y);
    ctx.closePath();
    ctx.fill();
  } finally {
    ctx.restore();
    resetCanvasCompositeState();
  }
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
  if ((owner.disarmedTimer || 0) > 0) return;
  if (owner.ultimate?.type === "yoru") {
    owner.ultimate = null;
    if (owner.id === "player") game.screenTint = { color: "rgba(30, 58, 180, 0.28)", life: 0.22, maxLife: 0.22 };
    setMessage("Espionagem Dimensional cancelada.");
    return;
  }
  if (owner.ultimate?.type === "raze" && team === "player") {
    if (game.phase !== "action" || now - game.lastShot < 0.42) return;
    game.lastShot = now;
    fireRazeRocket(owner);
    return;
  }
  if (owner.ultimate?.type === "jett" && team === "player") {
    if (game.phase !== "action" || now - game.lastShot < 0.18) return;
    game.lastShot = now;
    throwJettKnife(owner, Math.atan2(targetY - owner.y, targetX - owner.x));
    return;
  }
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
    playWeaponSound(weapon, "shot", owner);
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
  playWeaponSound(game.selectedWeapon, "reload", game.player);
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

function findEntityById(id) {
  if (!id) return null;
  return [game.player, ...game.allies, ...game.bots].find((entity) => entity?.id === id) || null;
}

function isValidOmenTeleportPoint(point, entity = game.player) {
  if (!point || !entity) return false;
  const radius = entity.r || 18;
  if (point.x < radius || point.x > map.width - radius || point.y < radius || point.y > map.height - radius) return false;
  return !solidWalls().some((wall) => circleRectCollides({ x: point.x, y: point.y, r: radius }, wall));
}

function addOmenVortex(x, y, mode = "out") {
  game.ultimateEffects.push({
    type: "omen-vortex",
    mode,
    x,
    y,
    color: "#9b5cff",
    life: 0.58,
    maxLife: 0.58,
    radius: 18,
    spin: Math.random() * Math.PI * 2,
  });
  spawnParticles(x, y, "#9b5cff", 34, 210);
  game.shake = Math.max(game.shake, 0.22);
}

function cancelOmenUltimate(message = "Ultimate do Omen cancelada.") {
  if (!game.omenUlt) return false;
  if (game.player?.ultimate?.type === "omen" && game.omenUlt.state !== "travel") {
    game.player.ultimate = null;
  }
  if (game.player) {
    game.player.invulnerable = false;
    game.player.untargetable = false;
  }
  game.omenUlt = null;
  game.timeScale = 1;
  setMessage(message);
  return true;
}

function beginOmenUltimate(entity) {
  if (entity.id !== "player") return false;
  if (game.omenUlt) return false;
  entity.ultimate = { type: "omen", life: 5, maxLife: 5, selecting: true };
  game.omenUlt = {
    state: "select",
    ownerId: entity.id,
    from: { x: entity.x, y: entity.y },
    destination: null,
    timer: 5,
    travelTimer: 0,
    fade: 1,
  };
  game.timeScale = 0.28;
  setMessage("Omen: escolha um destino com o clique esquerdo. ESC cancela.");
  return true;
}

function commitOmenTeleport(point) {
  const p = game.player;
  if (!p || !game.omenUlt || game.omenUlt.state !== "select") return false;
  if (!isValidOmenTeleportPoint(point, p)) {
    setMessage("Omen: destino bloqueado.");
    return false;
  }
  const destination = { x: point.x, y: point.y };
  game.omenUlt.state = "travel";
  game.omenUlt.destination = destination;
  game.omenUlt.travelTimer = 0.42;
  game.omenUlt.fade = 0;
  game.timeScale = 1;
  p.invulnerable = true;
  p.untargetable = true;
  p.x = game.omenUlt.from.x;
  p.y = game.omenUlt.from.y;
  addOmenVortex(p.x, p.y, "out");
  setMessage("Omen atravessando as sombras...");
  return true;
}

function updateOmenUltimate(dt) {
  const state = game.omenUlt;
  if (!state) return;
  const p = game.player;
  if (!p?.alive) {
    cancelOmenUltimate("");
    return;
  }
  if (state.state === "select") {
    state.timer -= dt;
    state.fade = Math.min(1, (state.fade || 0) + dt * 4);
    if (p.ultimate?.type === "omen") p.ultimate.life = Math.max(0, state.timer);
    if (state.timer <= 0) cancelOmenUltimate("Ultimate do Omen expirada.");
    return;
  }
  if (state.state === "travel") {
    state.travelTimer -= dt;
    p.invulnerable = true;
    p.untargetable = true;
    p.moving = false;
    if (state.travelTimer <= 0) {
      const destination = nearestWalkablePoint(state.destination, state.from);
      p.x = destination.x;
      p.y = destination.y;
      p.lastX = destination.x;
      p.lastY = destination.y;
      p.invulnerable = false;
      p.untargetable = false;
      p.ultimate = null;
      addOmenVortex(destination.x, destination.y, "in");
      game.omenUlt = null;
      game.timeScale = 1;
      setMessage("Omen materializou nas sombras.");
    }
  }
}

function getUltCost(entity) {
  const agent = agentById(entity?.agentId);
  const configured = Number(agent?.ultCost ?? ULT_COSTS[agent?.id]);
  if (!Number.isFinite(configured)) console.warn("Ult cost missing for agent", agent?.id);
  return Number.isFinite(configured) ? configured : 6;
}

function activateUltimate(entity) {
  const infiniteSandboxUlt = game.sandbox && entity?.id === "player";
  const tutorialFreeUlt = game.tutorial && entity?.id === "player" && game.tutorialFreeUlts > 0;
  const cost = getUltCost(entity);
  if (!entity?.alive || (!infiniteSandboxUlt && !tutorialFreeUlt && getUltimatePoints(entity) < cost) || (!infiniteSandboxUlt && entity.ultimate)) {
    // Feedback visual quando não há orbs suficientes
    if (entity?.id === "player" && !entity.ultimate && !infiniteSandboxUlt && !tutorialFreeUlt) {
      const current = getUltimatePoints(entity);
      if (current < cost) {
        game.ultFlashTimer = 0.55;
        playSound("denied");
        setMessage(`Ultimate: ${current}/${cost} orbs - colete mais orbs!`);
      }
    }
    return false;
  }
  const agent = agentById(entity.agentId);
  const team = entityTeam(entity);
  if (infiniteSandboxUlt) entity.ultimate = null;
  else if (tutorialFreeUlt) {
    game.tutorialFreeUlts = Math.max(0, game.tutorialFreeUlts - 1);
    game.tutorialUltUses += 1;
    if (game.tutorialFreeUlts > 0) setUltimatePoints(entity, cost);
    else setUltimatePoints(entity, 0);
  }
  else {
    // Consome exatamente o custo de orbs do agente
    setUltimatePoints(entity, getUltimatePoints(entity) - cost);
  }

  if (agent.id === "neon") {
    entity.ultimate = { type: "neon", life: 7, maxLife: 7 };
    game.ultimateEffects.push({
      type: "neon-overload",
      entityId: entity.id,
      x: entity.x,
      y: entity.y,
      color: "#00d9ff",
      life: 7,
      maxLife: 7,
      radius: 34,
    });
    spawnParticles(entity.x, entity.y, "#7df9ff", 42, 260);
  } else if (agent.id === "jett") {
    entity.ultimate = { type: "jett", life: 14, maxLife: 14, knives: 6, maxKnives: 6, spent: 0 };
  } else if (agent.id === "killjoy") {
    entity.ultimate = { type: "killjoy", life: 10, maxLife: 10 };
    game.ultimateEffects.push({
      type: "lockdown",
      entityId: entity.id,
      x: entity.x,
      y: entity.y,
      color: "#65ff9a",
      life: 13.5,
      maxLife: 13.5,
      countdown: 10,
      radius: 40,
      maxRadius: 270,
      ownerTeam: team,
      detonated: false,
    });
    spawnParticles(entity.x, entity.y, "#65ff9a", 34, 210);
  } else if (agent.id === "raze") {
    entity.ultimate = { type: "raze", life: 9, maxLife: 9, fired: false };
    addUltimateEffect("showstopper", entity, "#ff8a2a", 9);
  } else if (agent.id === "yoru") {
    entity.ultimate = { type: "yoru", life: 8, maxLife: 8 };
    game.screenTint = { color: "rgba(30, 58, 180, 0.34)", life: 8, maxLife: 8 };
    addUltimateEffect("dimensional-mask", entity, "#3e6bff", 8);
  } else if (agent.id === "viper") {
    entity.ultimate = { type: "viper", life: 999, maxLife: 999, pitId: `viper-pit-${Date.now()}-${Math.random().toString(16).slice(2)}` };
    const pitRadius = 230;
    const activationPoint = {
      x: clamp(entity.x, 0, map.width),
      y: clamp(entity.y, 0, map.height),
    };
    game.smokes.push({
      x: activationPoint.x,
      y: activationPoint.y,
      r: 48,
      targetR: pitRadius,
      life: 999,
      maxLife: 999,
      poison: true,
      damagePerSecond: 35,
      ownerTeam: team,
      ultimate: true,
      viperPit: true,
      entityId: entity.id,
      pitId: entity.ultimate.pitId,
      exitTimer: 3,
      fadeLife: 3,
      visualPhase: 0,
      anchored: true,
    });
    addUltimateEffect("chemical-fog", entity, "#35c46a", 999);
  } else if (agent.id === "sage") {
    entity.ultimate = { type: "sage", life: 1, maxLife: 1 };
    // Ultimate da Sage: restaura vida e concede escudo total mesmo sem compra previa.
    const squad = [entity];
    for (const target of squad) {
      if (!target.alive) continue;
      target.hp = target.maxHp;
      target.maxArmor = Math.max(target.maxArmor || 0, 100);
      target.armor = target.maxArmor;
      if (target.id === "player") {
        game.upgrades.armorCapacity = Math.max(game.upgrades.armorCapacity || 0, target.maxArmor);
        game.armor = target.armor;
      }
      // Efeito visual de cura: partículas verdes em espiral
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (target.alive) spawnParticles(target.x, target.y, i % 2 ? "#eafff8" : "#62e6a0", 18, 160);
        }, i * 150);
      }
      game.screenTint = { color: "rgba(0, 207, 166, 0.24)", life: 0.72, maxLife: 0.72 };
    }
    addUltimateEffect("healing-beam", entity, "#62e6a0", 0.9);
  } else {
    if (agent.id === "omen" && entity.id === "player" && beginOmenUltimate(entity)) {
      playSound("ability");
      return true;
    }
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
   if (entity.id === "player") {
     game.ultFlashTimer = 0.28;
     playSound("pickup");
   }
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
   const playerHolding = entity.id === "player" && keyHeld("interact");
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
     const heal = game.outbreak ? Math.round(entity.maxHp * 0.5) : MEDKIT_HEAL;
     entity.hp = Math.min(entity.maxHp, entity.hp + heal);
     game.medkits = game.medkits.filter((item) => item !== medkit);
     spawnParticles(medkit.x, medkit.y, "#62e6a0", 30, 190);
     setMessage(`${entity.id === "player" ? "Med-Kit coletado" : "Bot coletou Med-Kit"}: +${heal} HP.`);
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
   // No Outbreak os dois recursos de cura pertencem exclusivamente ao jogador.
   if (!game.outbreak) game.bots.forEach((bot) => collectPickups(bot, dt));
}

function plantOrDefuse(dt) {
  if (game.training) return;
  const p = game.player;
  if (game.phase !== "action") return;
  if (game.ultOrbs.some((orb) => Math.hypot(p.x - orb.x, p.y - orb.y) < p.r + 21)) return;

  if (game.playerSide === "defenders") {
    if (game.spike.state === "planted" && keyHeld("interact") && Math.hypot(p.x - game.spike.x, p.y - game.spike.y) < 46) {
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

  if (game.spike.state === "carried" && game.spike.owner === "player" && keyPressed("interact")) {
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
  if (game.omenUlt) {
    p.moving = false;
    p.moveX = 0;
    p.moveY = 0;
    p.angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
    updateNeonStamina(dt);
    if (game.spike.state === "carried" && game.spike.owner === "player") {
      game.spike.x = p.x;
      game.spike.y = p.y;
    }
    return;
  }

   const useArrows = game.arrowKeys;
   const right = useArrows ? keys.has("arrowright") : keys.has("d");
   const left = useArrows ? keys.has("arrowleft") : keys.has("a");
   const down = useArrows ? keys.has("arrowdown") : keys.has("s");
   const up = useArrows ? keys.has("arrowup") : keys.has("w");
   const dx = (right ? 1 : 0) - (left ? 1 : 0);
   const dy = (down ? 1 : 0) - (up ? 1 : 0);
   const len = Math.hypot(dx, dy) || 1;
   const movementLocked = (p.detainedTimer || 0) > 0;
   p.moving = !movementLocked && (dx !== 0 || dy !== 0);
  p.moveX = p.moving ? dx / len : 0;
  p.moveY = p.moving ? dy / len : 0;
  const neonSpeed = updateNeonStamina(dt);
  const ultimateSpeed = 1;
  const shadowSlow = shadowSlowMultiplier(p);
  if (!movementLocked) {
    moveEntity(p, (dx / len) * p.speed * ultimateSpeed * neonSpeed * shadowSlow * dt, (dy / len) * p.speed * ultimateSpeed * neonSpeed * shadowSlow * dt, map.walls);
  }
  p.angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  if (game.spike.state === "carried" && game.spike.owner === "player") {
    game.spike.x = p.x;
    game.spike.y = p.y;
  }

  if (mouse.down || keyHeld("fire")) shoot(p, mouse.x, mouse.y, game.selectedWeapon, "player");
  if (keyHeld("reload")) reload();
  if (keyPressed("ability1") && game.abilityCooldown <= 0 && game.phase === "action") {
    const used = game.selectedAgent.use(game);
    if (used !== false) {
      if (used !== "noCooldown") game.abilityCooldown = game.sandbox ? 0 : game.tutorial ? 2 : game.selectedAgent.cooldown;
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
  if (keyPressed("ability2") && game.phase === "action") activateUltimate(p);
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
    && !smoke.viperPit
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
  const movedNow = (bot.detainedTimer || 0) > 0 ? 0 : moveEntity(bot, Math.cos(angle) * bot.speed * speedScale * ultimateSpeed * shadowSlow * dt, Math.sin(angle) * bot.speed * speedScale * ultimateSpeed * shadowSlow * dt, map.walls);
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
  return p.alive && !p.untargetable && p.ultimate?.type !== "yoru" && hasCombatLineOfSight(bot, p) && Math.hypot(p.x - bot.x, p.y - bot.y) < 540;
}

function closestVisibleSquadTarget(bot) {
  return [game.player, ...game.allies]
    .filter((target) => canSeeTarget(bot, target, 560))
    .sort((a, b) => Math.hypot(a.x - bot.x, a.y - bot.y) - Math.hypot(b.x - bot.x, b.y - bot.y))[0] || null;
}

function canSeeTarget(bot, target, range = 540) {
  return target?.alive && !target.untargetable && target.ultimate?.type !== "yoru" && hasCombatLineOfSight(bot, target) && Math.hypot(target.x - bot.x, target.y - bot.y) < range;
}

function closestVisibleEnemy(bot) {
  return game.bots
    .filter((enemy) => canSeeTarget(bot, enemy, 560))
    .sort((a, b) => Math.hypot(a.x - bot.x, a.y - bot.y) - Math.hypot(b.x - bot.x, b.y - bot.y))[0] || null;
}

function botShootAt(bot, target, dt, team, firePenalty = 1, options = {}) {
  const weapon = bot.weapon || weapons[0];
  const scatter = Math.max(options.scatter || 0, bot.outbreakScatter || 0);
  const aimX = target.x + (Math.random() - 0.5) * scatter;
  const aimY = target.y + (Math.random() - 0.5) * scatter;
  const angle = Math.atan2(aimY - bot.y, aimX - bot.x);
  bot.angle = angle;
  bot.fireTimer -= dt;
  if (bot.fireTimer <= 0) {
    shoot(bot, aimX, aimY, weapon, team);
    if (options.smokeProbe) {
      game.neonTrails.push({
        x1: bot.x,
        y1: bot.y,
        x2: aimX,
        y2: aimY,
        life: 0.18,
        maxLife: 0.18,
        color: "rgba(190, 170, 230, 0.55)",
        wind: true,
      });
    }
    const multiplier = team === "bot" ? game.enemyFireMultiplier : 1;
    bot.fireTimer = (weapon.fireRate + 0.18 + Math.random() * 0.22) * multiplier * firePenalty * (bot.outbreakFirePenalty || 1);
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
    bot.lastSeenPlayerPos = { x: visibleTarget.x, y: visibleTarget.y };
    bot.lastSeenTime = performance.now();
    bot.memoryTimer = 5;
    bot.revealedTimer = 2.6;
    alertBotSquad(bot, bot.lastKnownPlayer);
  } else {
    bot.shootGraceTimer = Math.max(0, (bot.shootGraceTimer || 0) - dt);
    if (bot.shootGraceTimer <= 0) {
      bot.reactionTimer = BOT_REACTION_TIME;
      bot.canShoot = false;
    }
    bot.memoryTimer = Math.max(0, bot.memoryTimer - dt);
    if (bot.memoryTimer <= 0) bot.lastSeenPlayerPos = null;
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
    bot.lastSeenPlayerPos = { ...bot.lastKnownPlayer };
    bot.lastSeenTime = performance.now();
    bot.memoryTimer = Math.max(bot.memoryTimer || 0, 2.8);
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
  const smokeTarget = !target && !memTarget ? botSmokeProbeTarget(bot, game.player) : null;
  const shootTarget = target || memTarget || smokeTarget;
  if (!shootTarget) return false;

  const angle = Math.atan2(shootTarget.y - bot.y, shootTarget.x - bot.x);
  bot.angle = angle;
  if (target) {
    bot.lastKnownPlayer = { x: target.x, y: target.y };
    bot.lastSeenPlayerPos = { x: target.x, y: target.y };
    bot.lastSeenTime = performance.now();
    bot.memoryTimer = 5;
  }

  const cover = (options.preferCover || bot.hp < 45) ? findCoverPoint(bot, shootTarget) : null;
  if (cover && Math.hypot(bot.x - cover.x, bot.y - cover.y) > 20) {
    bot.aiState = "cover";
    moveBotToward(bot, cover, dt, 0.9);
  } else if (options.strafe !== false) {
    bot.aiState = "fight";
    const side = angle + Math.PI / 2;
    const movedNow = (bot.detainedTimer || 0) > 0 ? 0 : moveEntity(bot, Math.cos(side) * bot.speed * bot.strafe * 0.38 * dt, Math.sin(side) * bot.speed * bot.strafe * 0.38 * dt, map.walls);
    if (movedNow < 0.5) bot.strafe *= -1;
  } else {
    bot.aiState = options.state || "fight";
  }

  if (bot.canShoot !== false) {
    if (target) {
      botShootAt(bot, target, dt, "bot", options.firePenalty || 1);
    } else if (memTarget) {
      botShootAt(bot, memTarget, dt, "bot", (options.firePenalty || 1) * 1.28, { scatter: 42 });
    } else if (smokeTarget) {
      bot.aiState = "suppress-smoke";
      botShootAt(bot, smokeTarget, dt, "bot", (options.firePenalty || 1) * 1.55, { scatter: smokeTarget.smoke?.r || 90, smokeProbe: true });
    }
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
    if (game.sandbox) {
      if (game.spike.owner === "bot") {
        game.spike.state = "disabled";
        game.spike.owner = null;
        game.spike.plantProgress = 0;
      }
      return null;
    }
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
  if (getUltimatePoints(bot) < getUltCost(bot) || bot.ultimate) return false;
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
  const playerActivelyDefusing = game.spike.defuserId === "player" || (playerNearSpike && keyHeld("interact"));
  const allyDefuser = game.playerSide === "defenders" && game.spike.state === "planted" && !playerActivelyDefusing
    ? closestAliveAllyTo(game.spike.x, game.spike.y)
    : null;
  game.allies.forEach((ally, index) => {
    if (!ally.alive) return;
    const enemy = closestVisibleEnemy(ally);
    if (game.sandbox && ally.sandboxControl) {
      if (ally.sandboxCanShoot !== false && enemy) botShootAt(ally, enemy, dt, "ally");
      if (ally.sandboxCanMove !== false && ally.sandboxBehavior === "patrol") {
        const target = allyObjectivePoint(ally, index);
        if (Math.hypot(ally.x - target.x, ally.y - target.y) > 36) moveBotToward(ally, target, dt, 0.85);
      }
      keepSquadSpacing(ally, squad, dt);
      return;
    }
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
  if (game.outbreak) {
    for (const bot of game.bots) {
      if (!bot.alive) continue;
      const target = botCanSeePlayer(bot) ? p : null;
      updateBotAwareness(bot, target, dt);
      const fighting = botFightPlayer(bot, dt, {
        state: "hunt",
        preferCover: bot.hp < bot.maxHp * 0.35,
        firePenalty: 1,
      });
      const distance = Math.hypot(p.x - bot.x, p.y - bot.y);
      if (distance > 150) moveBotToward(bot, p, dt, fighting ? 0.58 : 1);
      keepBotSpacing(bot, dt);
    }
    return;
  }
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
    if (game.sandbox && bot.sandboxControl) {
      const visibleTarget = closestVisibleSquadTarget(bot);
      updateBotAwareness(bot, visibleTarget, dt);
      if (bot.sandboxCanShoot !== false && (visibleTarget || bot.memoryTimer > 0 || botSmokeProbeTarget(bot, game.player))) {
        botFightPlayer(bot, dt, { strafe: bot.sandboxCanMove !== false, state: "sandbox", firePenalty: 0.9 });
      }
      if (bot.sandboxCanMove !== false && bot.sandboxBehavior === "patrol") {
        const route = map.botRoutes[bot.patrol % map.botRoutes.length] || [];
        const target = route[bot.routeIndex % route.length] || { x: bot.x, y: bot.y };
        if (Math.hypot(bot.x - target.x, bot.y - target.y) < 28) bot.routeIndex += 1;
        else moveBotToward(bot, target, dt, 0.8);
      }
      keepBotSpacing(bot, dt);
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
      const suppressingSmoke = botFightPlayer(bot, dt, { strafe: false, state: "suppress", firePenalty: 1.25 });
      if (bot.wait > 0) {
        bot.aiState = bot.aiState === "hold" ? "hold" : "patrol";
        bot.wait -= dt;
      } else {
        const speed = memoryTargetClear ? bot.speed * 1.15 : bot.speed;
        const movedNow = moveBotToward(bot, target, dt, suppressingSmoke ? 0.55 : speed / bot.speed);
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
     if (game.player?.ultimate?.type === "jett") {
       game.player.ultimate.knives = 6;
       game.player.ultimate.maxKnives = 6;
       game.player.ultimate.spent = 0;
       game.player.ultimate.life = Math.max(game.player.ultimate.life, 5);
       spawnParticles(game.player.x, game.player.y, "#c9f7ff", 18, 150);
     }
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
      game.neonTrails.push({
        x1: oldX,
        y1: oldY,
        x2: bullet.x,
        y2: bullet.y,
        life: bullet.knife ? 0.22 : 1.15,
        maxLife: bullet.knife ? 0.22 : 1.15,
        color: bullet.knife ? "#dff9ff" : "#5df6ff",
        wind: !!bullet.knife,
      });
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

    if (!(game.sandbox && game.sandboxBulletsPierceWalls) && map.walls.some((wall) => lineIntersectsRect(oldX, oldY, bullet.x, bullet.y, wall))) {
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
          if (bullet.knife) {
            bullet.pierceLeft = (bullet.pierceLeft || 0) - 1;
            if (bullet.pierceLeft < 0) bullet.life = 0;
          } else if (!bullet.ultimateTrail) {
            bullet.life = 0;
          }
          if (bot.hp <= 0) {
            eliminateBot(bot, {
              playerCredit: bullet.team === "player",
              weaponName: bullet.knife ? "Tormenta de Aco" : game.selectedWeapon.name,
              headshot: region === "head",
            });
          }
          if (!bullet.ultimateTrail || bullet.life <= 0) break;
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
            if (game.outbreak) {
              showOutbreakGameOver("AGENTE ELIMINADO");
            } else {
              const winner = game.playerSide === "attackers" ? "defenders" : "attackers";
              endRound(winner, game.playerSide === "attackers"
                ? "Voce foi eliminado. Defensores venceram."
                : "Voce foi eliminado. Atacantes venceram.");
            }
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

function updateAgentObjects(dt) {
  if (game.yoruGatecrash?.active) {
    const gate = game.yoruGatecrash;
    const oldX = gate.x;
    const oldY = gate.y;
    gate.x += gate.vx * dt;
    gate.y += gate.vy * dt;
    gate.life -= dt;
    if (lineIntersectsAnyWall(oldX, oldY, gate.x, gate.y) || gate.x < 18 || gate.y < 18 || gate.x > map.width - 18 || gate.y > map.height - 18) {
      const point = firstWallPointOnLine(oldX, oldY, gate.x, gate.y);
      gate.x = point.x;
      gate.y = point.y;
      gate.vx = 0;
      gate.vy = 0;
    }
    if (gate.life <= 0) game.yoruGatecrash = null;
  }

  for (const turret of game.turrets) {
    turret.life -= dt;
    const targets = game.bots
      .filter((bot) => bot.alive && !bot.isDead && hasLineOfSight(turret, bot) && Math.hypot(bot.x - turret.x, bot.y - turret.y) <= 360)
      .sort((a, b) => Math.hypot(a.x - turret.x, a.y - turret.y) - Math.hypot(b.x - turret.x, b.y - turret.y));
    const target = targets.find((bot) => {
      const angle = Math.atan2(bot.y - turret.y, bot.x - turret.x);
      const delta = Math.atan2(Math.sin(angle - turret.angle), Math.cos(angle - turret.angle));
      return Math.abs(delta) <= Math.PI / 2;
    }) || null;
    if (!target) {
      turret.targetId = null;
      turret.angle += dt * 1.2;
      turret.burst = 0;
      continue;
    }
    turret.targetId = target.id;
    turret.angle = Math.atan2(target.y - turret.y, target.x - turret.x);
    turret.fireTimer -= dt;
    turret.burstTimer -= dt;
    if (turret.fireTimer <= 0 && turret.burst <= 0) {
      turret.burst = 3;
      turret.burstTimer = 0;
      turret.fireTimer = 1.15;
    }
    if (turret.burst > 0 && turret.burstTimer <= 0) {
      turret.burst -= 1;
      turret.burstTimer = 0.11;
      const damage = applyDamage(target, 9);
      game.stats.damage += Math.round(damage);
      spawnDamageNumber(target, damage, false);
      game.neonTrails.push({ x1: turret.x, y1: turret.y, x2: target.x, y2: target.y, life: 0.18, maxLife: 0.18, color: "#ffd166" });
      spawnParticles(target.x, target.y, "#ffd166", 4, 80);
      if (target.hp <= 0) {
        eliminateBot(target, { playerCredit: true, weaponName: "Torreta" });
        turret.targetId = null;
        turret.burst = 0;
      }
    }
  }
  game.turrets = game.turrets.filter((turret) => turret.life > 0);

  for (const grenade of game.grenades) {
    const oldX = grenade.x;
    const oldY = grenade.y;
    grenade.x += grenade.vx * dt;
    grenade.y += grenade.vy * dt;
    grenade.vx *= 0.98;
    grenade.vy *= 0.98;
    grenade.life -= dt;
    if (lineIntersectsAnyWall(oldX, oldY, grenade.x, grenade.y)) grenade.life = 0;
    if (grenade.life <= 0) {
      explodeArea(grenade.x, grenade.y, grenade.mini ? 62 : 104, grenade.mini ? 42 : 78, grenade.mini ? "#ffcf45" : "#ff6b2f", { weaponName: grenade.mini ? "Mini Granada" : "Cartuchos de Tinta", particles: grenade.mini ? 18 : 34, power: grenade.mini ? 170 : 250, shake: grenade.mini ? 0.16 : 0.32 });
      if (!grenade.mini) {
        for (let i = 0; i < 4; i++) {
          launchRazeGrenade({ x: grenade.x, y: grenade.y, r: 0 }, i * Math.PI / 2 + Math.PI / 4, true);
        }
      }
    }
  }
  game.grenades = game.grenades.filter((grenade) => grenade.life > 0);

  for (const rocket of game.rockets) {
    const oldX = rocket.x;
    const oldY = rocket.y;
    rocket.x += rocket.vx * dt;
    rocket.y += rocket.vy * dt;
    rocket.life -= dt;
    game.particles.push({ x: oldX, y: oldY, vx: (Math.random() - 0.5) * 45, vy: (Math.random() - 0.5) * 45, life: 0.45, maxLife: 0.45, color: "rgba(190,200,205,0.85)", size: 5 + Math.random() * 5 });
    const hitWall = lineIntersectsAnyWall(oldX, oldY, rocket.x, rocket.y);
    const hitBot = game.bots.find((bot) => bot.alive && segmentCircleHit(oldX, oldY, rocket.x, rocket.y, bot, 10));
    if (hitWall || hitBot || rocket.life <= 0) {
      explodeArea(rocket.x, rocket.y, 170, 260, "#ff7a2f", { weaponName: "Estraga-prazeres", particles: 52, power: 320, shake: 0.75 });
      rocket.life = 0;
      if (game.player?.ultimate?.type === "raze") game.player.ultimate.life = Math.min(game.player.ultimate.life, 0.65);
    }
  }
  game.rockets = game.rockets.filter((rocket) => rocket.life > 0);

  for (const decal of game.paintDecals) decal.life -= dt;
  game.paintDecals = game.paintDecals.filter((decal) => decal.life > 0);
  if (game.screenTint) {
    game.screenTint.life -= dt;
    if (game.screenTint.life <= 0) game.screenTint = null;
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
  if (game.clockActive && !game.sandbox && !game.training && !game.outbreak) game.phaseTime -= dt;
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
  game.messageTimer = Math.max(0, (game.messageTimer || 0) - dt);
  if (wasReloading && game.reloadTimer === 0) {
    game.player.ammo = currentMagSize();
  }
  game.revealTimer = Math.max(0, game.revealTimer - dt);
  if (game.damageIndicator) {
    game.damageIndicator.life -= dt;
    if (game.damageIndicator.life <= 0) game.damageIndicator = null;
  }
  game.ultFlashTimer = Math.max(0, (game.ultFlashTimer || 0) - dt);
  updateOmenUltimate(dt / Math.max(0.1, game.timeScale || 1));
  for (const smoke of game.smokes) {
    smoke.visualPhase = (smoke.visualPhase || 0) + dt;
    if (smoke.viperPit) {
      const owner = findEntityById(smoke.entityId);
      const ownerUltActive = owner?.alive && owner.ultimate?.type === "viper" && owner.ultimate.pitId === smoke.pitId;
      const ownerInside = ownerUltActive && Math.hypot(owner.x - smoke.x, owner.y - smoke.y) <= smoke.r + owner.r;
      if (ownerInside) {
        smoke.life = 999;
        smoke.exitTimer = 3;
      } else {
        smoke.exitTimer = Math.max(0, (smoke.exitTimer ?? 3) - dt);
        smoke.life = smoke.exitTimer;
        if (owner?.ultimate?.type === "viper" && smoke.exitTimer <= 0) owner.ultimate = null;
      }
    } else {
      smoke.life -= dt;
    }
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
            if (game.outbreak) showOutbreakGameOver("CONTAMINAÇÃO CRÍTICA");
            else endRound(opposingSide(game.playerSide), "A névoa química eliminou você.");
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
    if (!entity) continue;
    entity.detainedTimer = Math.max(0, (entity.detainedTimer || 0) - dt);
    entity.disarmedTimer = Math.max(0, (entity.disarmedTimer || 0) - dt);
    if (!entity?.ultimate) continue;
    if (!entity.alive) {
      entity.ultimate = null;
      continue;
    }
    entity.ultimate.life -= dt;
    if (entity.ultimate.life <= 0) entity.ultimate = null;
  }
  for (const effect of game.ultimateEffects) {
    if (effect.type === "neon-overload") {
      const source = findEntityById(effect.entityId);
      if (source?.alive && source.ultimate?.type === "neon") {
        effect.x = source.x;
        effect.y = source.y;
        effect.life = Math.max(effect.life, source.ultimate.life);
      } else {
        effect.life = 0;
      }
    }
    effect.life -= dt;
    if (effect.type === "lockdown") {
      effect.countdown = Math.max(0, (effect.countdown || 0) - dt);
      effect.radius = Math.min(effect.maxRadius || 270, effect.radius + dt * 32);
      if (!effect.detonated && effect.countdown <= 0) {
        effect.detonated = true;
        const targets = effect.ownerTeam === "player" ? game.bots : [game.player, ...game.allies];
        for (const target of targets) {
          if (!target?.alive) continue;
          if (Math.hypot(target.x - effect.x, target.y - effect.y) > (effect.maxRadius || 270)) continue;
          target.detainedTimer = 4;
          target.disarmedTimer = 4;
          spawnParticles(target.x, target.y, "#65ff9a", 24, 160);
        }
        game.shake = Math.max(game.shake, 0.36);
      }
    } else if (effect.type !== "neon-overload") {
      effect.radius += dt * (effect.type === "global-pulse" ? 360 : 72);
    }
    const source = [game.player, ...game.allies, ...game.bots].find((entity) => entity?.id === effect.entityId);
    if (effect.type === "chemical-fog" && source?.ultimate?.type !== "viper") effect.life = 0;
    if (source && effect.type !== "lockdown") {
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
  if (game.outbreak) {
    if (game.bots.length > 0 && game.bots.every((bot) => !bot.alive) && game.outbreakWaveDelay <= 0) {
      game.outbreakWaveDelay = 2.4;
      game.bullets = [];
      showRoundBanner("SETOR LIMPO", "Próxima onda se aproximando", `ONDA ${game.outbreakWave}`, 2.2);
      setMessage("Outbreak: leitura sísmica detectada. Prepare-se para a próxima onda.");
    }
    return;
  }
  if (game.sandbox) {
    game.bots = game.bots.filter((bot) => bot.alive);
    game.allies = game.allies.filter((ally) => ally.alive);
    if (game.sandboxPanelOpen) renderSandboxPanel();
    return;
  }
  if (game.bots.every((bot) => !bot.alive)) {
    if (game.training) {
      const botSpawns = game.playerSide === "attackers" ? map.defendersSpawn : map.attackerBotSpawns;
      game.bots = botSpawns.map(makeBot);
      game.bots.forEach(sanitizeEntityPosition);
      game.bullets = [];
      setMessage("Treino: novos bots apareceram.");
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
  if (isShopOpen() && !canUseShop()) {
    closeShop();
  }
  updateTutorial(dt);
  updateOutbreak(dt);
  if (game.phase === "action") {
    updatePlayer(dt);
    if (game.sandbox) {
      try {
        updateAllies(dt);
        updateBots(dt);
        updateAgentObjects(dt);
        updateBullets(dt);
        updateTrainingArena(dt);
        updateSpike(dt);
        updatePickups(dt);
        checkWinConditions();
      } catch (error) {
        console.warn("Sandbox loop recovered", error);
        game.phase = "action";
        game.phaseTime = 9999;
        game.clockActive = true;
        game.paused = false;
        game.bots = game.bots.filter((bot) => bot?.alive);
        game.allies = game.allies.filter((ally) => ally?.alive);
        if (game.spike.owner === "bot" && !game.bots.some((bot) => bot.hasSpike)) {
          game.spike.state = "disabled";
          game.spike.owner = null;
          game.spike.plantProgress = 0;
        }
        setMessage("Sandbox: loop recuperado, continue spawnando ou testando.");
      }
    } else {
      updateAllies(dt);
      updateBots(dt);
      updateAgentObjects(dt);
      updateBullets(dt);
      updateTrainingArena(dt);
      updateSpike(dt);
      updatePickups(dt);
      checkWinConditions();
    }
  }
}

function drawSandboxOverlay() {
  if (!game.sandbox) return;
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    if (!isBotVisible(bot)) continue;
    ctx.save();
    ctx.strokeStyle = "#ff4d5d";
    ctx.fillStyle = "rgba(255, 77, 93, 0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bot.x, bot.y, bot.r + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  for (const ally of game.allies) {
    if (!ally.alive) continue;
    if (!estaNoCampoDeVisao(ally, ally.r || 0)) continue;
    ctx.save();
    ctx.strokeStyle = "#46a8ff";
    ctx.fillStyle = "rgba(70, 168, 255, 0.14)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ally.x, ally.y, ally.r + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  if (game.sandboxPlacement) {
    const valid = sandboxValidPoint(mouse, game.sandboxPlacement.type === "wall" || game.sandboxPlacement.type === "remove-wall" ? 8 : 18);
    ctx.save();
    ctx.globalAlpha = 0.58;
    ctx.strokeStyle = valid ? "#62e6a0" : "#ff4d5d";
    ctx.fillStyle = valid ? "rgba(98, 230, 160, 0.16)" : "rgba(255, 77, 93, 0.18)";
    ctx.lineWidth = 3;
    if (game.sandboxPlacement.type === "wall") {
      ctx.fillRect(mouse.x - 50, mouse.y - 15, 100, 30);
      ctx.strokeRect(mouse.x - 50, mouse.y - 15, 100, 30);
    } else {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
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
  if (entity.ultimate?.type === "raze") {
    ctx.fillStyle = "rgba(0,0,0,0.46)";
    ctx.fillRect(entity.r - 2, -7, 38, 14);
    ctx.fillStyle = "#ff8a2a";
    ctx.fillRect(entity.r, -6, 34, 12);
    ctx.fillStyle = "#ffe0a0";
    ctx.fillRect(entity.r + 26, -4, 10, 8);
    return;
  }
  const sprite = getWeaponSprite(weapon);
  if (sprite?.ready && !sprite.failed) {
    const config = weaponSpriteVisuals[weapon?.id] || weaponSpriteVisuals.pistol;
    const image = sprite.image;
    const width = config.width;
    const height = Math.max(8, width * (image.naturalHeight / image.naturalWidth));
    const leftFacing = Math.cos(entity.angle || 0) < 0;
    const gripX = entity.r + config.gripX;
    const gripY = config.gripY - height / 2;
    const drawX = -gripX - width;
    const drawY = leftFacing ? -gripY - height : gripY;

    ctx.save();
    ctx.scale(-1, leftFacing ? -1 : 1);
    ctx.shadowColor = kind === "player" ? "rgba(225,250,255,0.82)" : "rgba(120,220,255,0.68)";
    ctx.shadowBlur = kind === "player" ? 7 : 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(image, drawX, drawY, width, height);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();
    return;
  }
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

  const maxHp = entity.maxHp || 100;
  if (kind === "player" && game.outbreak) {
    const width = 76;
    const left = entity.x - width / 2;
    const shieldY = entity.y + entity.r + 8;
    const healthY = shieldY + 8;
    ctx.save();
    ctx.fillStyle = "rgba(1, 8, 13, 0.82)";
    ctx.fillRect(left - 2, shieldY - 2, width + 4, 7);
    ctx.fillRect(left - 2, healthY - 2, width + 4, 8);
    ctx.fillStyle = "rgba(70, 168, 255, 0.2)";
    ctx.fillRect(left, shieldY, width, 3);
    ctx.fillStyle = "#46a8ff";
    ctx.shadowColor = "#46a8ff";
    ctx.shadowBlur = 9;
    ctx.fillRect(left, shieldY, width * Math.max(0, Math.min(1, entity.armor / 50)), 3);
    ctx.fillStyle = "rgba(98, 230, 160, 0.18)";
    ctx.fillRect(left, healthY, width, 4);
    ctx.fillStyle = entity.hp > 35 ? "#62e6a0" : "#ff4655";
    ctx.shadowColor = ctx.fillStyle;
    ctx.fillRect(left, healthY, width * Math.max(0, Math.min(1, entity.hp / 100)), 4);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(220, 247, 255, 0.32)";
    ctx.lineWidth = 1;
    ctx.strokeRect(left - 2, shieldY - 2, width + 4, 16);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(entity.x - 20, entity.y - entity.r - 15, 40, 5);
    ctx.fillStyle = entity.hp > maxHp * 0.4 ? "#66e48f" : "#ff5b5b";
    ctx.fillRect(entity.x - 20, entity.y - entity.r - 15, Math.max(0, entity.hp / maxHp) * 40, 5);
    if ((entity.maxArmor || 0) > 0) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(entity.x - 20, entity.y - entity.r - 8, 40, 4);
      ctx.fillStyle = "#46a8ff";
      ctx.fillRect(entity.x - 20, entity.y - entity.r - 8, armorRatio * 40, 4);
    }
  }

  if (kind === "player" && game.reloadTimer > 0) {
    const reloadRatio = 1 - game.reloadTimer / currentReloadTime();
    const barY = entity.y + entity.r + (game.outbreak ? 31 : 8);
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
    const outbreakOffset = kind === "player" && game.outbreak ? 24 : 0;
    ctx.fillText(label, entity.x, entity.y + entity.r + outbreakOffset + (kind === "player" && game.reloadTimer > 0 ? 26 : 18));
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

function drawCrosshair() {
  const spreadScale = game.crosshairScale * (1 + game.recoilHeat * 0.22);
  const crosshairColor = settings.crosshairColor || "#ffffff";
  const crosshairAlpha = Math.max(0.1, Math.min(1, settings.crosshairOpacity / 100));
  const crosshairThickness = Math.max(1, settings.crosshairThickness || 2);
  const crosshairGap = Math.max(0, settings.crosshairGap || 0) * game.crosshairScale;
  const crosshairLength = 14 * spreadScale;
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
    ctx.globalAlpha = crosshairAlpha;
    ctx.strokeStyle = crosshairColor;
    ctx.lineWidth = crosshairThickness;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 10 * game.crosshairScale, 0, Math.PI * 2);
    ctx.stroke();
    const g = Math.max(3 * game.crosshairScale, crosshairGap);
    const l = crosshairLength;
    ctx.beginPath();
    ctx.moveTo(mouse.x - l, mouse.y); ctx.lineTo(mouse.x - g, mouse.y);
    ctx.moveTo(mouse.x + g, mouse.y); ctx.lineTo(mouse.x + l, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - l); ctx.lineTo(mouse.x, mouse.y - g);
    ctx.moveTo(mouse.x, mouse.y + g); ctx.lineTo(mouse.x, mouse.y + l);
    ctx.stroke();
    ctx.fillStyle = crosshairColor;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (game.crosshairStyle === "minimal") {
    const gap = Math.max(3 * spreadScale, crosshairGap);
    const length = Math.max(7 * spreadScale, crosshairLength);
    const type = settings.crosshairType;
    ctx.save();
    ctx.globalAlpha = crosshairAlpha;
    ctx.strokeStyle = crosshairColor;
    ctx.lineWidth = crosshairThickness;
    if (type === "dot") {
      ctx.fillStyle = crosshairColor;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, Math.max(2, crosshairThickness * 1.5), 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "x") {
      ctx.beginPath();
      ctx.moveTo(mouse.x - length, mouse.y - length);
      ctx.lineTo(mouse.x - gap, mouse.y - gap);
      ctx.moveTo(mouse.x + gap, mouse.y + gap);
      ctx.lineTo(mouse.x + length, mouse.y + length);
      ctx.moveTo(mouse.x + length, mouse.y - length);
      ctx.lineTo(mouse.x + gap, mouse.y - gap);
      ctx.moveTo(mouse.x - gap, mouse.y + gap);
      ctx.lineTo(mouse.x - length, mouse.y + length);
      ctx.stroke();
    } else if (type === "t") {
      ctx.beginPath();
      ctx.moveTo(mouse.x - length, mouse.y);
      ctx.lineTo(mouse.x - gap, mouse.y);
      ctx.moveTo(mouse.x + gap, mouse.y);
      ctx.lineTo(mouse.x + length, mouse.y);
      ctx.moveTo(mouse.x, mouse.y + gap);
      ctx.lineTo(mouse.x, mouse.y + length);
      ctx.stroke();
    } else if (type === "circle") {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 10 * game.crosshairScale, 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === "square") {
      const side = Math.max(16 * game.crosshairScale, gap * 2 + crosshairThickness * 4);
      ctx.strokeRect(mouse.x - side / 2, mouse.y - side / 2, side, side);
    } else if (type === "ring") {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, Math.max(7 * game.crosshairScale, gap), 0, Math.PI * 2);
      ctx.stroke();
    } else {
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
    }
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.globalAlpha = crosshairAlpha;
  ctx.strokeStyle = crosshairColor;
  ctx.lineWidth = crosshairThickness;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 10 * spreadScale, 0, Math.PI * 2);
  ctx.moveTo(mouse.x - crosshairLength, mouse.y);
  ctx.lineTo(mouse.x - crosshairGap, mouse.y);
  ctx.moveTo(mouse.x + crosshairGap, mouse.y);
  ctx.lineTo(mouse.x + crosshairLength, mouse.y);
  ctx.moveTo(mouse.x, mouse.y - crosshairLength);
  ctx.lineTo(mouse.x, mouse.y - crosshairGap);
  ctx.moveTo(mouse.x, mouse.y + crosshairGap);
  ctx.lineTo(mouse.x, mouse.y + crosshairLength);
  ctx.stroke();
  ctx.restore();
}

// ── Fog of War — névoa homogênea com polígono de visão recortado via destination-out ──
// Usa o buildFovPolygon() já existente (raycasting preciso com cache por frame).
const fogCanvas = document.createElement("canvas");
fogCanvas.width = BASE_WIDTH;
fogCanvas.height = BASE_HEIGHT;
const fogCtx = fogCanvas.getContext("2d");

function drawFogOfWar() {
  if (!game.fovMode || isRoundTransitionRevealActive()) return;

  const fovPoints = buildFovPolygon();
  if (!fovPoints || fovPoints.length < 3) return;

  const px = game.player.x;
  const py = game.player.y;

  // Ordena os pontos por ângulo em relação ao jogador (garante polígono contínuo)
  fovPoints.sort((a, b) =>
    Math.atan2(a.y - py, a.x - px) - Math.atan2(b.y - py, b.x - px)
  );

  // Redimensiona o canvas offscreen se o mapa mudou de tamanho
  if (fogCanvas.width !== canvas.width || fogCanvas.height !== canvas.height) {
    fogCanvas.width = canvas.width;
    fogCanvas.height = canvas.height;
  }

  // 1. Preenche tudo com a névoa escura
  fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
  fogCtx.globalCompositeOperation = "source-over";
  fogCtx.fillStyle = "rgba(8, 12, 18, 0.88)";
  fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

  // 2. Perfura a névoa com o polígono de visão em leque a partir do jogador.
  // Desenhar como leque (jogador → ponta[0] → ponta[1] → ... → ponta[n] → jogador)
  // garante que o preenchimento cubra 100% da área entre os raios,
  // sem triângulos escuros entre raios consecutivos distantes.
  fogCtx.globalCompositeOperation = "destination-out";
  fogCtx.beginPath();
  fogCtx.moveTo(px, py);
  for (const pt of fovPoints) {
    fogCtx.lineTo(pt.x, pt.y);
  }
  fogCtx.closePath();
  fogCtx.fillStyle = "black";
  fogCtx.fill();
  fogCtx.globalCompositeOperation = "source-over";

  // 3. Cola a camada de névoa no canvas principal sem afetar o composite global
  ctx.save();
  ctx.drawImage(fogCanvas, 0, 0);
  ctx.restore();
}

function drawBotDebug() {
  if (!game.debugRoutes) return;
  ctx.save();
  ctx.font = "11px Segoe UI";
  ctx.textAlign = "center";
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    if (!isBotVisible(bot)) continue;
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
  if (!settings.showTips) return;
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
    if (!estaNoCampoDeVisao(number, 16)) continue;
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
  const yoruUltimate = game.player?.ultimate?.type === "yoru" ? game.player.ultimate : null;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
  const cooldownRatio = yoruUltimate
    ? yoruUltimate.life / yoruUltimate.maxLife
    : game.abilityCooldown > 0
      ? 1 - game.abilityCooldown / game.selectedAgent.cooldown
      : 1;
  const color = yoruUltimate ? "#3e6bff" : game.abilityCooldown <= 0 ? "#62e6a0" : "#46a8ff";
  ctx.fillStyle = color;
  ctx.fillRect(bx, by, bw * Math.min(1, cooldownRatio), bh);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "11px Segoe UI";
  ctx.textAlign = "center";
  const label = yoruUltimate
    ? `Ult ${Math.ceil(yoruUltimate.life)}s`
    : game.sandbox ? "E livre" : game.abilityCooldown > 0 ? `${Math.ceil(game.abilityCooldown)}s` : "E pronto";
  ctx.fillText(`${yoruUltimate ? "Espionagem Dimensional" : game.selectedAgent.ability} — ${label}`, canvas.width / 2, by - 4);
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
  if (!estaNoCampoDeVisao(actor, actor.r || 18)) return;
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
  if (!settings.showTips) return;
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
    if (!estaNoCampoDeVisao(kit, 28)) continue;
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
    if (!estaNoCampoDeVisao(orb, 32)) continue;
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
    if (!estaNoCampoDeVisao(entity, entity.r || 18)) continue;
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
    if (!estaNoCampoDeVisao({ x: trail.x1, y: trail.y1 }, 8) && !estaNoCampoDeVisao({ x: trail.x2, y: trail.y2 }, 8)) continue;
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
    if (!estaNoCampoDeVisao(effect, effect.radius || effect.maxRadius || 36)) continue;
    const alpha = Math.max(0, effect.life / effect.maxLife);
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha * 1.5);
    ctx.strokeStyle = effect.color;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 28;
    if (effect.type === "neon-overload") {
      const pulse = .82 + Math.sin(performance.now() / 72) * .18;
      ctx.lineWidth = 3;
      for (let arc = 0; arc < 4; arc += 1) {
        const start = performance.now() / 230 + arc * Math.PI / 2;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, (effect.radius + arc * 7) * pulse, start, start + .9);
        ctx.stroke();
      }
      ctx.globalAlpha *= .7;
      for (let bolt = 0; bolt < 7; bolt += 1) {
        const angle = performance.now() / 180 + bolt * .9;
        ctx.beginPath();
        ctx.moveTo(effect.x + Math.cos(angle) * 18, effect.y + Math.sin(angle) * 18);
        ctx.lineTo(effect.x + Math.cos(angle + .16) * 35, effect.y + Math.sin(angle + .16) * 35);
        ctx.lineTo(effect.x + Math.cos(angle - .12) * 52, effect.y + Math.sin(angle - .12) * 52);
        ctx.stroke();
      }
    } else if (effect.type === "global-pulse") {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "lockdown") {
      ctx.fillStyle = "rgba(101, 255, 154, 0.12)";
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = effect.detonated ? 8 : 4;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.maxRadius || effect.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#d8ffe5";
      ctx.font = "bold 22px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText(effect.detonated ? "LOCK" : `${Math.ceil(effect.countdown || 0)}`, effect.x, effect.y + 7);
      ctx.textAlign = "left";
    } else if (effect.type === "healing-beam" || effect.type === "orb-beam") {
      ctx.fillStyle = effect.color;
      const width = effect.type === "healing-beam" ? 34 : 12;
      ctx.fillRect(effect.x - width / 2, 0, width, effect.y);
    } else if (effect.type === "omen-vortex") {
      const progress = 1 - alpha;
      const spin = (effect.spin || 0) + progress * Math.PI * 3.6;
      const radius = 22 + progress * 34;
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, radius - i * 7, spin + i * 1.8, spin + i * 1.8 + Math.PI * 1.22);
        ctx.stroke();
      }
      ctx.fillStyle = effect.color;
      for (let i = 0; i < 12; i++) {
        const angle = spin + i * 0.82;
        const pull = effect.mode === "in" ? progress : 1 - progress;
        const orbit = 10 + radius * pull * (0.35 + (i % 4) * 0.12);
        ctx.globalAlpha = Math.min(1, alpha * (0.45 + (i % 3) * 0.12));
        ctx.beginPath();
        ctx.arc(effect.x + Math.cos(angle) * orbit, effect.y + Math.sin(angle) * orbit, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      const size = 16 + (1 - alpha) * 18;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(effect.x, effect.y - size);
      ctx.lineTo(effect.x + size, effect.y);
      ctx.lineTo(effect.x, effect.y + size);
      ctx.lineTo(effect.x - size, effect.y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(effect.x - size * 1.3, effect.y);
      ctx.lineTo(effect.x + size * 1.3, effect.y);
      ctx.moveTo(effect.x, effect.y - size * 1.3);
      ctx.lineTo(effect.x, effect.y + size * 1.3);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawAgentObjects() {
  for (const decal of game.paintDecals) {
    if (!estaNoCampoDeVisao(decal, decal.radius || 24)) continue;
    const alpha = Math.max(0, decal.life / decal.maxLife) * 0.32;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = decal.color;
    ctx.beginPath();
    ctx.ellipse(decal.x, decal.y, decal.radius, decal.radius * 0.58, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (game.yoruGatecrash?.active && estaNoCampoDeVisao(game.yoruGatecrash, 22)) {
    const gate = game.yoruGatecrash;
    const pulse = 1 + Math.sin(performance.now() / 95) * 0.12;
    ctx.save();
    ctx.globalAlpha = Math.max(0.25, gate.life / gate.maxLife);
    ctx.strokeStyle = "#7fa1ff";
    ctx.fillStyle = "rgba(40, 70, 210, 0.42)";
    ctx.shadowColor = "#315cff";
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(gate.x, gate.y, 16 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  for (const turret of game.turrets) {
    if (!estaNoCampoDeVisao(turret, turret.r || 28)) continue;
    ctx.save();
    ctx.translate(turret.x, turret.y);
    ctx.rotate(turret.angle);
    ctx.fillStyle = "rgba(255, 209, 102, 0.12)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 118, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 70, 85, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(118, 0);
    ctx.stroke();
    ctx.fillStyle = "#1f2a34";
    ctx.fillRect(-11, -9, 22, 18);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(4, -4, 18, 8);
    ctx.strokeStyle = "#ffd166";
    ctx.strokeRect(-11, -9, 22, 18);
    ctx.restore();
  }

  for (const grenade of game.grenades) {
    if (!estaNoCampoDeVisao(grenade, grenade.r || 8)) continue;
    ctx.save();
    ctx.fillStyle = grenade.color;
    ctx.shadowColor = grenade.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(grenade.x, grenade.y, grenade.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const rocket of game.rockets) {
    if (!estaNoCampoDeVisao(rocket, 18)) continue;
    const angle = Math.atan2(rocket.vy, rocket.vx);
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(angle);
    ctx.fillStyle = "#ff8a2a";
    ctx.fillRect(-15, -5, 30, 10);
    ctx.fillStyle = "#ffe0a0";
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(5, -8);
    ctx.lineTo(5, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawKunaiShape(x, y, angle, scale = 1, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha *= alpha;
  ctx.shadowColor = "#c9f7ff";
  ctx.shadowBlur = 16 * scale;
  ctx.fillStyle = "#f8fdff";
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(-4 * scale, -18 * scale, 8 * scale, 32 * scale, 4 * scale);
    ctx.fill();
  } else {
    ctx.fillRect(-4 * scale, -18 * scale, 8 * scale, 32 * scale);
  }
  ctx.fillStyle = "#ff4655";
  ctx.fillRect(-5 * scale, -3 * scale, 10 * scale, 5 * scale);
  ctx.beginPath();
  ctx.moveTo(0, -27 * scale);
  ctx.lineTo(7 * scale, -15 * scale);
  ctx.lineTo(-7 * scale, -15 * scale);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

function drawJettKunaiRing(entity) {
  const ultimate = entity?.ultimate;
  if (!entity?.alive || ultimate?.type !== "jett") return;
  const maxKnives = ultimate.maxKnives || 6;
  const knives = Math.max(0, Math.min(maxKnives, ultimate.knives || 0));
  const radius = entity.r + 28;
  for (let i = 0; i < maxKnives; i++) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / maxKnives;
    const filled = i < knives;
    const x = entity.x + Math.cos(angle) * radius;
    const y = entity.y + Math.sin(angle) * radius;
    drawKunaiShape(x, y, angle + Math.PI / 2, 0.82, filled ? 0.92 : 0.18);
  }
}

function drawAgentScreenEffects() {
  const playerSmoke = entityInsideSmoke(game.player);

  if (playerSmoke?.omenSmoke) {
    ctx.save();
    ctx.fillStyle = "rgba(22, 18, 38, 0.16)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.16, canvas.width / 2, canvas.height / 2, canvas.width * 0.58);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(12, 8, 24, 0.46)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  if (game.neonVignette > 0) {
    ctx.save();
    const alpha = Math.min(0.34, game.neonVignette * 0.26);
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.22, canvas.width / 2, canvas.height / 2, canvas.width * 0.72);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0, 217, 255, ${alpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  if (game.player?.ultimate?.type === "neon") {
    ctx.save();
    const pulse = .12 + (Math.sin(performance.now() / 85) + 1) * .035;
    const overload = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * .18, canvas.width / 2, canvas.height / 2, canvas.width * .72);
    overload.addColorStop(0, "rgba(0,0,0,0)");
    overload.addColorStop(.72, `rgba(0,217,255,${pulse * .45})`);
    overload.addColorStop(1, `rgba(125,249,255,${pulse})`);
    ctx.fillStyle = overload;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  if (game.player?.ultimate?.type === "yoru") {
    ctx.save();
    ctx.fillStyle = "rgba(16, 46, 140, 0.16)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 140, canvas.width / 2, canvas.height / 2, canvas.width * 0.65);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(4, 12, 42, 0.72)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  if (game.screenTint) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, game.screenTint.life / game.screenTint.maxLife);
    ctx.fillStyle = game.screenTint.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

function drawOmenUltimateOverlay() {
  if (!game.omenUlt) return;
  const state = game.omenUlt;
  const fade = Math.max(0, Math.min(1, state.fade ?? 1));
  ctx.save();
  ctx.fillStyle = `rgba(4, 4, 12, ${0.48 * fade})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const pulse = 1 + Math.sin(performance.now() / 160) * 0.05;
  const valid = state.state === "select" && isValidOmenTeleportPoint(mouse, game.player);
  if (state.state === "select") {
    ctx.strokeStyle = valid ? "rgba(109, 255, 165, 0.94)" : "rgba(255, 76, 97, 0.94)";
    ctx.fillStyle = valid ? "rgba(109, 255, 165, 0.12)" : "rgba(255, 76, 97, 0.12)";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, (game.player?.r || 18) * 1.8 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(mouse.x - 18, mouse.y);
    ctx.lineTo(mouse.x + 18, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 18);
    ctx.lineTo(mouse.x, mouse.y + 18);
    ctx.stroke();
    ctx.fillStyle = "#d8ccff";
    ctx.font = "800 16px Rajdhani, Arial";
    ctx.textAlign = "center";
    ctx.fillText(valid ? "DESTINO" : "BLOQUEADO", mouse.x, mouse.y - 32);
    ctx.fillText(`${Math.ceil(state.timer || 0)}s`, canvas.width / 2, 82);
  } else if (state.state === "travel" && state.destination) {
    ctx.fillStyle = "rgba(155, 92, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(state.destination.x, state.destination.y, 34 * pulse, 0, Math.PI * 2);
    ctx.fill();
  }
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
  if (game.tutorial) {
    ctx.fillStyle = game.tutorialStep === 2 ? "rgba(1, 6, 10, 0.48)" : "rgba(1, 6, 10, 0.28)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // ── Névoa desenhada AQUI: antes de qualquer entidade.
  // Isso garante que bots, aliados e o jogador sejam renderizados
  // POR CIMA da camada de fóg, eliminando o efeito de piscar.
  drawFogOfWar();
  drawMedkitsAndOrbs();
  drawAgentObjects();

  for (const zone of game.shadowZones) {
    if (!estaNoCampoDeVisao(zone, zone.r || 80)) continue;
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
    if (!estaNoCampoDeVisao(smoke, smoke.r || 90)) continue;
    const fade = smoke.viperPit ? Math.max(0, Math.min(1, (smoke.exitTimer ?? 3) / (smoke.fadeLife || 3))) : 1;
    const alpha = smoke.viperPit ? 0.22 + 0.4 * fade : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (smoke.viperPit) {
      const gradient = ctx.createRadialGradient(smoke.x, smoke.y, smoke.r * 0.12, smoke.x, smoke.y, smoke.r);
      gradient.addColorStop(0, "rgba(216, 255, 84, 0.28)");
      gradient.addColorStop(0.48, "rgba(45, 199, 93, 0.66)");
      gradient.addColorStop(1, "rgba(8, 50, 31, 0.18)");
      ctx.fillStyle = gradient;
    } else if (smoke.omenSmoke) {
      const gradient = ctx.createRadialGradient(smoke.x, smoke.y, smoke.r * 0.1, smoke.x, smoke.y, smoke.r);
      gradient.addColorStop(0, "rgba(96, 76, 132, 0.62)");
      gradient.addColorStop(0.62, "rgba(57, 47, 82, 0.72)");
      gradient.addColorStop(1, "rgba(23, 19, 37, 0.28)");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = smoke.poison ? "rgba(47, 179, 78, 0.62)" : "rgba(82, 71, 115, 0.78)";
    }
    ctx.beginPath();
    ctx.arc(smoke.x, smoke.y, smoke.r, 0, Math.PI * 2);
    ctx.fill();
    if (smoke.poison) {
      ctx.strokeStyle = smoke.viperPit ? "rgba(188, 255, 89, 0.72)" : "rgba(121, 255, 139, 0.82)";
      ctx.lineWidth = smoke.viperPit ? 5 : 3;
      ctx.stroke();
    }
    if (smoke.viperPit) {
      ctx.strokeStyle = "rgba(255, 230, 92, 0.28)";
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 12]);
      ctx.lineDashOffset = -(smoke.visualPhase || 0) * 34;
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, smoke.r * 0.74, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(219, 255, 150, 0.86)";
      ctx.font = "800 14px Rajdhani, Arial";
      ctx.textAlign = "center";
      ctx.fillText("35 DPS", smoke.x, smoke.y - smoke.r - 10);
      ctx.fillStyle = "rgba(229, 255, 120, 0.82)";
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, 5, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 14; i++) {
        const orbit = smoke.r * (0.22 + (i % 5) * 0.13);
        const angle = (smoke.visualPhase || 0) * (0.6 + (i % 3) * 0.2) + i * 2.37;
        ctx.fillStyle = `rgba(192, 255, 98, ${0.18 + (i % 3) * 0.05})`;
        ctx.beginPath();
        ctx.arc(smoke.x + Math.cos(angle) * orbit, smoke.y + Math.sin(angle * 0.9) * orbit, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (smoke.omenSmoke) {
      ctx.strokeStyle = "rgba(161, 130, 220, 0.34)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 10]);
      ctx.lineDashOffset = -(smoke.visualPhase || 0) * 24;
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, smoke.r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < 8; i++) {
        const angle = (smoke.visualPhase || 0) * 0.42 + i * 0.78;
        const orbit = smoke.r * (0.28 + (i % 4) * 0.12);
        ctx.fillStyle = "rgba(194, 178, 255, 0.16)";
        ctx.beginPath();
        ctx.arc(smoke.x + Math.cos(angle) * orbit, smoke.y + Math.sin(angle) * orbit, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  drawSpike();
  if (!game.tutorial || game.tutorialStep === 2) drawObjectiveHints();

  for (const ghost of game.dashGhosts) {
    if (!estaNoCampoDeVisao(ghost, ghost.r || 18)) continue;
    const alpha = Math.max(0, ghost.life / ghost.maxLife) * 0.34;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, ghost.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const bot of game.bots) {
    if (!isBotVisible(bot)) continue;
    const visible = game.revealTimer > 0 || hasLineOfSight(game.player, bot);
    const label = `${bot.side === "attackers" ? "ATK" : "DEF"} ${bot.weapon?.name || "Pistol"}`;
    const color = bot.side === "attackers" ? "#ff8a5b" : "#4fb3ff";
    drawEntity(bot, visible ? color : "#274351", visible ? label : "", "bot");
  }
  for (const ally of game.allies) {
    if (!ally.alive) continue;
    const inFov = estaNoCampoDeVisao(ally, ally.r || 0);
    if (inFov) {
      // Aliado visível normalmente dentro do FOV
      drawEntity(ally, "#62e6a0", `ALLY ${ally.weapon?.name || "Pistol"}`, "ally");
    } else if (game.fovMode) {
      // Radar tático: aliado fora do FOV aparece como círculo verde semitransparente
      // (sempre visível para controle de equipe, igual a um radar de squad)
      ctx.save();
      ctx.globalAlpha = 0.72;
      ctx.strokeStyle = "#62e6a0";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(ally.x, ally.y, (ally.r || 18) + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#62e6a0";
      ctx.fill();
      ctx.restore();
    } else {
      // FOV desligado: comportamento normal, aliado sempre visível
      drawEntity(ally, "#62e6a0", `ALLY ${ally.weapon?.name || "Pistol"}`, "ally");
    }
  }
  if (!game.player?.untargetable) {
    drawEntity(game.player, game.selectedAgent.color, game.playerSide === "attackers" ? "YOU ATK" : "YOU DEF", "player");
  }
  drawJettKunaiRing(game.player);
  drawSandboxOverlay();
  drawWorldActionBar();
  drawOrbChannelBars();
  drawUltimateEffects();
  drawOmenUltimateOverlay();

  ctx.fillStyle = "#f8fafc";
  for (const bullet of game.bullets) {
    if (!estaNoCampoDeVisao(bullet, bullet.knife ? 10 : 4)) continue;
    if (bullet.knife) {
      drawKunaiShape(bullet.x, bullet.y, (bullet.angle ?? Math.atan2(bullet.vy, bullet.vx)) + Math.PI / 2, 0.72, 1);
    } else {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const particle of game.particles) {
    if (!estaNoCampoDeVisao(particle, particle.size || 4)) continue;
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const marker of game.hitMarkers) {
    if (!estaNoCampoDeVisao(marker, 24)) continue;
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
    if (!estaNoCampoDeVisao(explosion, explosion.r || 24)) continue;
    const alpha = Math.max(0, explosion.life / explosion.maxLife);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = explosion.color || "#ffd166";
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
  }
  if (!game.tutorial || game.tutorialStep > 0) drawCrosshair();
  drawDamageFlash();
  drawShadowBlindness();
  drawAgentScreenEffects();
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
  setText(ui.sidePill, game.outbreak ? "OB" : atk ? "ATK" : "DEF");
  setClassName(ui.sidePill, "hud-pill side-pill " + (game.outbreak ? "outbreak" : atk ? "atk" : "def"));

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

  const isNeon = game.selectedAgent?.id === "neon";
  const staminaRatio = Math.max(0, Math.min(1, (game.neonStamina || 0) / 100));
  toggleClass(ui.neonStaminaWrap, "hidden", !isNeon);
  toggleClass(ui.neonStaminaWrap, "low", isNeon && staminaRatio <= 0.25);
  toggleClass(ui.neonStaminaWrap, "mid", isNeon && staminaRatio > 0.25 && staminaRatio <= 0.58);
  toggleClass(ui.neonStaminaWrap, "flash", isNeon && game.neonStaminaFlash > 0);
  if (ui.neonStaminaBar) ui.neonStaminaBar.style.transform = `scaleX(${staminaRatio})`;

  const jettUltimate = game.player?.ultimate?.type === "jett" ? game.player.ultimate : null;
  toggleClass(ui.jettKnifeHud, "hidden", !jettUltimate);
  if (jettUltimate) setText(ui.jettKnifeHud, `${jettUltimate.knives || 0}/${jettUltimate.maxKnives || 6}`);

  setText(ui.phase, game.paused
    ? "Pause"
    : game.phase === "buy"
        ? "Compra"
        : game.phase === "action"
          ? "Round"
          : game.phase === "matchOver"
            ? "Partida"
            : "Fim");
  const timerLabel = game.outbreak
    ? formatSurvivalTime(game.outbreakElapsed)
    : game.spike.state === "planted"
    ? `Spike ${Math.max(0, Math.ceil(game.spike.timer))}`
    : game.sandbox || game.training ? "∞" : t.toString();
  setText(ui.timer, timerLabel);
  setText(ui.score, game.outbreak ? `ONDA ${game.outbreakWave}` : `${game.playerScore} - ${game.enemyScore}`);

  // Money com delta
  const newMoney = game.money;
  if (newMoney !== lastMoney) flashMoneyDelta(newMoney);
  setText(ui.money, `${newMoney}`);

  setText(ui.agent, `${game.playerName} · ${game.selectedAgent.name} ${game.outbreak ? "OUTBREAK" : atk ? "ATK" : "DEF"} · ${game.sandbox ? "E livre" : game.abilityCooldown > 0 ? `${Math.ceil(game.abilityCooldown)}s` : "E"}`);
  setText(ui.weapon, game.selectedWeapon.name);
  setText(ui.hp, `${Math.max(0, Math.ceil(game.player.hp))}`);
  const ultCost = getUltCost(game.player);
  const ultReady = getUltimatePoints(game.player) >= ultCost;
  setText(ui.ultPoints, game.sandbox ? "∞" : `${getUltimatePoints(game.player)}/${ultCost}`);
  toggleClass(ui.ultCounter, "ready", game.sandbox || ultReady);
  toggleClass(ui.ultCounter, "warning", game.ultFlashTimer > 0 && !ultReady);
  toggleClass(ui.ultCounter, "pulse", game.ultFlashTimer > 0);
  const ultimateAmmo = game.player.ultimate?.type === "jett"
    ? `${game.player.ultimate.knives || 0}/${game.player.ultimate.maxKnives || 6} dardos`
    : game.player.ultimate?.type === "raze"
      ? (game.player.ultimate.fired ? "Foguete usado" : "Foguete pronto")
      : null;
  setText(ui.ammo, ultimateAmmo || (game.reloadTimer > 0 ? "Recarregando" : `${game.player.ammo}`));
  setText(ui.spike, game.outbreak ? `Onda ${game.outbreakWave}` : game.spike.state === "carried"
    ? game.spike.owner === "player" ? "Com você" : "Em transporte"
    : game.spike.state === "dropped"
      ? "Derrubada"
    : game.spike.state === "planted"
      ? (game.spike.defuseProgress > 0 ? `Defuse ${Math.round(game.spike.defuseProgress * 100)}%` : `${Math.ceil(game.spike.timer)}s`)
      : "Plantando");
  toggleClass(ui.spike, "planted", spikePlanted);
  toggleClass(ui.vitalsPanel, "hidden", game.outbreak);
  setStyle(ui.hpBar, "transform", `scaleX(${Math.max(0, game.player.hp) / game.player.maxHp})`);
  setStyle(ui.ammoBar, "transform", `scaleX(${game.reloadTimer > 0 ? 1 - game.reloadTimer / currentReloadTime() : game.player.ammo / currentMagSize()})`);
  setText(ui.message?.querySelector?.("strong"), game.message);
  setText(ui.message?.querySelector?.("span"), game.paused
    ? (game.menuState === "pause" ? "Jogo pausado. Aperte Esc ou P para continuar." : "Escolha uma opção no menu.")
    : game.playerSide === "attackers"
      ? "WASD move, E habilidade, Q Ultimate, F planta, B loja, Esc pause."
      : "WASD move, E habilidade, Q Ultimate, F desarma, B loja, Esc pause.");
  toggleClass(ui.sandboxTools, "hidden", !game.sandbox || game.menuState !== "none");
  toggleClass(ui.sandboxPanel, "hidden", !game.sandbox || !game.sandboxPanelOpen);
  toggleClass(ui.pauseSandboxButton, "hidden", !game.sandbox);
  setText(ui.godModeButton, `God: ${game.godMode ? "ON" : "OFF"}`);
  setSwitch(ui.sandboxGodToggle, game.godMode);
  setSwitch(ui.sandboxPierceWallsToggle, game.sandboxBulletsPierceWalls);
  updateScoreboard();
  const gameplayHudVisible = game.menuState === "none" && ["buy", "action", "ended"].includes(game.phase);
  const tutorialActive = game.tutorial && game.menuState === "none";
  const shopOpen = isShopOpen();
  toggleClass(ui.topHud, "hidden", !gameplayHudVisible || tutorialActive || shopOpen);
  toggleClass(ui.message, "hidden", !gameplayHudVisible || tutorialActive || shopOpen || !settings.showTips || game.messageTimer <= 0);
  toggleClass(ui.killFeed, "hidden", shopOpen || !settings.showKillFeed);
  setStyle(ui.killFeed, "transform", `scale(${Math.max(0.5, Math.min(2, (settings.killFeedScale || 100) / 100))})`);
  toggleClass(ui.scoreboard, "hidden", shopOpen || !game.scoreboardVisible);
  if (canvas?.style) canvas.style.cursor = game.omenUlt?.state === "select" ? "crosshair" : "";
  const metricsVisible = gameplayHudVisible && !shopOpen && (game.showFps || game.showPing);
  toggleClass(ui.fpsCounter, "hidden", !metricsVisible);
  if (ui.fpsCounter && metricsVisible) {
    const metrics = [];
    if (game.showFps) metrics.push(`${game.currentFps || 0} FPS`);
    if (game.showPing) metrics.push(`${game.pingMs || 0} MS`);
    ui.fpsCounter.textContent = metrics.join("  |  ");
  }
  const gameWrap = document.querySelector(".game-wrap");
  gameWrap?.classList.toggle("gameplay-ui-hidden", !gameplayHudVisible || shopOpen);
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
  if (ui.shop?.classList.contains("hidden")) {
    openShop();
  } else {
    closeShop();
    updateUi();
  }
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

function setSandboxTab(tab) {
  game.sandboxTab = tab || "bots";
  ui.sandboxTabs?.querySelectorAll("[data-sandbox-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sandboxTab === game.sandboxTab);
  });
  document.querySelectorAll("[data-sandbox-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.sandboxPanel !== game.sandboxTab);
  });
}

function setSwitch(button, enabled) {
  button?.classList.toggle("is-on", !!enabled);
}

function populateSandboxSelectors() {
  if (ui.sandboxBotAgent && !ui.sandboxBotAgent.children.length) {
    ui.sandboxBotAgent.innerHTML = agents.map((agent) => `<option value="${agent.id}">${agent.name}</option>`).join("");
  }
  if (ui.sandboxMapSelect && !ui.sandboxMapSelect.children.length) {
    ui.sandboxMapSelect.innerHTML = MAPS.map((item, index) => `<option value="${index}">${item.name}</option>`).join("");
  }
}

function renderSandboxBotList() {
  if (!ui.sandboxBotList) return;
  const entities = [
    ...game.bots.map((entity) => ({ entity, team: "enemy" })),
    ...game.allies.map((entity) => ({ entity, team: "ally" })),
  ].filter((item) => item.entity?.alive);
  if (!entities.length) {
    ui.sandboxBotList.innerHTML = `<p>Nenhum bot ativo. Use "Posicionar no mapa" ou clique direito/esquerdo no mapa.</p>`;
    return;
  }
  ui.sandboxBotList.innerHTML = "";
  for (const { entity, team } of entities) {
    const row = document.createElement("div");
    row.className = `sandbox-bot-row ${team}`;
    const agent = agents.find((item) => item.id === entity.agentId)?.name || "Agente";
    row.innerHTML = `
      <span><b>${team === "ally" ? "Aliado" : "Inimigo"}</b><em>${agent} · ${entity.sandboxBehavior || entity.aiState || "combat"}</em></span>
      <button type="button" data-action="toggle-shoot">${entity.sandboxCanShoot === false ? "Sem tiro" : "Atira"}</button>
      <button type="button" data-action="toggle-move">${entity.sandboxCanMove === false ? "Parado" : "Move"}</button>
      <button type="button" data-action="remove">Remover</button>
    `;
    row.querySelector('[data-action="toggle-shoot"]')?.addEventListener("click", () => {
      entity.sandboxCanShoot = entity.sandboxCanShoot === false;
      renderSandboxPanel();
    });
    row.querySelector('[data-action="toggle-move"]')?.addEventListener("click", () => {
      entity.sandboxCanMove = entity.sandboxCanMove === false;
      entity.speed = entity.sandboxCanMove ? (team === "ally" ? 126 : 118) : 0;
      renderSandboxPanel();
    });
    row.querySelector('[data-action="remove"]')?.addEventListener("click", () => {
      entity.alive = false;
      spawnParticles(entity.x, entity.y, team === "ally" ? "#62e6a0" : "#ff4d5d", 12, 100);
      game.bots = game.bots.filter((bot) => bot.alive);
      game.allies = game.allies.filter((ally) => ally.alive);
      renderSandboxPanel();
      setMessage("Sandbox: bot removido.");
    });
    ui.sandboxBotList.appendChild(row);
  }
}

function renderSandboxPanel() {
  populateSandboxSelectors();
  ui.sandboxPanel?.classList.toggle("hidden", !game.sandbox || !game.sandboxPanelOpen);
  setSandboxTab(game.sandboxTab);
  setSwitch(ui.sandboxPierceWallsToggle, game.sandboxBulletsPierceWalls);
  setSwitch(ui.sandboxGodToggle, game.godMode);
  setSwitch(ui.sandboxBlackoutToggle, game.fovMode);
  renderSandboxBotList();
}

function openSandboxPanel() {
  if (!game.sandbox) return;
  closeShop();
  game.sandboxPanelOpen = true;
  renderSandboxPanel();
}

function closeSandboxPanel() {
  const resumeSandbox = game.sandbox && game.paused && game.menuState === "none";
  game.sandboxPanelOpen = false;
  cancelSandboxPlacement();
  if (resumeSandbox) game.paused = false;
  renderSandboxPanel();
}

function loadSandboxMap(index) {
  const next = MAPS[Number(index)] || MAPS[0];
  map = next;
  map.botRoutes = randomizedBotRoutes(map);
  game.map = map;
  game.mapName = map.name;
  game.bots = [];
  game.allies = [];
  game.bullets = [];
  game.destructibles = cloneRects(map.destructibles || []);
  resetFogRenderState();
  game.sandboxCustomWalls = [];
  game.medkits = [];
  game.ultOrbs = [];
  game.spike.state = "disabled";
  game.player.x = map.attackersSpawn.x;
  game.player.y = map.attackersSpawn.y;
  sanitizeEntityPosition(game.player);
  renderSandboxPanel();
  setMessage(`Sandbox: mapa ${map.name} carregado.`);
}

function saveSandboxConfig() {
  const payload = {
    mapName: game.mapName,
    pierce: game.sandboxBulletsPierceWalls,
    god: game.godMode,
    walls: game.sandboxCustomWalls,
    medkits: game.medkits,
    ultOrbs: game.ultOrbs,
    spike: game.spike,
  };
  localStorage.setItem(SANDBOX_SAVE_KEY, JSON.stringify(payload));
  setMessage("Sandbox: configuração salva.");
}

function loadSandboxConfig() {
  try {
    const payload = JSON.parse(localStorage.getItem(SANDBOX_SAVE_KEY) || "null");
    if (!payload) {
      setMessage("Sandbox: nenhum save encontrado.");
      return;
    }
    const index = MAPS.findIndex((item) => item.name === payload.mapName);
    if (index >= 0) loadSandboxMap(index);
    game.sandboxBulletsPierceWalls = !!payload.pierce;
    game.godMode = !!payload.god;
    game.sandboxCustomWalls = cloneRects(payload.walls || []);
    game.destructibles = [...cloneRects(map.destructibles || []), ...game.sandboxCustomWalls];
    game.medkits = (payload.medkits || []).map((item) => ({ ...item }));
    game.ultOrbs = (payload.ultOrbs || []).map((item) => ({ ...item }));
    if (payload.spike) game.spike = { ...game.spike, ...payload.spike };
    renderSandboxPanel();
    setMessage("Sandbox: configuração restaurada.");
  } catch {
    setMessage("Sandbox: save inválido.");
  }
}

function handleEscape() {
  if (game.omenUlt) {
    cancelOmenUltimate();
    return;
  }
  if (game.sandboxPlacement) {
    cancelSandboxPlacement();
    setMessage("Sandbox: posicionamento cancelado.");
    return;
  }
  if (game.sandboxPanelOpen) {
    closeSandboxPanel();
    return;
  }
  if (game.menuState === "pause") {
    resumeFromPause();
    return;
  }
  if (game.menuState === "difficulty") {
    showModeSelect(true);
    return;
  }
  if (game.menuState === "mode-select") {
    showMainMenu();
    return;
  }
  if (game.menuState === "options") {
    backFromOptions();
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
  ui.menuButtons.className = "menu-grid menu-grid-unified";
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
      button.innerHTML = `${mainMenuIconSvg(item.icon || "star")}<b>${item.label}</b>`;
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
  window.lucide?.createIcons();
  ui.menuOverlay.className = `menu-overlay menu-state-${state}`;
  ui.menuOverlay?.classList.remove("hidden");
  game.paused = true;
  game.menuState = state;
}

function mainMenuIconSvg(icon) {
  const icons = {
    gamepad: {
      lucide: "play",
      fallback: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="6,3 20,12 6,21 6,3"></polygon></svg>',
    },
    tools: {
      lucide: "settings-2",
      fallback: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>',
    },
    money: {
      lucide: "box",
      fallback: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
    },
    star: {
      lucide: "dumbbell",
      fallback: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6.5 6.5 11 11"></path><path d="m21 21-1-1"></path><path d="m3 3 1 1"></path><path d="m18 22 4-4"></path><path d="m2 6 4-4"></path><path d="m3 10 7-7"></path><path d="m14 21 7-7"></path></svg>',
    },
    link: {
      lucide: "lightbulb",
      fallback: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 14c.2-1 .7-1.7 1.5-2.5A4.8 4.8 0 0 0 18 8 6 6 0 0 0 6 8c0 1.2.5 2.5 1.5 3.5.7.7 1.2 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M10 14h4"></path></svg>',
    },
    stats: {
      lucide: "chart-no-axes-column-increasing",
      fallback: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20V10"></path><path d="M10 20V4"></path><path d="M16 20v-7"></path><path d="M22 20V7"></path></svg>',
    },
  };
  const selected = icons[icon] || icons.star;
  return `<span class="menu-icon" data-lucide="${selected.lucide}" aria-hidden="true">${selected.fallback}</span>`;
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

function agentFallbackArt(agent, type = "artwork") {
  const color = encodeURIComponent(agent.color || "#ff4655");
  const name = encodeURIComponent(agent.name || "Agent");
  const small = type === "icon";
  const svg = small
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#101820"/><circle cx="60" cy="48" r="28" fill="${color}"/><path d="M22 112c8-28 28-42 38-42s30 14 38 42" fill="${color}" opacity=".72"/><text x="60" y="110" text-anchor="middle" font-family="Arial" font-size="18" fill="#fff">${name}</text></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 720"><defs><radialGradient id="g" cx="50%" cy="34%" r="60%"><stop stop-color="${color}" stop-opacity=".9"/><stop offset="1" stop-color="#0f1923"/></radialGradient></defs><rect width="520" height="720" fill="#0f1923"/><rect width="520" height="720" fill="url(#g)"/><circle cx="260" cy="210" r="92" fill="${color}" opacity=".92"/><path d="M118 680c24-190 102-310 142-310s118 120 142 310z" fill="${color}" opacity=".78"/><path d="M86 560c90-88 258-88 348 0" fill="none" stroke="#fff" stroke-width="18" opacity=".18"/><text x="260" y="104" text-anchor="middle" font-family="Arial" font-size="58" font-weight="700" fill="#fff">${name}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function agentPresentation(agent) {
  const details = {
    neon: {
      className: "Duelista",
      tagline: "Velocidade e avanço agressivo",
      ultimate: "Sobrecarga Cinética",
      icon: "./assets/images/Neon_icon.webp",
      artwork: "./assets/images/Neon_Artwork_Full.webp",
    },
    viper: {
      className: "Controladora",
      tagline: "Domínio territorial com toxinas",
      ultimate: "Poço Químico",
      icon: "./assets/images/Viper_icon.webp",
      artwork: "./assets/images/Viper_Artwork_Full.webp",
    },
    sage: {
      className: "Sentinela",
      tagline: "Sustentação e recuperação da equipe",
      ultimate: "Restauração Total",
      icon: "./assets/images/Sage_icon.webp",
      artwork: "./assets/images/Sage_Artwork_Full.webp",
    },
    omen: {
      className: "Controlador",
      tagline: "Cegueira e redução de mobilidade",
      ultimate: "Domínio das Sombras",
      icon: "./assets/images/Omen_icon.webp",
      artwork: "./assets/images/Omen_Artwork_Full.webp",
    },
    jett: {
      className: "Duelista",
      tagline: "Mobilidade explosiva, facas precisas e pressão constante",
      ultimate: "Tormenta de Aço",
      icon: "./assets/images/Jett_icon.webp",
      artwork: "./assets/images/Jett_Artwork_Full.webp",
    },
    killjoy: {
      className: "Sentinela",
      tagline: "Controle de área com torreta e confinamento tático",
      ultimate: "Confinamento",
      icon: "./assets/images/Killjoy_icon.webp",
      artwork: "./assets/images/Killjoy_Artwork_Full.webp",
    },
    raze: {
      className: "Duelista",
      tagline: "Explosivos, dano em área e entrada agressiva",
      ultimate: "Estraga-prazeres",
      icon: "./assets/images/Raze_icon.webp",
      artwork: "./assets/images/Raze_Artwork_Full.webp",
    },
    yoru: {
      className: "Duelista",
      tagline: "Infiltração, fendas dimensionais e reposicionamento",
      ultimate: "Espionagem Dimensional",
      icon: "./assets/images/Yoru_icon.webp",
      artwork: "./assets/images/Yoru_Artwork_Full.webp",
    },
  };
  return details[agent.id] || {
    className: agent.role,
    tagline: agent.ability,
    ultimate: "Ultimate",
    icon: agentFallbackArt(agent, "icon"),
    artwork: agentFallbackArt(agent, "artwork"),
  };
}

const agentArtworkCache = new Map();

function preloadAgentAsset(src) {
  if (!src) return Promise.resolve("");
  const cached = agentArtworkCache.get(src);
  if (cached) return cached.promise;
  const image = new Image();
  const promise = new Promise((resolve) => {
    image.onload = () => {
      if (image.decode) {
        image.decode().catch(() => {}).finally(() => resolve(src));
        return;
      }
      resolve(src);
    };
    image.onerror = () => resolve(src);
  });
  image.src = src;
  agentArtworkCache.set(src, { image, promise });
  return promise;
}

// ── Pré-carrega as artes grandes dos agentes assim que o jogo abre, em segundo plano,
// para que já estejam prontas (baixadas + decodificadas) quando o jogador chegar
// na tela de seleção de agente, em vez de começar a carregar só nesse momento.
function preloadAllAgentArtworks() {
  for (const agent of agents) {
    const presentation = agentPresentation(agent);
    preloadAgentAsset(presentation.icon);
    preloadAgentAsset(presentation.artwork);
  }
}

function preloadInitialVisualAssets() {
  preloadAllAgentArtworks();
  preloadAllWeaponImages();
  preloadWeaponSprites();
}

if ("requestIdleCallback" in window) {
  requestIdleCallback(preloadInitialVisualAssets, { timeout: 800 });
} else {
  setTimeout(preloadInitialVisualAssets, 150);
}

function showAgentSelect(onPick, returnState = "main") {
  closeShop();
  game.agentReturnState = returnState;
  const selector = ui.agentSelectGrid.parentElement;
  selector.querySelector(".agent-preview")?.remove();
  ui.agentSelectGrid.innerHTML = "";
  ui.agentSelectGrid.classList.remove("has-selection");
  for (const agent of agents) {
    const presentation = agentPresentation(agent);
    preloadAgentAsset(presentation.icon);
    preloadAgentAsset(presentation.artwork);
  }

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
  let previewRenderId = 0;

  const renderPreview = (agent) => {
     const renderId = ++previewRenderId;
     const presentation = agentPresentation(agent);
     preview.style.setProperty("--agent-color", agent.color);
     preview.dataset.agent = agent.id;
     const previewImage = preview.querySelector(".agent-preview-art img");
     previewImage.alt = `Arte da agente ${agent.name}`;
     previewImage.classList.add("is-loading");
     previewImage.removeAttribute("src");
     preview.querySelector(".agent-class").textContent = presentation.className;
     preview.querySelector("h3").textContent = agent.name;
     preview.querySelector("p").textContent = presentation.tagline;
     preview.querySelector(".ability-chip-basic b").textContent = agent.ability;
     const cooldownEl = preview.querySelector(".agent-ability-cooldown");
     if (cooldownEl) cooldownEl.textContent = `(${agent.cooldown}s recarga)`;
     preview.querySelector(".ability-chip-ultimate b").textContent = presentation.ultimate;
     preloadAgentAsset(presentation.artwork).then((src) => {
       if (renderId !== previewRenderId) return;
       previewImage.src = src;
       requestAnimationFrame(() => previewImage.classList.remove("is-loading"));
     });
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
  if (game.outbreak) {
    startOutbreakMode();
  } else if (game.training) {
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
  openOptionsMenu("pause");
}

function quitToMainMenu() {
  hidePauseOverlay();
  showMainMenu();
}

function setFovMode(enabled) {
  game.fovMode = Boolean(enabled);
  resetFogRenderState();
  localStorage.setItem(FOV_STORAGE_KEY, game.fovMode ? "on" : "off");
  setMessage(game.fovMode ? "Modo Blackout ativado." : "Modo Blackout desativado.");
  // Atualiza o visual do switch onde quer que ele esteja renderizado
  document.querySelectorAll(".fov-mode-switch button").forEach((button) => {
    const active = button.dataset.fovMode === (game.fovMode ? "fog" : "normal");
    button.classList.toggle("active", active);
  });
}

function renderBlackoutSwitch(container) {
  container.querySelector(".fov-mode-switch")?.remove();
  const switcher = document.createElement("div");
  switcher.className = "fov-mode-switch";
  switcher.innerHTML = `
    <span>🌑 MODO BLACKOUT</span>
    <button type="button" data-fov-mode="normal">OFF</button>
    <button type="button" data-fov-mode="fog">ON</button>
  `;
  switcher.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.fovMode === (game.fovMode ? "fog" : "normal");
    button.classList.toggle("active", active);
    button.addEventListener("click", () => setFovMode(button.dataset.fovMode === "fog"));
  });
  container.prepend(switcher);
}

function showMainMenu() {
  preloadInitialVisualAssets();
  hidePauseOverlay();
  closeSandboxPanel();
  ui.introOverlay?.classList.add("hidden");
  ui.matchOverlay?.classList.add("hidden");
  ui.agentOverlay?.classList.add("hidden");
  ui.tutorialOverlay?.classList.add("hidden");
  closeShop();
  game.tutorial = false;
  game.outbreak = false;
  game.playMode = "default";
  game.outbreakWaveDelay = 0;
  ui.gameRoot?.classList.remove("outbreak-mode");
  game.tutorialStage = "idle";
  game.phase = "idle";
  game.clockActive = false;
  game.paused = false;
  game.menuMapTimer = 0;
  game.pauseReturnState = null;
  fullReset();
  setMenu("Valorant 2D", "", [
    { label: "JOGAR", icon: "gamepad", action: showModeSelect },
    { label: "OPÇÕES", icon: "tools", action: showOptionsMenu },
    { label: "ESTATÍSTICAS", icon: "stats", action: showStatisticsMenu },
    { label: "SANDBOX", icon: "money", action: startSandboxMode },
    { label: "TREINO", icon: "star", action: startTrainingMode },
    { label: "TUTORIAL", icon: "link", action: startTutorialMode },
  ], "MENU", "main");
}

const PLAY_MODE_OPTIONS = [
  {
    id: "default",
    name: "Default",
    icon: "D",
    description: "Combate tático e objetivo de Spike.",
  },
  {
    id: "blackout",
    name: "Blackout",
    icon: "B",
    description: "Visão restrita e leitura de campo.",
  },
  {
    id: "outbreak",
    name: "Outbreak",
    icon: "O",
    description: "Sobrevivência em ondas infinitas.",
  },
];

function showModeSelect(immediate = false) {
  if (!immediate && game.menuState === "main") {
    ui.menuOverlay?.classList.add("menu-carousel-out");
    window.setTimeout(() => {
      ui.menuOverlay?.classList.remove("menu-carousel-out");
      showModeSelect(true);
    }, 220);
    return;
  }
  setMenu("", "", [], "", "mode-select");
  renderModeSelect();
}

function renderModeSelect() {
  if (!ui.menuButtons) return;
  ui.menuButtons.className = "mode-select-shell";
  ui.menuButtons.innerHTML = `
    <header class="mode-select-header">
      <span><i></i> MODOS DE JOGO</span>
      <h2>SELECIONE O PROTOCOLO</h2>
    </header>
    <div class="mode-select-grid"></div>
    <footer class="mode-select-footer">
      <button type="button" class="mode-select-back">VOLTAR AO MENU</button>
    </footer>`;
  const grid = ui.menuButtons.querySelector(".mode-select-grid");
  for (const option of PLAY_MODE_OPTIONS) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `mode-card mode-card-${option.id}`;
    card.innerHTML = `
      <span class="mode-card-icon" aria-hidden="true">${option.icon}</span>
      <strong>${option.name}</strong>
      <small>${option.description}</small>`;
    card.addEventListener("click", () => selectPlayMode(option.id));
    grid.appendChild(card);
  }
  ui.menuButtons.querySelector(".mode-select-back")?.addEventListener("click", showMainMenu);
}

function selectPlayMode(modeId) {
  game.playMode = modeId;
  if (modeId === "outbreak") {
    startOutbreakMode();
    return;
  }
  setFovMode(modeId === "blackout");
  showDifficultyMenu(true);
}

function statisticValue(value) {
  return Math.max(0, Number(value) || 0).toLocaleString("pt-BR");
}

function renderStatisticsPanel(statistics, message = "") {
  if (!ui.menuButtons) return;
  const games = Math.max(0, Number(statistics?.partidas_jogadas) || 0);
  const wins = Math.max(0, Number(statistics?.vitorias) || 0);
  const winRate = games ? Math.round((wins / games) * 100) : 0;
  ui.menuButtons.className = "statistics-shell";
  ui.menuButtons.innerHTML = `
    <div class="statistics-grid">
      <article><span>Partidas</span><strong>${statisticValue(games)}</strong></article>
      <article><span>Vitórias</span><strong>${statisticValue(wins)}</strong></article>
      <article><span>Taxa de vitória</span><strong>${winRate}%</strong></article>
      <article><span>Abates totais</span><strong>${statisticValue(statistics?.abates_totais)}</strong></article>
      <article class="statistics-highlight"><span>Pontuação máxima</span><strong>${statisticValue(statistics?.pontuacao_maxima)}</strong></article>
    </div>
    ${message ? `<p class="statistics-message">${message}</p>` : ""}
    <button type="button" class="statistics-back">Voltar</button>
  `;
  ui.menuButtons.querySelector(".statistics-back")?.addEventListener("click", showMainMenu);
}

async function showStatisticsMenu() {
  setMenu("Estatísticas", "", [], "PERFIL", "statistics");
  if (currentProfile?.isGuest) {
    renderStatisticsPanel({}, "Entre com uma conta para sincronizar suas estatísticas globais.");
    return;
  }
  const session = readStoredSession();
  if (!session?.token) {
    renderStatisticsPanel({}, "Sessão indisponível. Entre novamente.");
    return;
  }
  ui.menuButtons.className = "statistics-shell";
  ui.menuButtons.innerHTML = '<div class="statistics-loading"><span class="auth-loader"></span><strong>Carregando estatísticas</strong></div>';
  try {
    const payload = await requestApi("/api/statistics", {
      method: "GET",
      headers: { Authorization: `Bearer ${session.token}` },
    });
    renderStatisticsPanel(payload.statistics);
  } catch (error) {
    renderStatisticsPanel({}, error.message);
  }
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
  setMenu("", "", [], "", "difficulty");
  renderDifficultyMenu();
  void [
    { label: "FÁCIL", stars: 1, action: () => startMode("Fácil", "easy") },
    { label: "MÉDIO", stars: 2, action: () => startMode("Médio", "normal") },
    { label: "DIFÍCIL", stars: 3, action: () => startMode("Difícil", "hard") },
  ];
}

const DIFFICULTY_OPTIONS = [
  { id: "facil", label: "Fácil", mode: "Fácil", difficulty: "easy", stars: 1 },
  { id: "medio", label: "Médio", mode: "Médio", difficulty: "normal", stars: 2 },
  { id: "dificil", label: "Difícil", mode: "Difícil", difficulty: "hard", stars: 3 },
];

const difficultyIdByMode = {
  easy: "facil",
  normal: "medio",
  hard: "dificil",
};

let currentDifficulty = "medio";

function difficultyStarSvg(filled) {
  const fill = filled ? "#ff4655" : "none";
  const stroke = filled ? "#ff4655" : "#2a3a4a";
  const strokeWidth = filled ? "1" : "1.5";
  return `
    <svg class="difficulty-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    </svg>`;
}

function renderDifficultyMenu() {
  if (!ui.menuButtons) return;
  currentDifficulty = difficultyIdByMode[game.difficulty] || "medio";
  ui.menuButtons.innerHTML = "";
  ui.menuButtons.className = "difficulty-wrap";

  const header = document.createElement("div");
  header.className = "difficulty-header";
  header.innerHTML = `
    <div class="difficulty-breadcrumb">Jogar</div>
    <div class="difficulty-title">Dificuldade</div>`;

  const cards = document.createElement("div");
  cards.className = "difficulty-cards";

  for (const option of DIFFICULTY_OPTIONS) {
    const card = document.createElement("button");
    card.type = "button";
    card.id = `difficulty-card-${option.id}`;
    card.className = `difficulty-card ${option.id === currentDifficulty ? "active" : ""}`;
    card.dataset.difficultyId = option.id;
    card.innerHTML = `
      <div class="difficulty-stars" id="difficulty-stars-${option.id}">
        ${[1, 2, 3].map((star) => difficultyStarSvg(star <= option.stars)).join("")}
      </div>
      <div class="difficulty-card-name">${option.label}</div>`;
    card.addEventListener("click", () => pickDifficulty(option.id));
    card.addEventListener("dblclick", () => {
      pickDifficulty(option.id);
      startSelectedDifficulty();
    });
    cards.appendChild(card);
  }

  const footer = document.createElement("div");
  footer.className = "difficulty-footer";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "difficulty-back-btn";
  backButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Voltar`;
  backButton.addEventListener("click", () => showModeSelect(true));

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "difficulty-start-btn";
  startButton.textContent = "Iniciar Partida";
  startButton.addEventListener("click", startSelectedDifficulty);

  attachButtonFeedback(backButton);
  attachButtonFeedback(startButton);
  footer.append(backButton, startButton);
  renderBlackoutSwitch(footer);
  ui.menuButtons.append(header, cards, footer);
}

function pickDifficulty(id) {
  if (id === currentDifficulty) return;
  const previous = document.getElementById(`difficulty-card-${currentDifficulty}`);
  previous?.classList.remove("active");
  currentDifficulty = id;
  const card = document.getElementById(`difficulty-card-${id}`);
  card?.classList.add("active");
  const option = DIFFICULTY_OPTIONS.find((item) => item.id === id);
  if (option) animateDifficultyStars(id, option.stars);
}

function animateDifficultyStars(id, count) {
  const container = document.getElementById(`difficulty-stars-${id}`);
  if (!container) return;
  const stars = container.querySelectorAll(".difficulty-star");
  stars.forEach((star, index) => {
    star.classList.remove("pop", "fadein");
    void star.offsetWidth;
    if (index < count) {
      setTimeout(() => star.classList.add("fadein"), index * 60);
    } else {
      star.classList.add("pop");
    }
  });
}

function startSelectedDifficulty() {
  const option = DIFFICULTY_OPTIONS.find((item) => item.id === currentDifficulty) || DIFFICULTY_OPTIONS[1];
  startMode(option.mode, option.difficulty);
}

const OPTIONS_TABS = [
  { id: "general", label: "GERAL" },
  { id: "controls", label: "CONTROLES" },
  { id: "crosshair", label: "MIRA" },
  { id: "audio", label: "ÁUDIO" },
  { id: "video", label: "VÍDEO" },
  { id: "statistics", label: "ESTATÍSTICAS" },
];

const OPTIONS_STORAGE_KEY = "valorant2d-options";

const OPTIONS_DEFAULTS = {
  language: "pt-BR",
  playerName: "Player",
  showFps: false,
  showPing: false,
  showTips: true,
  showKillFeed: true,
  showMoneyDelta: true,
  killFeedScale: 100,
  messageDuration: 3,
  movementScheme: "wasd",
  mouseSensitivity: 50,
  adsSensitivity: 50,
  invertY: false,
  keys: { fire: "Mouse1", reload: "R", ability1: "E", ability2: "Q", interact: "F", neonRun: "Shift" },
  crosshairType: "default",
  crosshairColor: "#ffffff",
  crosshairCustomColor: "#ffffff",
  crosshairSize: 100,
  crosshairThickness: 2,
  crosshairOpacity: 100,
  crosshairGap: 6,
  masterVolume: 40,
  musicVolume: 50,
  sfxVolume: 80,
  voiceVolume: 70,
  muted: false,
  highlightSteps: true,
  impactEffects: true,
  displayMode: "window",
  resolution: "1280x720",
  fpsLimit: "120",
  vsync: true,
  quality: "high",
  brightness: 100,
  particles: true,
  bloodEffects: true,
  shadows: true,
};

function loadOptionsSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(OPTIONS_STORAGE_KEY) || "null");
    return saved ? { ...cloneOptions(OPTIONS_DEFAULTS), ...saved, keys: { ...OPTIONS_DEFAULTS.keys, ...(saved.keys || {}) } } : cloneOptions(OPTIONS_DEFAULTS);
  } catch {
    return cloneOptions(OPTIONS_DEFAULTS);
  }
}

let settings = loadOptionsSettings();
let optionsSettings = cloneOptions(settings);
audio.enabled = !settings.muted;
setMasterAudioVolume((Number.isFinite(Number(settings.masterVolume)) ? Number(settings.masterVolume) : OPTIONS_DEFAULTS.masterVolume) / 100);
game.playerName = settings.playerName?.trim?.() || OPTIONS_DEFAULTS.playerName;
game.showFps = Boolean(settings.showFps);
game.showPing = Boolean(settings.showPing);
game.arrowKeys = settings.movementScheme === "arrows";
game.crosshairScale = (Number(settings.crosshairSize) || 100) / 100;
document.documentElement.style.setProperty("--kill-feed-scale", String((Number(settings.killFeedScale) || 100) / 100));
let activeOptionsTab = "general";
let pendingKeyBind = null;
let optionsFeedback = "";
let optionsFeedbackTimer = null;
let optionsFeedbackId = 0;
let optionsStatisticsState = { status: "idle", data: null, message: "" };
let preferencesSaveTimer = null;
let preferencesRevision = 0;
let preferencesSyncedRevision = 0;

function cloneOptions(source) {
  if (source == null || typeof source !== "object") return source;
  return JSON.parse(JSON.stringify(source));
}

function createOptionElement(tag, className = "", html = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (html) element.innerHTML = html;
  return element;
}

function optionRow(label, control, hint = "") {
  const row = createOptionElement("div", "option-row");
  row.innerHTML = `<div class="option-row-copy"><span>${label}</span>${hint ? `<small>${hint}</small>` : ""}</div>`;
  row.appendChild(control);
  return row;
}

function optionSection(title, children) {
  const section = createOptionElement("section", "options-section");
  section.innerHTML = `<h3>${title}</h3>`;
  const body = createOptionElement("div", "options-section-body");
  children.forEach((child) => body.appendChild(child));
  section.appendChild(body);
  return section;
}

function setOptionValue(key, value) {
  optionsSettings[key] = value;
  queuePreferencesSync();
  renderOptionsMenu();
}

function normalizedOptions(source) {
  const candidate = source && typeof source === "object" ? source : {};
  return {
    ...cloneOptions(OPTIONS_DEFAULTS),
    ...candidate,
    keys: { ...OPTIONS_DEFAULTS.keys, ...(candidate.keys || {}) },
  };
}

function applyOptionsRuntime(source) {
  const next = normalizedOptions(source);
  settings = cloneOptions(next);
  game.arrowKeys = next.movementScheme === "arrows";
  game.crosshairStyle = next.crosshairType === "default" ? "default" : "minimal";
  game.crosshairScale = (Number(next.crosshairSize) || 100) / 100;
  game.playerName = currentProfile?.username || next.playerName.trim() || OPTIONS_DEFAULTS.playerName;
  game.showFps = Boolean(next.showFps);
  game.showPing = Boolean(next.showPing);
  game.hudOpacity = Math.max(.5, Math.min(1.5, Number(next.brightness) / 100));
  audio.enabled = !next.muted;
  setMasterAudioVolume((Number(next.masterVolume) || 0) / 100);
  document.documentElement.style.setProperty("--kill-feed-scale", String((Number(next.killFeedScale) || 100) / 100));
  try { localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(next)); } catch {}
  updateUi();
}

async function synchronizePreferencesFromServer() {
  const session = readStoredSession();
  if (!session?.token || currentProfile?.isGuest) return;
  const revisionAtStart = preferencesRevision;
  try {
    const payload = await requestApi("/api/preferences", {
      method: "GET",
      headers: { Authorization: `Bearer ${session.token}` },
    });
    // Não sobrescreve uma alteração feita enquanto a resposta estava em trânsito.
    if (revisionAtStart !== preferencesRevision) return;
    optionsSettings = normalizedOptions(payload.preferences);
    applyOptionsRuntime(optionsSettings);
    preferencesSyncedRevision = preferencesRevision;
    window.dispatchEvent(new CustomEvent("valorant2d:preferences-updated", { detail: cloneOptions(optionsSettings) }));
    if (game.menuState === "options") renderOptionsMenu(true);
  } catch (error) {
    console.warn("Não foi possível carregar as configurações globais:", error.message);
  }
}

function queuePreferencesSync() {
  preferencesRevision += 1;
  applyOptionsRuntime(optionsSettings);
  clearTimeout(preferencesSaveTimer);
  preferencesSaveTimer = window.setTimeout(savePreferencesToServer, 350);
}

async function savePreferencesToServer() {
  const revision = preferencesRevision;
  const session = readStoredSession();
  if (!session?.token || currentProfile?.isGuest || revision <= preferencesSyncedRevision) return;
  try {
    const payload = await requestApi("/api/preferences", {
      method: "PUT",
      headers: { Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ preferences: normalizedOptions(optionsSettings) }),
    });
    preferencesSyncedRevision = revision;
    window.dispatchEvent(new CustomEvent("valorant2d:preferences-updated", { detail: payload.preferences }));
    if (game.menuState === "options") showOptionsFeedback("Sincronizado na nuvem");
  } catch (error) {
    if (game.menuState === "options") showOptionsFeedback("Salvo neste dispositivo; nuvem indisponível");
  }
}

function showOptionsFeedback(text) {
  optionsFeedback = text;
  const feedbackId = ++optionsFeedbackId;
  clearTimeout(optionsFeedbackTimer);
  renderOptionsMenu(true);
  optionsFeedbackTimer = setTimeout(() => {
    if (feedbackId !== optionsFeedbackId) return;
    optionsFeedback = "";
    if (game.menuState === "options") renderOptionsMenu(true);
  }, 2000);
}

function ToggleSwitch(label, key, activeLabel = "LIG", inactiveLabel = "DESL") {
  const active = Boolean(optionsSettings[key]);
  const button = createOptionElement("button", `option-toggle ${active ? "is-active" : ""}`, active ? activeLabel : inactiveLabel);
  button.type = "button";
  button.addEventListener("click", () => setOptionValue(key, !active));
  attachButtonFeedback(button);
  return optionRow(label, button);
}

function ToggleGroup(label, key, options) {
  const group = createOptionElement("div", "option-toggle-group");
  options.forEach((option) => {
    const button = createOptionElement("button", optionsSettings[key] === option.value ? "is-active" : "", option.label);
    button.type = "button";
    button.addEventListener("click", () => setOptionValue(key, option.value));
    attachButtonFeedback(button);
    group.appendChild(button);
  });
  return optionRow(label, group);
}

function SettingSlider(label, key, min, max, step = 1, unit = "") {
  const wrap = createOptionElement("div", "option-slider");
  const input = createOptionElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = optionsSettings[key];
  const value = createOptionElement("strong", "", `${optionsSettings[key]}${unit}`);
  input.addEventListener("input", () => {
    const parsed = Number(step) % 1 === 0 ? Number.parseInt(input.value, 10) : Number.parseFloat(input.value);
    optionsSettings[key] = parsed;
    value.textContent = `${parsed}${unit}`;
    if (key === "masterVolume") {
      setMasterAudioVolume(parsed / 100);
      if (!settings.muted && !optionsSettings.muted) {
        audio.enabled = true;
        playSound("pickup");
      }
    }
    updateCrosshairPreview();
    queuePreferencesSync();
  });
  wrap.append(input, value);
  return optionRow(label, wrap);
}

function SettingDropdown(label, key, options) {
  const select = createOptionElement("select", "option-select");
  options.forEach((option) => {
    const item = createOptionElement("option", "", option.label);
    item.value = option.value;
    select.appendChild(item);
  });
  select.value = optionsSettings[key];
  select.addEventListener("change", () => setOptionValue(key, select.value));
  return optionRow(label, select);
}

function KeyBind(label, key) {
  const button = createOptionElement("button", `option-keybind ${pendingKeyBind === key ? "is-listening" : ""}`);
  button.type = "button";
  button.textContent = pendingKeyBind === key ? "PRESSIONE UMA TECLA..." : optionsSettings.keys[key];
  button.addEventListener("click", () => {
    pendingKeyBind = key;
    renderOptionsMenu();
  });
  attachButtonFeedback(button);
  return optionRow(label, button);
}

function handleOptionsKeyCapture(event) {
  if (!pendingKeyBind || game.menuState !== "options") return false;
  event.preventDefault();
  event.stopPropagation();
  optionsSettings.keys[pendingKeyBind] = event.key === " " ? "SPACE" : event.key.toUpperCase();
  pendingKeyBind = null;
  queuePreferencesSync();
  renderOptionsMenu();
  return true;
}

function normalizeKeyLabel(value) {
  return String(value || "").toLowerCase();
}

function settingKey(action) {
  return normalizeKeyLabel(settings.keys?.[action] || OPTIONS_DEFAULTS.keys[action]);
}

function keyHeld(action) {
  const key = settingKey(action);
  if (key === "mouse1") return mouse.down;
  return keys.has(key);
}

function keyPressed(action) {
  const key = settingKey(action);
  if (key === "mouse1") return false;
  return pressed.has(key);
}

function updateCrosshairPreview() {
  const preview = document.getElementById("crosshairPreview");
  if (!preview) return;
  preview.innerHTML = "";
  preview.dataset.type = optionsSettings.crosshairType;
  preview.style.setProperty("--crosshair-color", optionsSettings.crosshairColor);
  preview.style.setProperty("--crosshair-size", `${optionsSettings.crosshairSize / 100}`);
  preview.style.setProperty("--crosshair-thickness", `${optionsSettings.crosshairThickness}px`);
  preview.style.setProperty("--crosshair-opacity", optionsSettings.crosshairOpacity / 100);
  preview.style.setProperty("--crosshair-gap", `${optionsSettings.crosshairGap}px`);
  ["top", "right", "bottom", "left", "dot", "ring", "square", "diag-a", "diag-b"].forEach((part) => preview.appendChild(createOptionElement("i", part)));
}

function CrosshairPreview() {
  const preview = createOptionElement("div", "crosshair-preview-card");
  preview.innerHTML = `<span>PRÉVIA</span><div class="crosshair-preview" id="crosshairPreview"></div>`;
  requestAnimationFrame(updateCrosshairPreview);
  return preview;
}

function crosshairColorPicker() {
  const wrap = createOptionElement("div", "option-color-tools");
  ["#ffffff", "#ff4655", "#46a8ff", "#62e6a0", "#ffd166", "#bd67ff", "#ff8a5b", "#00f5d4"].forEach((color) => {
    const swatch = createOptionElement("button", optionsSettings.crosshairColor === color ? "is-active" : "");
    swatch.type = "button";
    swatch.style.setProperty("--swatch", color);
    swatch.addEventListener("click", () => {
      optionsSettings.crosshairColor = color;
      queuePreferencesSync();
      renderOptionsMenu();
    });
    wrap.appendChild(swatch);
  });
  const custom = createOptionElement("input", "option-color-picker");
  custom.type = "color";
  custom.value = optionsSettings.crosshairCustomColor;
  custom.addEventListener("input", () => {
    optionsSettings.crosshairCustomColor = custom.value;
    optionsSettings.crosshairColor = custom.value;
    updateCrosshairPreview();
    queuePreferencesSync();
  });
  custom.addEventListener("change", renderOptionsMenu);
  wrap.appendChild(custom);
  return optionRow("Cor", wrap);
}

function renderGeneralOptions() {
  return [
    optionSection("GERAL", [
      SettingDropdown("Idioma", "language", [
        { value: "pt-BR", label: "Português BR" },
        { value: "pt-PT", label: "Português PT" },
        { value: "en", label: "English" },
      ]),
      optionRow("Nome do jogador", (() => {
        const input = createOptionElement("input", "option-text-input");
        input.type = "text";
        input.value = optionsSettings.playerName;
        input.maxLength = 18;
        input.addEventListener("input", () => { optionsSettings.playerName = input.value; queuePreferencesSync(); });
        return input;
      })()),
      ToggleSwitch("Mostrar FPS", "showFps"),
      ToggleSwitch("Mostrar Ping", "showPing"),
      ToggleSwitch("Mostrar dicas", "showTips"),
    ]),
    optionSection("INTERFACE", [
      ToggleSwitch("Mostrar Kill Feed", "showKillFeed"),
      ToggleSwitch("Mostrar dinheiro ganho", "showMoneyDelta"),
      SettingSlider("Tamanho do Kill Feed", "killFeedScale", 50, 200, 5, "%"),
      SettingSlider("Duração das mensagens", "messageDuration", 1, 5, 0.5, "s"),
    ]),
  ];
}

function renderControlOptions() {
  const movementOptions = [
    ToggleGroup("Esquema", "movementScheme", [{ value: "wasd", label: "WASD" }, { value: "arrows", label: "SETAS" }]),
    SettingSlider("Sensibilidade do mouse", "mouseSensitivity", 1, 100),
    SettingSlider("Sensibilidade ADS", "adsSensitivity", 1, 100),
    ToggleSwitch("Inverter eixo Y", "invertY"),
  ];
  if (game.selectedAgent?.id === "neon") {
    movementOptions.push(KeyBind("Atalho de corrida da Neon", "neonRun"));
  }
  return [
    optionSection("MOVIMENTO", [
      ...movementOptions,
    ]),
    optionSection("TECLAS", [
      KeyBind("Atirar", "fire"),
      KeyBind("Recarregar", "reload"),
      KeyBind("Habilidade 1", "ability1"),
      KeyBind("Habilidade 2", "ability2"),
      KeyBind("Usar/Interagir", "interact"),
    ]),
  ];
}

function renderCrosshairOptions() {
  const layout = createOptionElement("div", "crosshair-options-layout");
  const left = createOptionElement("div", "crosshair-options-controls");
  left.append(optionSection("MIRA", [
    ToggleGroup("Tipo", "crosshairType", [
      { value: "default", label: "PADRÃO" },
      { value: "cross", label: "CRUZ" },
      { value: "dot", label: "PONTO" },
      { value: "circle", label: "CÍRCULO" },
      { value: "x", label: "X" },
      { value: "t", label: "T" },
      { value: "square", label: "QUADRADO" },
      { value: "ring", label: "ANEL" },
    ]),
    crosshairColorPicker(),
    SettingSlider("Tamanho", "crosshairSize", 50, 200, 1, "%"),
    SettingSlider("Espessura", "crosshairThickness", 1, 5, 1, "px"),
    SettingSlider("Opacidade", "crosshairOpacity", 10, 100, 1, "%"),
    SettingSlider("Gap central", "crosshairGap", 0, 20, 1, "px"),
  ]));
  layout.append(left, CrosshairPreview());
  return [layout];
}

function renderAudioOptions() {
  return [
    optionSection("VOLUME", [
      SettingSlider("🔊 Volume Geral", "masterVolume", 0, 100, 1, "%"),
      SettingSlider("Música", "musicVolume", 0, 100, 1, "%"),
      SettingSlider("Efeitos de Som", "sfxVolume", 0, 100, 1, "%"),
      SettingSlider("Comunicação/Voz", "voiceVolume", 0, 100, 1, "%"),
    ]),
    optionSection("OPÇÕES", [
      ToggleSwitch("Som Mudo", "muted"),
      ToggleSwitch("Destacar passos de inimigos", "highlightSteps"),
      ToggleSwitch("Efeitos de impacto", "impactEffects"),
    ]),
  ];
}

function renderVideoOptions() {
  return [
    optionSection("DISPLAY", [
      ToggleGroup("Modo de tela", "displayMode", [
        { value: "fullscreen", label: "TELA CHEIA" },
        { value: "window", label: "JANELA" },
        { value: "borderless", label: "SEM BORDAS" },
      ]),
      SettingDropdown("Resolução", "resolution", [
        { value: "1920x1080", label: "1920x1080" },
        { value: "1280x720", label: "1280x720" },
        { value: "1024x768", label: "1024x768" },
      ]),
      SettingDropdown("Limite de FPS", "fpsLimit", [
        { value: "30", label: "30" },
        { value: "60", label: "60" },
        { value: "120", label: "120" },
        { value: "240", label: "240" },
        { value: "unlimited", label: "SEM LIMITE" },
      ]),
      ToggleSwitch("Sincronização Vertical (VSync)", "vsync"),
    ]),
    optionSection("QUALIDADE", [
      ToggleGroup("Qualidade Gráfica", "quality", [
        { value: "low", label: "BAIXO" },
        { value: "medium", label: "MÉDIO" },
        { value: "high", label: "ALTO" },
        { value: "ultra", label: "ULTRA" },
      ]),
      SettingSlider("Brilho", "brightness", 50, 150, 1, "%"),
      ToggleSwitch("Partículas", "particles"),
      ToggleSwitch("Efeitos de sangue", "bloodEffects"),
      ToggleSwitch("Sombras", "shadows"),
    ]),
  ];
}

function renderOptionsStatistics() {
  const section = optionSection("DESEMPENHO DO AGENTE", []);
  section.classList.add("options-statistics-section");
  const body = section.querySelector(".options-section-body");
  if (optionsStatisticsState.status === "loading") {
    body.innerHTML = '<div class="statistics-loading"><span class="auth-loader"></span><strong>Sincronizando dados</strong></div>';
    return [section];
  }
  const stats = optionsStatisticsState.data || {};
  const games = Math.max(0, Number(stats.partidas_jogadas) || 0);
  const wins = Math.max(0, Number(stats.vitorias) || 0);
  body.innerHTML = `
    <div class="statistics-grid options-statistics-grid">
      <article><span>Partidas</span><strong>${statisticValue(games)}</strong></article>
      <article><span>Vitórias</span><strong>${statisticValue(wins)}</strong></article>
      <article><span>Taxa de vitória</span><strong>${games ? Math.round((wins / games) * 100) : 0}%</strong></article>
      <article><span>Abates totais</span><strong>${statisticValue(stats.abates_totais)}</strong></article>
      <article class="statistics-highlight"><span>Pontuação máxima</span><strong>${statisticValue(stats.pontuacao_maxima)}</strong></article>
    </div>
    ${optionsStatisticsState.message ? `<p class="statistics-message">${optionsStatisticsState.message}</p>` : ""}
  `;
  return [section];
}

async function loadOptionsStatistics() {
  if (currentProfile?.isGuest) {
    optionsStatisticsState = { status: "ready", data: {}, message: "Entre com uma conta para sincronizar seu desempenho." };
    renderOptionsMenu(true);
    return;
  }
  const session = readStoredSession();
  if (!session?.token) {
    optionsStatisticsState = { status: "error", data: {}, message: "Sessão indisponível. Entre novamente." };
    renderOptionsMenu(true);
    return;
  }
  optionsStatisticsState = { status: "loading", data: null, message: "" };
  renderOptionsMenu(true);
  try {
    const payload = await requestApi("/api/statistics", { method: "GET", headers: { Authorization: `Bearer ${session.token}` } });
    optionsStatisticsState = { status: "ready", data: payload.statistics, message: "" };
  } catch (error) {
    optionsStatisticsState = { status: "error", data: {}, message: error.message };
  }
  if (game.menuState === "options" && activeOptionsTab === "statistics") renderOptionsMenu(true);
}

window.addEventListener("valorant2d:statistics-updated", (event) => {
  optionsStatisticsState = { status: "ready", data: event.detail || {}, message: "Atualizado agora" };
  if (game.menuState === "options" && activeOptionsTab === "statistics") renderOptionsMenu(true);
});

function renderOptionsContent() {
  if (activeOptionsTab === "controls") return renderControlOptions();
  if (activeOptionsTab === "crosshair") return renderCrosshairOptions();
  if (activeOptionsTab === "audio") return renderAudioOptions();
  if (activeOptionsTab === "video") return renderVideoOptions();
  if (activeOptionsTab === "statistics") return renderOptionsStatistics();
  return renderGeneralOptions();
}

function applyOptionsSettings() {
  settings = cloneOptions(optionsSettings);
  settings.idioma = settings.language;
  settings.nomeJogador = settings.playerName;
  settings.mostrarFPS = settings.showFps;
  settings.mostrarPing = settings.showPing;
  settings.mostrarDicas = settings.showTips;
  settings.showKillFeed = Boolean(settings.showKillFeed);
  settings.showMoneyDelta = Boolean(settings.showMoneyDelta);
  settings.killFeedScale = Math.max(50, Math.min(200, Number(settings.killFeedScale) || 100));
  settings.messageDuration = Math.max(1, Math.min(5, Number(settings.messageDuration) || 3));
  game.arrowKeys = settings.movementScheme === "arrows";
  game.crosshairStyle = settings.crosshairType === "default" ? "default" : "minimal";
  game.crosshairScale = settings.crosshairSize / 100;
  game.playerName = settings.playerName.trim() || OPTIONS_DEFAULTS.playerName;
  game.showFps = Boolean(settings.showFps);
  game.showPing = Boolean(settings.showPing);
  game.messageTimer = Math.max(game.messageTimer || 0, settings.messageDuration);
  document.documentElement.style.setProperty("--kill-feed-scale", String(settings.killFeedScale / 100));
  game.hudOpacity = Math.max(0.5, Math.min(1.5, settings.brightness / 100));
  audio.enabled = !settings.muted;
  setMasterAudioVolume(settings.masterVolume / 100);
  if (audio.enabled) initAudio();
  try {
    localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
  queuePreferencesSync();
  if (settings.displayMode === "fullscreen" && !document.fullscreenElement) {
    ui.gameRoot?.requestFullscreen?.();
  } else if (settings.displayMode === "window" && document.fullscreenElement) {
    document.exitFullscreen?.();
  }
  updateUi();
  setMessage("Configurações aplicadas!");
  showOptionsFeedback("Configurações aplicadas!");
}

function resetOptionsSettings() {
  const tabDefaults = {
    general: ["language", "playerName", "showFps", "showPing", "showTips"],
    controls: ["movementScheme", "mouseSensitivity", "adsSensitivity", "invertY", "keys"],
    crosshair: ["crosshairType", "crosshairColor", "crosshairCustomColor", "crosshairSize", "crosshairThickness", "crosshairOpacity", "crosshairGap"],
    audio: ["masterVolume", "musicVolume", "sfxVolume", "voiceVolume", "muted", "highlightSteps", "impactEffects"],
    video: ["displayMode", "resolution", "fpsLimit", "vsync", "quality", "brightness", "particles", "bloodEffects", "shadows"],
  };
  for (const key of tabDefaults[activeOptionsTab] || []) {
    optionsSettings[key] = cloneOptions(OPTIONS_DEFAULTS[key]);
  }
  pendingKeyBind = null;
  queuePreferencesSync();
  showOptionsFeedback("Padrões restaurados!");
}

function renderOptionsMenu(skipFade = false) {
  if (!ui.menuButtons) return;
  ui.menuButtons.innerHTML = "";
  ui.menuButtons.className = "options-shell";
  const panel = createOptionElement("div", `options-panel ${skipFade ? "" : "is-ready"}`);
  const tabs = createOptionElement("div", "options-tabs");
  OPTIONS_TABS.forEach((tab) => {
    const button = createOptionElement("button", activeOptionsTab === tab.id ? "is-active" : "", tab.label);
    button.type = "button";
    button.addEventListener("click", () => {
      if (activeOptionsTab === tab.id) return;
      panel.querySelector(".options-content")?.classList.add("is-fading");
      setTimeout(() => {
        activeOptionsTab = tab.id;
        pendingKeyBind = null;
        renderOptionsMenu(true);
        if (tab.id === "statistics") void loadOptionsStatistics();
      }, 150);
    });
    attachButtonFeedback(button);
    tabs.appendChild(button);
  });
  const content = createOptionElement("div", "options-content");
  renderOptionsContent().forEach((section) => content.appendChild(section));
  const footer = createOptionElement("footer", "options-footer");
  const footerItems = activeOptionsTab === "statistics" ? [
    { label: "ATUALIZAR", action: loadOptionsStatistics, primary: true },
    { label: "VOLTAR", action: backFromOptions },
  ] : [
    { label: "REPOR PADRÕES", action: resetOptionsSettings },
    { label: "APLICAR", action: applyOptionsSettings, primary: true },
    { label: "VOLTAR", action: backFromOptions },
  ];
  footerItems.forEach((item) => {
    const button = createOptionElement("button", item.primary ? "is-primary" : "", item.label);
    button.type = "button";
    button.addEventListener("click", item.action);
    attachButtonFeedback(button);
    footer.appendChild(button);
  });
  const feedback = createOptionElement("span", "options-feedback", optionsFeedback);
  footer.appendChild(feedback);
  panel.append(tabs, content, footer);
  ui.menuButtons.appendChild(panel);
  requestAnimationFrame(() => panel.classList.add("is-ready"));
}

function openOptionsMenu(returnState) {
  game.optionsReturnState = returnState;
  setMenu("OPÇÕES", "", [], "", "options");
  renderOptionsMenu(true);
  if (activeOptionsTab === "statistics") void loadOptionsStatistics();
}

function showOptionsMenu() {
  openOptionsMenu("main");
}

function backFromOptions() {
  if (game.optionsReturnState === "pause") {
    game.optionsReturnState = null;
    hideMenuOverlay();
    showPauseMenu();
    return;
  }
  game.optionsReturnState = null;
  showMainMenu();
}

function applyDifficulty(difficulty) {
  game.difficulty = difficulty;
  game.sandbox = false;
  game.sandboxPanelOpen = false;
  game.sandboxPlacement = null;
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
  game.outbreak = false;
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

function createOutbreakWave(wave) {
  // As dez primeiras ondas funcionam como uma introdução gradual.
  const count = wave <= 3
    ? 3
    : wave <= 6
      ? 4
      : wave <= 10
        ? 5
        : Math.min(6 + Math.floor((wave - 11) * 0.7), 14);
  const baseSpawns = [...map.defendersSpawn, ...map.attackerBotSpawns];
  return Array.from({ length: count }, (_, index) => {
    const base = baseSpawns[index % baseSpawns.length];
    const ring = Math.floor(index / baseSpawns.length) + 1;
    const angle = index * 2.19;
    const spawn = nearestWalkablePoint({
      x: base.x + Math.cos(angle) * ring * 34,
      y: base.y + Math.sin(angle) * ring * 34,
    }, base);
    const bot = makeBot(spawn, index);
    bot.id = `bot-outbreak-${wave}-${index}`;
    bot.hasSpike = false;
    bot.hp = wave <= 10 ? 60 + wave * 4 : 110 + (wave - 10) * 8;
    bot.maxHp = bot.hp;
    bot.speed = wave <= 10
      ? Math.min(104, 78 + wave * 2 + index)
      : Math.min(184, 112 + (wave - 11) * 4 + index * 2);
    if (wave <= 10) bot.weapon = weapons[0];
    bot.outbreakScatter = wave <= 10 ? Math.max(18, 58 - wave * 4) : Math.max(0, 16 - (wave - 11));
    bot.outbreakFirePenalty = wave <= 10 ? Math.max(1.25, 2.25 - wave * 0.08) : 1;
    return bot;
  });
}

function deployOutbreakWave(wave) {
  game.outbreakWave = wave;
  game.roundNumber = wave;
  game.bots = createOutbreakWave(wave);
  game.bots.forEach(sanitizeEntityPosition);
  game.bullets = [];
  spawnOutbreakMedkits();
  game.outbreakWaveDelay = 0;
  showRoundBanner(`ONDA ${wave}`, `${game.bots.length} ameaças detectadas`, "OUTBREAK", 2.4);
  setMessage(`Outbreak: onda ${wave} iniciada. Elimine todas as ameaças.`);
}

function startOutbreakMode() {
  game.mode = "Outbreak";
  game.playMode = "outbreak";
  game.outbreak = true;
  game.sandbox = false;
  game.training = false;
  game.tutorial = false;
  game.godMode = false;
  game.allyCount = 0;
  game.enemyFireMultiplier = 1.5;
  game.selectedAgent = agents[0];
  setFovMode(false);
  hideMenuOverlay();
  startNewMatch();
  game.outbreakWave = 1;
  game.outbreakElapsed = 0;
  game.outbreakLastDamageAt = -5;
  game.outbreakWaveDelay = 0;
  game.playerSide = "attackers";
  game.player.armor = 50;
  game.player.maxArmor = 50;
  game.armor = 50;
  game.allies = [];
  game.medkits = [];
  game.ultOrbs = [];
  game.spike.state = "disabled";
  game.spike.owner = null;
  game.phase = "action";
  game.phaseTime = 9999;
  game.clockActive = false;
  deployOutbreakWave(1);
  ui.gameRoot?.classList.add("outbreak-mode");
}

function startSandboxMode() {
  game.mode = "Sandbox";
  game.difficulty = "sandbox";
  game.sandbox = true;
  game.training = false;
  game.tutorial = false;
  game.sandboxPanelOpen = false;
  game.sandboxPlacement = null;
  game.sandboxBulletsPierceWalls = false;
  game.sandboxCustomWalls = [];
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
  if (!settings.showKillFeed || !ui.killFeed) return;
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
  }, Math.max(1000, Math.min(5000, (Number(settings.messageDuration) || 3) * 1000)));
}

let lastMoney = 800;
function flashMoneyDelta(newVal) {
  const diff = newVal - lastMoney;
  lastMoney = newVal;
  if (diff === 0 || !settings.showMoneyDelta) return;
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

// Icones inline da aba Equip. mantidos no JS para cada card acompanhar o item renderizado.
function equipmentIconSvg(itemId) {
  const icons = {
    lightArmor: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 4L6 9v9c0 7 5.4 13 12 15 6.6-2 12-8 12-15V9z" stroke="#ff4655" stroke-width="1.8" stroke-linejoin="round"/><text x="18" y="22" text-anchor="middle" fill="#ff4655" font-size="9" font-family="Rajdhani,Arial,sans-serif" font-weight="700">25</text></svg>`,
    heavyArmor: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 3L5 8.5v10C5 26 11 32.5 18 34c7-1.5 13-8 13-15.5V8.5z" stroke="#ff4655" stroke-width="2" fill="rgba(255,70,85,0.08)" stroke-linejoin="round"/><text x="18" y="22" text-anchor="middle" fill="#ff4655" font-size="9" font-family="Rajdhani,Arial,sans-serif" font-weight="700">50</text></svg>`,
    boots: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M10 8v14l-2 4h18v-4h-8V8z" stroke="#ff4655" stroke-width="1.8" stroke-linejoin="round"/><line x1="8" y1="26" x2="26" y2="26" stroke="#ff4655" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    magazine: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect x="11" y="6" width="14" height="22" rx="3" stroke="#ff4655" stroke-width="1.8"/><line x1="15" y1="11" x2="21" y2="11" stroke="#ff4655" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="15" x2="21" y2="15" stroke="#ff4655" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="19" x2="21" y2="19" stroke="#ff4655" stroke-width="1.5" stroke-linecap="round"/><rect x="14" y="28" width="8" height="4" rx="1" stroke="#ff4655" stroke-width="1.5"/></svg>`,
    reloadKit: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M26 10a10 10 0 1 1-14 0" stroke="#ff4655" stroke-width="1.8" stroke-linecap="round"/><polyline points="22,6 26,10 22,14" stroke="#ff4655" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return icons[itemId] || icons.reloadKit;
}

function buildShop() {
  renderWeaponCategoryTabs();
  renderWeaponCards();

  ui.equipmentButtons.innerHTML = "";
  for (const item of equipment) {
    const button = document.createElement("button");
    button.className = "equip-card";
    const kind = item.id.includes("Armor") ? "Consumivel por round" : "Upgrade permanente";
    button.innerHTML = `
      <span class="equip-owned-badge">Obtido</span>
      <span class="equip-icon">${equipmentIconSvg(item.id)}</span>
      <b>${item.name}</b>
      <span>${kind}. ${item.desc}</span>
      <em>$${item.price}</em>
    `;
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
    updateEquipmentCardState(button, item);
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

function updateEquipmentCardState(button, item) {
  const owned = equipmentOwned(item);
  const cantAfford = !owned && game.money < item.price;
  button.classList.toggle("active", owned);
  button.classList.toggle("owned", owned);
  button.classList.toggle("cant-afford", cantAfford);
  button.disabled = !canUseShop() || owned;
}

function renderWeaponCategoryTabs() {
  if (!ui.weaponCategoryTabs) return;
  ui.weaponCategoryTabs.innerHTML = "";
  for (const category of weaponCategories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "weapon-category-tab";
    button.dataset.weaponCategory = category.id;
    button.classList.toggle("active", category.id === game.shopWeaponCategory);
    button.innerHTML = `<span>${category.label}</span><em>${category.key}</em>`;
    button.addEventListener("click", () => setWeaponCategory(category.id));
    ui.weaponCategoryTabs.appendChild(button);
  }
}

function renderWeaponCards() {
  if (!ui.weaponButtons) return;
  ui.weaponButtons.innerHTML = "";
  for (const weapon of weaponsForCurrentCategory()) {
    ui.weaponButtons.appendChild(createWeaponCard(weapon));
  }
}

function createWeaponCard(weapon) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice weapon-choice";
  const image = document.createElement("img");
  image.alt = weapon.name;
  image.loading = "eager";
  image.decoding = "async";
  image.addEventListener("error", () => {
    const fallback = fallbackWeaponImagePath(weapon);
    if (fallback && image.dataset.fallbackTried !== "true") {
      image.dataset.fallbackTried = "true";
      image.src = fallback;
      return;
    }
    image.src = weaponPlaceholderImage(weapon);
  });
  image.src = weaponImagePath(weapon);

  const art = document.createElement("span");
  art.className = "weapon-art";
  art.appendChild(image);

  const title = document.createElement("b");
  const name = document.createElement("span");
  name.textContent = weapon.name;
  const price = document.createElement("em");
  title.append(name, price);

  const meta = document.createElement("span");
  meta.className = "weapon-meta";
  meta.textContent = `${weapon.damage} dano | pente ${weapon.mag}`;

  button.append(art, title, meta);
  button.addEventListener("click", () => buyWeapon(weapon));
  updateWeaponCardState(button, weapon);
  return button;
}

function updateWeaponCardState(button, weapon) {
  const owned = game.ownedWeapons.has(weapon.id);
  const canBuy = owned || game.money >= weapon.price;
  button.classList.toggle("active", weapon === game.selectedWeapon);
  button.classList.toggle("owned", owned);
  button.classList.toggle("can-buy", canBuy);
  button.classList.toggle("cannot-buy", !canBuy);
  button.disabled = !canUseShop();
  const status = button.querySelector("em");
  if (status) {
    status.textContent = weapon === game.selectedWeapon
      ? "Equipada"
      : owned
        ? "Comprada"
        : `$${weapon.price}`;
  }
}

function buyWeapon(weapon) {
  if (game.shopTransactionLocked || !canUseShop()) return;
  game.shopTransactionLocked = true;
  const alreadyOwned = game.ownedWeapons.has(weapon.id);
  if (!alreadyOwned && game.money < weapon.price) {
    setMessage("Creditos insuficientes.");
    game.shopTransactionLocked = false;
    updateShopState();
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
  window.setTimeout(() => {
    game.shopTransactionLocked = false;
  }, 120);
}

function setWeaponCategory(categoryId) {
  if (!weaponCategoryById.has(categoryId)) return;
  game.shopWeaponCategory = categoryId;
  renderWeaponCategoryTabs();
  renderWeaponCards();
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
  renderWeaponCategoryTabs();
  [...(ui.weaponButtons?.children || [])].forEach((button, i) => {
    const weapon = weaponsForCurrentCategory()[i];
    if (weapon) updateWeaponCardState(button, weapon);
  });
  [...(ui.equipmentButtons?.children || [])].forEach((button, i) => {
    const item = equipment[i];
    if (item) updateEquipmentCardState(button, item);
  });
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
  game.currentFps = Math.round(1 / Math.max(0.001, dt));
  game.pingMs = 28 + Math.round(Math.sin(now / 900) * 5 + Math.random() * 4);
  const tutorialSlowMotion = game.tutorial
    && game.tutorialStage === "defend"
    && game.tutorialSlowTimer > 0;
  update(dt * (tutorialSlowMotion ? 0.2 : 1) * (game.timeScale || 1));
  draw();
  updateUi();
  pressed.clear();
  requestAnimationFrame(loop);
}
loop.last = performance.now();

// Ouvintes de eventos com checagem de seguranca contra valores nulos.
if (window) window.addEventListener("keydown", (event) => {
  initAudio();
  if (handleOptionsKeyCapture(event)) return;
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
  if (game.sandbox && !event.repeat && event.key.toLowerCase() === "n") {
    setFovMode(!game.fovMode);
    renderSandboxPanel();
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

if (window) window.addEventListener("resize", escalarViewport);
if (document) document.addEventListener("fullscreenchange", escalarViewport);

if (canvas) canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

if (canvas) canvas.addEventListener("contextmenu", (event) => event.preventDefault());

if (canvas) canvas.addEventListener("mousedown", (event) => {
  initAudio();
  if (game.omenUlt) {
    event.preventDefault();
    if (event.button === 0 && game.omenUlt.state === "select") {
      commitOmenTeleport({ x: mouse.x, y: mouse.y });
    }
    return;
  }
  if (game.sandbox && game.phase === "action" && game.sandboxPlacement && event.button === 0) {
    event.preventDefault();
    const point = { x: mouse.x, y: mouse.y };
    const type = game.sandboxPlacement.type;
    if (type === "bot") sandboxSpawnMany(point);
    if (type === "item") sandboxPlaceItemAt(point);
    if (type === "wall") sandboxAddWallAt(point);
    if (type === "remove-wall") sandboxRemoveWallNear(point);
    cancelSandboxPlacement();
    return;
  }
  if (event.button === 2 && game.selectedAgent?.id === "neon" && game.phase === "action") {
    event.preventDefault();
    mouse.rightDown = true;
    game.neonSpeedHeld = true;
    return;
  }
  if (game.sandbox && game.phase === "action" && event.button === 2) {
    event.preventDefault();
    sandboxSpawnBotAt({ x: mouse.x, y: mouse.y }, { team: "enemy", behavior: "combat", canShoot: true, canMove: true, agentId: agents[0].id });
    setMessage("Sandbox: inimigo criado.");
    return;
  }
  if (game.sandbox && game.phase === "action" && event.button === 1) {
    event.preventDefault();
    sandboxSpawnBotAt({ x: mouse.x, y: mouse.y }, { team: "ally", behavior: "combat", canShoot: true, canMove: true, agentId: agents[1]?.id || agents[0].id });
    setMessage("Sandbox: aliado criado.");
    return;
  }
  if (event.button === 0) mouse.down = true;
});

if (window) window.addEventListener("mouseup", (event) => {
  if (!event || event.button === 0) mouse.down = false;
  if (!event || event.button === 2) mouse.rightDown = false;
});

if (ui.shopBackdrop) ui.shopBackdrop.addEventListener("click", () => { closeShop(); updateUi(); });
escalarViewport();

if (ui.shopTabs && typeof ui.shopTabs.querySelectorAll === "function") {
  ui.shopTabs.querySelectorAll("[data-shop-tab]").forEach((button) => {
    if (button) button.addEventListener("click", () => setShopTab(button.dataset.shopTab));
  });
}

if (ui.spawnBotButton) ui.spawnBotButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  sandboxSpawnBotAt({ x: mouse.x || map.width / 2, y: mouse.y || map.height / 2 }, { team: "enemy", behavior: "combat", canShoot: true, canMove: true, agentId: agents[0].id });
  setMessage("Sandbox: inimigo criado.");
});

if (ui.spawnAllyButton) ui.spawnAllyButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  sandboxSpawnBotAt({ x: mouse.x || map.width / 2, y: mouse.y || map.height / 2 }, { team: "ally", behavior: "combat", canShoot: true, canMove: true, agentId: agents[1]?.id || agents[0].id });
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
  renderSandboxPanel();
  setMessage(`Sandbox: God Mode ${game.godMode ? "ligado" : "desligado"}.`);
});

if (ui.clearSandboxButton) ui.clearSandboxButton.addEventListener("click", () => {
  if (!game.sandbox) return;
  game.bots = [];
  game.allies = [];
  game.destructibles = [];
  game.sandboxCustomWalls = [];
  game.bullets = [];
  game.phase = "action";
  game.phaseTime = 9999;
  game.clockActive = true;
  game.paused = false;
  game.spike.state = "disabled";
  game.spike.owner = null;
  game.spike.plantProgress = 0;
  renderSandboxPanel();
  setMessage("Sandbox: mapa limpo.");
});

ui.sandboxMenuButton?.addEventListener("click", openSandboxPanel);
ui.sandboxPanelClose?.addEventListener("click", closeSandboxPanel);
ui.pauseSandboxButton?.addEventListener("click", () => {
  hidePauseOverlay();
  game.paused = true;
  game.menuState = "none";
  openSandboxPanel();
});
ui.sandboxTabs?.querySelectorAll("[data-sandbox-tab]").forEach((button) => {
  button.addEventListener("click", () => setSandboxTab(button.dataset.sandboxTab));
});
ui.sandboxBotCanShoot?.addEventListener("click", () => ui.sandboxBotCanShoot.classList.toggle("is-on"));
ui.sandboxBotCanMove?.addEventListener("click", () => ui.sandboxBotCanMove.classList.toggle("is-on"));
ui.sandboxPlaceBotButton?.addEventListener("click", () => setSandboxPlacement("bot"));
ui.sandboxSpawnCenterButton?.addEventListener("click", () => sandboxSpawnMany({ x: mouse.x || map.width / 2, y: mouse.y || map.height / 2 }));
ui.sandboxLoadMapButton?.addEventListener("click", () => loadSandboxMap(ui.sandboxMapSelect?.value || 0));
ui.sandboxAddWallButton?.addEventListener("click", () => setSandboxPlacement("wall"));
ui.sandboxRemoveWallButton?.addEventListener("click", () => setSandboxPlacement("remove-wall"));
ui.sandboxClearWallsButton?.addEventListener("click", () => {
  game.destructibles = game.destructibles.filter((wall) => !game.sandboxCustomWalls.includes(wall));
  game.sandboxCustomWalls = [];
  setMessage("Sandbox: estruturas custom removidas.");
});
ui.sandboxPlaceItemButton?.addEventListener("click", () => setSandboxPlacement("item"));
ui.sandboxClearItemsButton?.addEventListener("click", () => {
  game.medkits = [];
  game.ultOrbs = [];
  game.spike.state = "disabled";
  setMessage("Sandbox: itens removidos.");
});
ui.sandboxPierceWallsToggle?.addEventListener("click", () => {
  game.sandboxBulletsPierceWalls = !game.sandboxBulletsPierceWalls;
  renderSandboxPanel();
  setMessage(`Sandbox: tiros atravessando paredes ${game.sandboxBulletsPierceWalls ? "ON" : "OFF"}.`);
});
ui.sandboxGodToggle?.addEventListener("click", () => {
  game.godMode = !game.godMode;
  renderSandboxPanel();
});
ui.sandboxBlackoutToggle?.addEventListener("click", () => {
  setFovMode(!game.fovMode);
  renderSandboxPanel();
});
ui.sandboxSaveButton?.addEventListener("click", saveSandboxConfig);
ui.sandboxLoadButton?.addEventListener("click", loadSandboxConfig);

if (ui.newGameButton) ui.newGameButton.addEventListener("click", () => {
  ui.matchOverlay?.classList.add("hidden");
  if (game.outbreak) startOutbreakMode();
  else showMainMenu();
});
ui.outbreakMenuButton?.addEventListener("click", () => {
  ui.matchOverlay?.classList.add("hidden");
  showMainMenu();
});

if (ui.pauseResumeButton) ui.pauseResumeButton.addEventListener("click", resumeFromPause);
if (ui.pauseOptionsButton) ui.pauseOptionsButton.addEventListener("click", openPauseOptions);
if (ui.pauseRestartButton) ui.pauseRestartButton.addEventListener("click", restartCurrentMatch);
if (ui.pauseQuitButton) ui.pauseQuitButton.addEventListener("click", quitToMainMenu);

ui.authForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAuthentication(authMode);
});
ui.registerButton?.addEventListener("click", toggleRegistrationMode);
ui.forgotPasswordButton?.addEventListener("click", () => showPasswordRecovery(true));
ui.recoveryBackButton?.addEventListener("click", () => showPasswordRecovery(false));
ui.recoveryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitPasswordRecovery();
});
document.querySelectorAll("[data-password-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.passwordToggle);
    if (!input) return;
    const willShow = input.type === "password";
    input.type = willShow ? "text" : "password";
    button.textContent = willShow ? "Ocultar" : "Mostrar";
    button.setAttribute("aria-label", willShow ? "Ocultar senha" : "Mostrar senha");
  });
});
ui.guestButton?.addEventListener("click", enterAsGuest);
ui.logoutButton?.addEventListener("click", logoutCurrentProfile);
ui.authUsername?.addEventListener("input", () => {
  ui.authUsername.removeAttribute("aria-invalid");
  setAuthFeedback("");
});
ui.authPassword?.addEventListener("input", () => {
  ui.authPassword.removeAttribute("aria-invalid");
  setAuthFeedback("");
});

buildShop();
setShopTab(game.shopTab);
game.menuMapTimer = 0;
startNewMatch();
bootstrapAuthentication();
requestAnimationFrame(loop);
