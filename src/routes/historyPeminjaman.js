const express = require('express');
const router = express.Router();
const { getAll, getPaginate, find } = require('../controllers/HistoryPeminjamanController');
const { isPageaNumber } = require('../middlewares/auth');

router.get('/', getAll); // /historypeminjaman/
router.get('/paginate', getPaginate); // /historypeminjaman/paginate?page=1&limit=1
router.get('/find', find); // /historypeminjaman/find?key=nama&value=ininama

module.exports = router;