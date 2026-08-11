const express = require('express');
const controller = require('../controllers/commerceController');
const { authenticatedWriteLimiter } = require('../middleware/security');

const router = express.Router();
router.get('/', controller.getProfile);
router.get('/daily-login', controller.getDailyLogin);
router.post('/daily-login/claim', authenticatedWriteLimiter, controller.claimDailyLogin);
router.post('/skins/:skinId/purchase', authenticatedWriteLimiter, controller.purchaseSkin);
router.put('/inventory/:weaponId', authenticatedWriteLimiter, controller.equipSkin);
router.post('/gadgets/:gadgetId/purchase', authenticatedWriteLimiter, controller.purchaseGadget);
router.put('/gadgets/:gadgetId/equip', authenticatedWriteLimiter, controller.equipGadget);
router.post('/missions/:assignmentId/claim', authenticatedWriteLimiter, controller.claimMission);
router.post('/codes/redeem', authenticatedWriteLimiter, controller.redeemCode);
router.post('/admin/codes', authenticatedWriteLimiter, controller.createCode);
router.post('/admin/skins/:skinId/grant', authenticatedWriteLimiter, controller.grantAdminSkin);

module.exports = router;
