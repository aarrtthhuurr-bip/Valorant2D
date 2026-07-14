const express = require('express');
const statisticsController = require('../controllers/statisticsController');

const router = express.Router();

router.get('/', statisticsController.getStatistics);
router.post('/match', statisticsController.recordMatch);

module.exports = router;
