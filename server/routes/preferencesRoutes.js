const express = require('express');
const preferencesController = require('../controllers/preferencesController');

const router = express.Router();

router.get('/', preferencesController.getPreferences);
router.put('/', preferencesController.updatePreferences);

module.exports = router;
