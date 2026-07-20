const Commerce = require('../models/Commerce');
const Session = require('../models/Session');
const { securityAudit } = require('../utils/securityAudit');

function extractToken(request) {
  const authorization = request.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

async function userFromSession(request, response) {
  const user = await Session.findValid(extractToken(request));
  if (!user) response.status(401).json({ error: 'Sessão inválida ou expirada.', code: 'INVALID_SESSION' });
  return user;
}

const ERRORS = {
  SKIN_NOT_FOUND: [404, 'Skin não encontrada.'], SKIN_ALREADY_OWNED: [409, 'Esta skin já pertence ao seu inventário.'],
  INSUFFICIENT_CORE: [409, 'Saldo de Core insuficiente.'], INVALID_WEAPON: [400, 'Arma inválida.'],
  INVALID_SKIN_FOR_WEAPON: [400, 'Esta skin não pertence à arma informada.'], SKIN_NOT_OWNED: [403, 'Adquira a skin antes de equipá-la.'],
  MISSION_NOT_FOUND: [404, 'Missão não encontrada.'], MISSION_ALREADY_CLAIMED: [409, 'Recompensa já resgatada.'],
  MISSION_INCOMPLETE: [409, 'Complete a missão antes de resgatar.'], INVALID_CODE: [400, 'Código inválido.'],
  ADMIN_REQUIRED: [403, 'Acesso administrativo necessário.'], CODE_ALREADY_EXISTS: [409, 'Este código já existe.'],
  CODE_NOT_FOUND: [404, 'Código inexistente ou inativo.'], CODE_ALREADY_REDEEMED: [409, 'Este código já foi resgatado por sua conta.'],
};

function sendResult(response, result, successStatus = 200) {
  if (!result.error) { response.status(successStatus).json(result); return; }
  const [status, message] = ERRORS[result.error] || [400, 'Não foi possível concluir a operação.'];
  response.status(status).json({ error: message, code: result.error, ...(result.coreBalance !== undefined ? { coreBalance: result.coreBalance } : {}) });
}

async function getProfile(request, response, next) {
  try { const user = await userFromSession(request, response); if (user) response.json(await Commerce.profile(user.id)); } catch (error) { next(error); }
}

async function purchaseSkin(request, response, next) {
  try {
    const user = await userFromSession(request, response); if (!user) return;
    const result = await Commerce.purchaseSkin(user.id, String(request.params.skinId || ''));
    securityAudit('skin_purchase', request, { userId: user.id, skinId: request.params.skinId, success: !result.error });
    sendResult(response, result, 201);
  } catch (error) { next(error); }
}

async function equipSkin(request, response, next) {
  try {
    const user = await userFromSession(request, response); if (!user) return;
    sendResult(response, await Commerce.equipSkin(user.id, String(request.params.weaponId || ''), request.body?.skinId ?? null));
  } catch (error) { next(error); }
}

async function claimMission(request, response, next) {
  try {
    const user = await userFromSession(request, response); if (!user) return;
    sendResult(response, await Commerce.claimMission(user.id, request.params.assignmentId));
  } catch (error) { next(error); }
}

async function redeemCode(request, response, next) {
  try {
    const user = await userFromSession(request, response); if (!user) return;
    const result = await Commerce.redeemCode(user.id, request.body?.code);
    securityAudit('promo_redeem', request, { userId: user.id, success: !result.error });
    sendResult(response, result);
  } catch (error) { next(error); }
}

async function createCode(request, response, next) {
  try {
    const user = await userFromSession(request, response); if (!user) return;
    const amount = Number(request.body?.coreAmount);
    const result = await Commerce.createCode(user.id, request.body?.code, amount);
    securityAudit('promo_create', request, { userId: user.id, success: !result.error });
    sendResult(response, result, 201);
  } catch (error) { next(error); }
}

module.exports = { claimMission, createCode, equipSkin, getProfile, purchaseSkin, redeemCode };
