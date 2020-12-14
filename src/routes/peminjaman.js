const express = require('express');
const router = express.Router();
const { saveFromTemp, getAll, getPaginate, find, pengembalian } = require('../controllers/PeminjamanController');
const { isContainReqData, isQueryValid } = require('../middlewares/auth');

router.post('/', isContainReqData, saveFromTemp); // /peminjaman/
router.get('/', getAll); // /peminjaman/
router.get('/paginate', getPaginate); // /peminjaman/paginate?page=1&limit=6
router.get('/find', isQueryValid, find); // /peminjaman/find?key=_id&value=iniidpeminjamannya
router.put('/', isContainReqData, pengembalian); // /peminjaman/

module.exports = router;