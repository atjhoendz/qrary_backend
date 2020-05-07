const express = require('express');
const router = express.Router();
const { saveFromTemp, getAll, getPaginate, find, pengembalian } = require('../controllers/PeminjamanController');
const { isContainReqData, isPageaNumber, isQueryValid } = require('../middlewares/auth');

router.post('/save', isContainReqData, saveFromTemp);
router.get('/getall', getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, getPaginate);
router.get('/find', isQueryValid, find);
router.post('/kembalikan', isContainReqData, pengembalian);

module.exports = router;