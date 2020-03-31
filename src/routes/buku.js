const express = require('express');
const router = express.Router();
const { isAuthorized, isContainReqData, isPageaNumber } = require('../middlewares/auth');
const { add, getAll, getPaginate, find, deleteBuku, update } = require('../controllers/BukuController');

router.get('/getall', getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, getPaginate);
router.get('/find/:key/:value', find);
router.post('/add', isAuthorized, isContainReqData, add);
router.delete('/delete/:id', isAuthorized, deleteBuku);
router.put('/update/:id', isAuthorized, isContainReqData, update);

module.exports = router;