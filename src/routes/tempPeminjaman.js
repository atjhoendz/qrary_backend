const express = require('express');
const router = express.Router();
const { getAllTempPinjam, getPengunjungToTemp, getBukuToTemp, deleteBukuAtTemp } = require('../controllers/TempPeminjaman');
const { isContainReqData } = require('../middlewares/auth');

router.get('/get/all', getAllTempPinjam);
router.post('/get/pengunjung', isContainReqData, getPengunjungToTemp);
router.post('/add/buku', isContainReqData, getBukuToTemp);
router.post('/delete/buku', isContainReqData, deleteBukuAtTemp);

module.exports = router;