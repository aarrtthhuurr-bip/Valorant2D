/**
 * Retorna informações básicas para monitoramento da aplicação.
 */
function getHealth(request, response) {
  response.status(200).json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
