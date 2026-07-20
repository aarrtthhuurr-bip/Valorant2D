const PlayerProfile = require('../models/PlayerProfile');
const Session = require('../models/Session');

function extractToken(request) {
  const authorization = request.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

async function getProfile(request, response, next) {
  try {
    const session = await Session.findValid(extractToken(request));
    if (!session) {
      response.status(401).json({ error: 'Sessão inválida ou expirada.', code: 'INVALID_SESSION' });
      return;
    }
    const profile = await PlayerProfile.findByUserId(session.id);
    if (!profile) {
      response.status(404).json({ error: 'Perfil não encontrado.', code: 'PROFILE_NOT_FOUND' });
      return;
    }
    response.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProfile };
