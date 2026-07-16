const crypto = require('crypto');

function anonymousIdentifier(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value)).digest('hex').slice(0, 16);
}

function securityAudit(event, request, details = {}) {
  const entry = {
    type: 'security_audit',
    event,
    requestId: request?.id,
    ip: request?.ip,
    actor: anonymousIdentifier(details.username || details.userId),
    success: details.success === true,
    timestamp: new Date().toISOString(),
  };
  console.info(JSON.stringify(entry));
}

module.exports = { securityAudit };
