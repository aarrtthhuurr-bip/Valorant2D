const express = require('express');
const controller = require('../controllers/adminTerminalController');
const { authenticatedWriteLimiter } = require('../middleware/security');

const router = express.Router();
router.get('/accounts', controller.listAccounts);
router.get('/accounts/:uuid', controller.viewAccount);
router.post('/accounts', authenticatedWriteLimiter, controller.createAccount);
router.post('/accounts/:uuid/ban', authenticatedWriteLimiter, controller.banAccount);
router.post('/accounts/:uuid/core', authenticatedWriteLimiter, controller.updateCore);

module.exports = router;
