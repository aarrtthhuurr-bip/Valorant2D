const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');
const { authenticatedWriteLimiter } = require('../middleware/security');

const router = express.Router();

router.post('/save', authenticatedWriteLimiter, leaderboardController.saveScore);
router.get('/:mode', leaderboardController.listScores);

module.exports = router;
