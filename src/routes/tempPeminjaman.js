const express = require('express');
const router = express.Router();
const { getAllTempPinjam, getPengunjungToTemp, getBukuToTemp, deleteBukuAtTemp, find } = require('../controllers/TempPeminjaman');
const { isContainReqData } = require('../middlewares/auth');

router.get('/', getAllTempPinjam); // /peminjaman/temp/
router.get('/:id', find); // /peminjaman/temp/:id
router.post('/pengunjung', isContainReqData, getPengunjungToTemp); // /peminjaman/temp/pengunjung
router.post('/buku', isContainReqData, getBukuToTemp); // /peminjaman/temp/buku
router.delete('/buku', isContainReqData, deleteBukuAtTemp); // /peminjaman/temp/buku

module.exports = router;