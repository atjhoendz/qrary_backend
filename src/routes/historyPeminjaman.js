const express = require('express');
const router = express.Router();
const { getAll, getPaginate, find } = require('../controllers/HistoryPeminjamanController');
const { isPageaNumber } = require('../middlewares/auth');

router.get('/getall', getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, getPaginate);
router.get('/find', find);

module.exports = router;