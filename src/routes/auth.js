const express = require('express');
const router = express.Router();
const { login, register, sendOTP, verifyOTP, getDataPaus } = require('../controllers/AuthController');
const { isValidNPM, isContainReqData } = require('../middlewares/auth');

router.post('/login', isContainReqData, login);
router.post('/register', isContainReqData, isValidNPM, register);
router.post('/send/OTP', isContainReqData, sendOTP);
router.post('/verify/OTP', isContainReqData, verifyOTP);
router.get('/npmdata/:npm', getDataPaus)

module.exports = router;