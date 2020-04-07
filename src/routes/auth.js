const express = require('express');
const router = express.Router();
const { login, register, sendOTP, verifyOTP } = require('../controllers/AuthController');
const { isValidNPM, isAuth } = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', isValidNPM, register);
router.post('/send/OTP', sendOTP);
router.post('/verify/OTP', verifyOTP);

module.exports = router;