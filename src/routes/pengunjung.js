const express = require('express');
const router = express.Router();
const { add, getAll, getPaginate, find, deletePengunjung } = require('../controllers/PengunjungController');
const { isContainReqData, isPageaNumber } = require('../middlewares/auth');

router.post('/add', isContainReqData, add);
router.get('/getall', getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, getPaginate);
router.get('/find/:key/:value', find);
router.delete('/delete/:id', deletePengunjung);

module.exports = router;