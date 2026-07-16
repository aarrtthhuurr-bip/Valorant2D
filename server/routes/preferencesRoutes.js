const express = require('express');
const preferencesController = require('../controllers/preferencesController');
const { authenticatedWriteLimiter } = require('../middleware/security');

const router = express.Router();

router.get('/', preferencesController.getPreferences);
router.put('/', authenticatedWriteLimiter, preferencesController.updatePreferences);

module.exports = router;
