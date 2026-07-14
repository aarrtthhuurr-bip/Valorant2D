const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify', authController.verify);
router.post('/logout', authController.logout);
router.post('/security-question', authController.getSecurityQuestion);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
