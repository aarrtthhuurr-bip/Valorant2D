const Preference = require('../models/Preference');
const Session = require('../models/Session');

const ALLOWED_KEYS = new Set([
  'language', 'playerName', 'showFps', 'showPing', 'showTips', 'showKillFeed',
  'showMoneyDelta', 'killFeedScale', 'messageDuration', 'movementScheme',
  'mouseSensitivity', 'adsSensitivity', 'invertY', 'keys', 'crosshairType',
  'crosshairColor', 'crosshairCustomColor', 'crosshairSize', 'crosshairThickness',
  'crosshairOpacity', 'crosshairGap', 'masterVolume', 'musicVolume', 'sfxVolume',
  'voiceVolume', 'muted', 'highlightSteps', 'impactEffects', 'displayMode',
  'resolution', 'fpsLimit', 'vsync', 'quality', 'brightness', 'particles',
  'bloodEffects', 'shadows',
]);

function extractToken(request) {
  const authorization = request.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

async function authenticatedUser(request, response) {
  const session = await Session.findValid(extractToken(request));
  if (!session) {
    response.status(401).json({ error: 'Sessão inválida ou expirada.', code: 'INVALID_SESSION' });
    return null;
  }
  return session;
}

function sanitizePreferences(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const preferences = {};
  for (const [key, value] of Object.entries(input)) {
    if (ALLOWED_KEYS.has(key)) preferences[key] = value;
  }

  if (typeof preferences.showTips !== 'boolean') return null;
  const volume = Number(preferences.masterVolume);
  if (!Number.isFinite(volume) || volume < 0 || volume > 100) return null;
  preferences.masterVolume = Math.round(volume);

  const serialized = JSON.stringify(preferences);
  if (serialized.length > 20000) return null;
  return preferences;
}

async function getPreferences(request, response, next) {
  try {
    const user = await authenticatedUser(request, response);
    if (!user) return;
    const preferences = await Preference.findByUserId(user.id);
    response.status(200).json({ preferences: preferences || {} });
  } catch (error) {
    next(error);
  }
}

async function updatePreferences(request, response, next) {
  try {
    const user = await authenticatedUser(request, response);
    if (!user) return;
    const preferences = sanitizePreferences(request.body?.preferences);
    if (!preferences) {
      response.status(400).json({ error: 'Configurações inválidas.', code: 'INVALID_PREFERENCES' });
      return;
    }
    const savedPreferences = await Preference.saveForUser(user.id, preferences);
    response.status(200).json({ message: 'Configurações sincronizadas.', preferences: savedPreferences });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPreferences, updatePreferences };
