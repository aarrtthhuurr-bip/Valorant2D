const Session = require('../models/Session');
const Statistic = require('../models/Statistic');

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

async function recordMatch(request, response, next) {
  try {
    const user = await authenticatedUser(request, response);
    if (!user) return;

    const victory = request.body?.victory === true;
    const kills = Number(request.body?.kills);
    const score = Number(request.body?.score);
    if (!Number.isInteger(kills) || kills < 0 || kills > 10000
      || !Number.isInteger(score) || score < 0 || score > 10000000) {
      response.status(400).json({ error: 'Estatísticas da partida inválidas.', code: 'INVALID_STATISTICS' });
      return;
    }

    const statistics = await Statistic.recordMatch(user.id, { victory, kills, score });
    response.status(200).json({ message: 'Estatísticas atualizadas.', statistics });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStatistics, recordMatch };
