const express = require('express');
const router = express.Router();

const auth = require('./auth');
const user = require('./user');
const buku = require('./buku');
const pengunjung = require('./pengunjung');
const tempPeminjaman = require('./tempPeminjaman');
const peminjaman = require('./peminjaman');
const historyPeminjaman = require('./historyPeminjaman');

const { sendResponse } = require('../utils/formatResponse');
const { isAuth, isAuthorized, isContainReqData } = require('../middlewares/auth');

router.get('/', (req, res) => {
    sendResponse(res, true, 200, {}, 'Qrary API is Running', true);
});

router.use('/auth', isContainReqData, auth);
router.use('/user', isAuth, isAuthorized, user);
router.use('/buku', isAuth, buku);
router.use('/pengunjung', isAuth, isAuthorized, pengunjung);
router.use('/temp/pinjam', isAuth, tempPeminjaman);
router.use('/peminjaman', isAuth, peminjaman);
router.use('/historypeminjaman', isAuth, historyPeminjaman);

module.exports = router;