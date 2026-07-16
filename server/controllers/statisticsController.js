const Session = require('../models/Session');
const Statistic = require('../models/Statistic');
const MatchSubmission = require('../models/MatchSubmission');
const { securityAudit } = require('../utils/securityAudit');

const ALLOWED_MATCH_MODES = new Set(['default', 'blackout', 'outbreak']);

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

async function getStatistics(request, response, next) {
  try {
    const user = await authenticatedUser(request, response);
    if (!user) return;
    const statistics = await Statistic.findByUserId(user.id);
    response.status(200).json({ user: { id: user.id, username: user.username }, statistics });
  } catch (error) {
    next(error);
  }
}

async function startMatch(request, response, next) {
  try {
    const user = await authenticatedUser(request, response);
    if (!user) return;
    const mode = typeof request.body?.mode === 'string' ? request.body.mode : '';
    if (!ALLOWED_MATCH_MODES.has(mode)) {
      response.status(400).json({ error: 'Modo de partida inválido.', code: 'INVALID_MATCH_MODE' });
      return;
    }
    const matchToken = await MatchSubmission.create(user.id, mode);
    response.status(201).json({ matchToken, expiresInSeconds: 7200 });
  } catch (error) {
    next(error);
  }
}

async function recordMatch(request, response, next) {
  try {
    const user = await authenticatedUser(request, response);
    if (!user) return;

    const victory = request.body?.victory;
    const kills = Number(request.body?.kills);
    const score = Number(request.body?.score);
    const match = await MatchSubmission.findValid(user.id, request.body?.matchToken);
    const duration = Number(match?.duracao_segundos);
    const plausibleKillLimit = Math.ceil(Math.max(0, duration) * 2) + 10;
    const plausibleScoreLimit = kills * 200 + 10000;
    if (!match || duration < 15 || duration > 7200
      || typeof victory !== 'boolean'
      || !Number.isInteger(kills) || kills < 0 || kills > 10000 || kills > plausibleKillLimit
      || !Number.isInteger(score) || score < 0 || score > 10000000) {
      securityAudit('invalid_match_submission', request, { userId: user.id, success: false });
      response.status(400).json({ error: 'Estatísticas da partida inválidas.', code: 'INVALID_STATISTICS' });
      return;
    }
    if (score > plausibleScoreLimit) {
      securityAudit('implausible_match_score', request, { userId: user.id, success: false });
      response.status(400).json({ error: 'Pontuação incompatível com a partida.', code: 'IMPLAUSIBLE_SCORE' });
      return;
    }

    const consumed = await MatchSubmission.consume(match.id);
    if (consumed.changes !== 1) {
      response.status(409).json({ error: 'Esta partida já foi registrada.', code: 'MATCH_ALREADY_RECORDED' });
      return;
    }
    const statistics = await Statistic.recordMatch(user.id, { victory, kills, score });
    response.status(200).json({ message: 'Estatísticas atualizadas.', statistics });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStatistics, recordMatch, startMatch };
