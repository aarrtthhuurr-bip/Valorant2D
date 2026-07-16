const express = require('express');
const authController = require('../controllers/authController');
const {
  loginLimiter,
  passwordResetLimiter,
  recoveryQuestionLimiter,
  registerLimiter,
} = require('../middleware/security');

const router = express.Router();

router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/verify', authController.verify);
router.post('/logout', authController.logout);
router.post('/security-question', recoveryQuestionLimiter, authController.getSecurityQuestion);
router.post('/reset-password', passwordResetLimiter, authController.resetPassword);

module.exports = router;
