const express = require('express');
const onboardingController = require('../controllers/onboardingController');
const { authenticatedWriteLimiter } = require('../middleware/security');

const router = express.Router();

router.put('/', authenticatedWriteLimiter, onboardingController.complete);

module.exports = router;
