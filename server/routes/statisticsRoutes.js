const express = require('express');
const statisticsController = require('../controllers/statisticsController');
const { authenticatedWriteLimiter } = require('../middleware/security');

const router = express.Router();

router.get('/', statisticsController.getStatistics);
router.post('/match/start', authenticatedWriteLimiter, statisticsController.startMatch);
router.post('/match', authenticatedWriteLimiter, statisticsController.recordMatch);

module.exports = router;
