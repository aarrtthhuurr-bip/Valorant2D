const Leaderboard = require('../models/Leaderboard');
const MatchSubmission = require('../models/MatchSubmission');
const Session = require('../models/Session');
const { securityAudit } = require('../utils/securityAudit');

const ALLOWED_MODES = new Set(['default', 'blackout', 'outbreak']);

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

function validatedMatchPayload(body, match) {
  const gameMode = typeof body?.game_mode === 'string' ? body.game_mode : '';
  const score = Number(body?.score);
  const kills = Number(body?.kills);
  const deaths = Number(body?.deaths ?? 0);
  const victory = body?.victory;
  const wave = Number(body?.wave ?? 0);
  const survivalSeconds = Number(body?.survival_seconds ?? 0);
  const duration = Number(match?.duracao_segundos);

  if (!match || !ALLOWED_MODES.has(gameMode) || match.modo !== gameMode
    || duration < 15 || duration > 7200
    || typeof victory !== 'boolean'
    || !Number.isInteger(kills) || kills < 0 || kills > Math.ceil(duration * 2) + 10
    || !Number.isInteger(deaths) || deaths < 0 || deaths > Math.ceil(duration / 5) + 10
    || !Number.isInteger(score) || score < 0 || score > 10000000) return null;

  if (gameMode === 'outbreak') {
    if (!Number.isInteger(wave) || wave < 1 || wave > Math.floor(duration / 2) + 5
      || !Number.isFinite(survivalSeconds) || survivalSeconds < 0 || survivalSeconds > duration + 10) return null;
    const canonicalScore = wave * 1000 + kills * 100 + Math.floor(survivalSeconds);
    if (score !== canonicalScore) return null;
  } else {
    if (score > kills * 200 + 10000) return null;
  }

  return { gameMode, score, kills, deaths, victory, maxWave: gameMode === 'outbreak' ? wave : 0 };
}

async function saveScore(request, response, next) {
  try {
    const user = await authenticatedUser(request, response);
    if (!user) return;
    const match = await MatchSubmission.findValid(user.id, request.body?.matchToken);
    const payload = validatedMatchPayload(request.body, match);
    if (!payload) {
      securityAudit('invalid_leaderboard_submission', request, { userId: user.id, success: false });
      response.status(400).json({ error: 'Pontuação da partida inválida.', code: 'INVALID_LEADERBOARD_SCORE' });
      return;
    }
    const result = await Leaderboard.recordCompletedMatch({
      matchId: match.id,
      userId: user.id,
      playerName: user.username,
      ...payload,
    });
    response.status(201).json({ message: 'Pontuação registrada na leaderboard.', ...result });
  } catch (error) {
    if (error.code === 'MATCH_ALREADY_RECORDED') {
      response.status(409).json({ error: error.message, code: error.code });
      return;
    }
    next(error);
  }
}

async function listScores(request, response, next) {
  try {
    const rawMode = typeof request.query.mode === 'string' ? request.query.mode : request.params.mode;
    const gameMode = typeof rawMode === 'string' ? rawMode.toLowerCase() : '';
    if (!ALLOWED_MODES.has(gameMode)) {
      response.status(400).json({ error: 'Modo de jogo inválido.', code: 'INVALID_GAME_MODE' });
      return;
    }
    const token = extractToken(request);
    let user = null;
    if (token) {
      user = await Session.findValid(token);
      if (!user) {
        response.status(401).json({ error: 'Sessão inválida ou expirada.', code: 'INVALID_SESSION' });
        return;
      }
    }
    const [leaderboard, playerStats] = await Promise.all([
      Leaderboard.listByMode(gameMode, 50),
      user ? Leaderboard.personalStats(user.id, gameMode) : Promise.resolve(null),
    ]);
    const currentPlayer = playerStats ? {
      user_id: user.id,
      player_name: user.username,
      rank_position: Number(playerStats.global_position) || null,
      ranking_value: Math.max(0, Number(playerStats.ranking_value) || 0),
      metric_type: playerStats.metric_type,
      is_top_50: leaderboard.some((entry) => Number(entry.user_id) === Number(user.id)),
    } : null;
    response.status(200).json({
      gameMode,
      limit: 50,
      leaderboard,
      currentPlayer,
      playerStats: playerStats ? { ...playerStats, player_name: user.username } : null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listScores, saveScore, _test: { validatedMatchPayload } };
