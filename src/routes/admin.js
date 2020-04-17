const express = require('express');
const router = express.Router();
const { addAdmin } = require('../controllers/UserController');
const { isContainReqData } = require('../middlewares/auth');

router.post('/add', isContainReqData, addAdmin);

module.exports = router;