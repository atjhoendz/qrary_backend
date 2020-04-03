const express = require('express');
const router = express.Router();
const auth = require('./auth');
const user = require('./user');
const buku = require('./buku');
const pengunjung = require('./pengunjung');
const FormatResponse = require('../utils/formatResponse');
const { isAuth, isAuthorized, isContainReqData } = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.status(200).json(
        FormatResponse(true, 200, {}, 'Qrary API is Running', true)
    );
});

router.use('/auth', isContainReqData, auth);
router.use('/user', isAuth, isAuthorized, user);
router.use('/buku', isAuth, buku);
router.use('/pengunjung', isAuth, isAuthorized, pengunjung);

module.exports = router;