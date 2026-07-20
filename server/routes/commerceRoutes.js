const express = require('express');
const controller = require('../controllers/commerceController');
const { authenticatedWriteLimiter } = require('../middleware/security');

const router = express.Router();
router.get('/', controller.getProfile);
router.post('/skins/:skinId/purchase', authenticatedWriteLimiter, controller.purchaseSkin);
router.put('/inventory/:weaponId', authenticatedWriteLimiter, controller.equipSkin);
router.post('/missions/:assignmentId/claim', authenticatedWriteLimiter, controller.claimMission);
router.post('/codes/redeem', authenticatedWriteLimiter, controller.redeemCode);
router.post('/admin/codes', authenticatedWriteLimiter, controller.createCode);

module.exports = router;
