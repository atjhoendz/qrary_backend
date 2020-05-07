const express = require('express');
const router = express.Router();
const { add, getAll, getPaginate, find, deletePengunjung } = require('../controllers/PengunjungController');
const { isContainReqData, isPageaNumber, isAuthorized, isQueryValid } = require('../middlewares/auth');

router.post('/add', isContainReqData, add);
router.get('/getall', isAuthorized, getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, isAuthorized, getPaginate);
router.get('/find', isQueryValid, find);
router.delete('/delete/:id', isAuthorized, deletePengunjung);

module.exports = router;