const express = require('express');
const router = express.Router();
const { register, login, logout, verifyOtp, resendOtp } = require('../controllers/authController');
const requireAuth = require('../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/logout', requireAuth, logout);

module.exports = router;
