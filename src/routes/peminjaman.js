const express = require('express');
const router = express.Router();
const { saveFromTemp, getAll, getPaginate, find } = require('../controllers/PeminjamanController');
const { isContainReqData, isPageaNumber } = require('../middlewares/auth');

router.post('/save', isContainReqData, saveFromTemp);
router.get('/getall', getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, getPaginate);
router.get('/find/:key/:value', find);

module.exports = router;