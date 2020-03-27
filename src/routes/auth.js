const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/AuthController');
const { isValidNPM } = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', isValidNPM, register);

module.exports = router;
