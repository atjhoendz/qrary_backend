const express = require('express');
const router = express.Router();
const { getAllTempPinjam, getPengunjungToTemp, getBukuToTemp, deleteBukuAtTemp, find } = require('../controllers/TempPeminjaman');
const { isContainReqData } = require('../middlewares/auth');

router.get('/get/all', getAllTempPinjam);
router.post('/get/pengunjung', isContainReqData, getPengunjungToTemp);
router.post('/add/buku', isContainReqData, getBukuToTemp);
router.post('/delete/buku', isContainReqData, deleteBukuAtTemp);
router.get('/find/:id', find);

module.exports = router;