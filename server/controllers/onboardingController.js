const Session = require('../models/Session');
const User = require('../models/User');

function extractToken(request) {
  const authorization = request.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

async function complete(request, response, next) {
  try {
    const session = await Session.findValid(extractToken(request));
    if (!session) {
      response.status(401).json({ error: 'Sessão inválida ou expirada.', code: 'INVALID_SESSION' });
      return;
    }

    const welcomeCompleted = request.body?.welcomeCompleted === true;
    const menuTourCompleted = request.body?.menuTourCompleted === true;
    if (!welcomeCompleted && !menuTourCompleted) {
      response.status(400).json({ error: 'Etapa de apresentação inválida.', code: 'INVALID_ONBOARDING_STEP' });
      return;
    }

    const state = await User.completeOnboarding(session.id, {
      welcomeCompleted,
      menuTourCompleted,
    });
    response.status(200).json({
      message: 'Apresentação atualizada.',
      onboardingCompleted: Boolean(state?.onboarding_completed),
      menuTourCompleted: Boolean(state?.menu_tour_completed),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { complete };
