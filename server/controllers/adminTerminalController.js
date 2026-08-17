const crypto = require('crypto');
const { promisify } = require('util');
const AdminTerminal = require('../models/AdminTerminal');
const Session = require('../models/Session');
const { securityAudit } = require('../utils/securityAudit');

const scryptAsync = promisify(crypto.scrypt);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROOT_ADMIN_EMAIL = String(process.env.ROOT_ADMIN_EMAIL || 'arthurdealmeida124@gmail.com').trim().toLowerCase();
const ROOT_ADMIN_UUID = String(process.env.ROOT_ADMIN_UUID || '').trim().toLowerCase();

function tokenFrom(request) {
  const value = request.get('authorization') || '';
  return value.startsWith('Bearer ') ? value.slice(7).trim() : '';
}

async function requireAdmin(request, response) {
  const actor = await Session.findValid(tokenFrom(request));
  if (!actor || !actor.is_admin) {
    response.status(403).json({ error: 'Terminal restrito a administradores.', code: 'ADMIN_REQUIRED' });
    return null;
  }
  return actor;
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scryptAsync(password, salt, 64);
  return `scrypt:${salt}:${key.toString('hex')}`;
}

function publicAccount(row) {
  if (!row) return null;
  const { id, ...safe } = row;
  return safe;
}

async function uniqueUsername(email) {
  const base = email.split('@')[0]
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_+|_+$/g, '')
    .slice(0, 18) || 'Agente';
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const suffix = attempt ? `_${crypto.randomInt(1000, 9999)}` : '';
    const candidate = `${base}${suffix}`.slice(0, 24).padEnd(3, '_');
    if (!await AdminTerminal.usernameExists(candidate)) return candidate;
  }
  throw new Error('Não foi possível gerar um nome de usuário exclusivo.');
}

async function listAccounts(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    response.json({ accounts: (await AdminTerminal.listAccounts()).map(publicAccount) });
  } catch (error) { next(error); }
}

async function viewAccount(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const account = await AdminTerminal.findAccount(request.params.uuid);
    if (!account) return response.status(404).json({ error: 'Conta não encontrada.' });
    const inventory = await AdminTerminal.inventory(account.id);
    response.json({ account: publicAccount(account), inventory });
  } catch (error) { next(error); }
}

async function createAccount(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const email = String(request.body?.email || '').trim().toLowerCase();
    const password = String(request.body?.password || '');
    const role = String(request.body?.role || 'player').trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email) || email.length > 320) return response.status(400).json({ error: 'E-mail inválido.' });
    if (password.length < 8 || password.length > 72) return response.status(400).json({ error: 'A senha deve ter entre 8 e 72 caracteres.' });
    if (!['player', 'admin'].includes(role)) return response.status(400).json({ error: 'Use a função player ou admin.' });
    if (await AdminTerminal.emailExists(email)) return response.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    const account = await AdminTerminal.createAccount({
      username: await uniqueUsername(email), email,
      passwordHash: await hashPassword(password), isAdmin: role === 'admin',
    });
    securityAudit('admin_account_create', request, { userId: actor.id, target: account.uuid, role, success: true });
    response.status(201).json({ account: publicAccount(account) });
  } catch (error) { next(error); }
}

async function banAccount(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const account = await AdminTerminal.banAccount(request.params.uuid);
    if (!account) return response.status(404).json({ error: 'Conta inexistente ou administrativa.' });
    await AdminTerminal.revokeSessions(account.id);
    securityAudit('admin_account_ban', request, { userId: actor.id, target: account.uuid, success: true });
    response.json({ account: publicAccount(account) });
  } catch (error) { next(error); }
}

async function updateCore(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const reset = request.body?.reset === true;
    const setExact = request.body?.set === true;
    const amount = reset ? 0 : Number(request.body?.amount);
    const minimum = setExact ? 0 : 1;
    const maximum = setExact ? 1000000 : 100000;
    if (!reset && (!Number.isInteger(amount) || amount < minimum || amount > maximum)) {
      return response.status(400).json({ error: `Informe uma quantidade inteira entre ${minimum} e ${maximum}.` });
    }
    const account = await AdminTerminal.setCore(request.params.uuid, amount, { add: !reset && !setExact });
    if (!account) return response.status(404).json({ error: 'Conta não encontrada.' });
    const auditEvent = reset ? 'admin_core_reset' : setExact ? 'admin_core_set' : 'admin_core_grant';
    securityAudit(auditEvent, request, { userId: actor.id, target: account.uuid, amount, success: true });
    response.json({ account });
  } catch (error) { next(error); }
}

function isRootAdmin(account) {
  const email = String(account?.email || '').trim().toLowerCase();
  const uuid = String(account?.uuid || '').trim().toLowerCase();
  return Boolean((ROOT_ADMIN_EMAIL && email === ROOT_ADMIN_EMAIL)
    || (ROOT_ADMIN_UUID && uuid === ROOT_ADMIN_UUID));
}

async function updateRole(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const role = String(request.body?.role || '').trim().toLowerCase();
    if (!['admin', 'player'].includes(role)) {
      return response.status(400).json({ error: 'A função deve ser admin ou player.' });
    }
    const current = await AdminTerminal.findAccount(request.params.target);
    if (!current) return response.status(404).json({ error: 'Conta não encontrada.' });
    if (role === 'player' && isRootAdmin(current)) {
      securityAudit('admin_role_revoke_denied', request, {
        userId: actor.id, target: current.uuid, success: false,
      });
      return response.status(403).json({
        error: '[ERROR] Action denied: Root admin permissions cannot be revoked.',
        code: 'ROOT_ADMIN_PROTECTED',
      });
    }
    const account = await AdminTerminal.setAdminRole(request.params.target, role === 'admin');
    securityAudit(role === 'admin' ? 'admin_role_grant' : 'admin_role_revoke', request, {
      userId: actor.id, target: account.uuid, role, success: true,
    });
    response.json({ account: publicAccount(account), role });
  } catch (error) { next(error); }
}

async function mutateInventory(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const item = AdminTerminal.resolveItem(request.params.item);
    if (!item) return response.status(404).json({ error: 'Item desconhecido no catálogo do jogo.' });
    const grant = request.method === 'POST';
    const result = await AdminTerminal.mutateInventory(request.params.target, item, grant);
    if (!result) return response.status(404).json({ error: 'Conta não encontrada.' });
    securityAudit(grant ? 'admin_inventory_grant' : 'admin_inventory_revoke', request, {
      userId: actor.id, target: result.account.uuid, item: item.id, success: true,
    });
    response.json({ account: publicAccount(result.account), item });
  } catch (error) { next(error); }
}

async function kickPlayer(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const account = await AdminTerminal.findAccount(request.params.target);
    if (!account) return response.status(404).json({ error: 'Conta não encontrada.' });
    if (account.is_admin) return response.status(400).json({ error: 'Uma conta administrativa não pode ser removida.' });
    const reason = String(request.body?.reason || 'Removido por um administrador.').trim().slice(0, 180);
    await AdminTerminal.createEvent({ type: 'kick', targetUserId: account.id, message: reason, createdBy: actor.id });
    // Mantém a sessão por uma janela curta para que o cliente receba o evento
    // de expulsão; depois disso, a revogação no servidor impede reconexão.
    setTimeout(() => void AdminTerminal.revokeSessions(account.id).catch(() => {}), 7000).unref?.();
    securityAudit('admin_player_kick', request, { userId: actor.id, target: account.uuid, success: true });
    response.json({ account: publicAccount(account), reason });
  } catch (error) { next(error); }
}

async function broadcast(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    const message = String(request.body?.message || '').trim();
    if (!message || message.length > 180) return response.status(400).json({ error: 'A mensagem deve ter entre 1 e 180 caracteres.' });
    const event = await AdminTerminal.createEvent({ type: 'broadcast', message, createdBy: actor.id });
    securityAudit('admin_broadcast', request, { userId: actor.id, success: true });
    response.status(201).json({ event });
  } catch (error) { next(error); }
}

async function pollEvents(request, response, next) {
  try {
    const token = tokenFrom(request);
    const session = token ? await Session.findValid(token) : null;
    const after = Math.max(0, Number.parseInt(request.query.after, 10) || 0);
    response.json({ events: await AdminTerminal.eventsFor(session?.id || null, after) });
  } catch (error) { next(error); }
}

async function ping(request, response, next) {
  try {
    const actor = await requireAdmin(request, response); if (!actor) return;
    response.json({ ok: true, ...(await AdminTerminal.ping()) });
  } catch (error) { next(error); }
}

module.exports = {
  banAccount, broadcast, createAccount, kickPlayer, listAccounts, mutateInventory,
  ping, pollEvents, updateCore, updateRole, viewAccount,
};
