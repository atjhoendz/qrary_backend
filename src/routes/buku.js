const express = require('express');
const router = express.Router();
const { isAuthorized, isContainReqData, isQueryValid } = require('../middlewares/auth');
const { add, getAll, getPaginate, getRecentBook, find, deleteBuku, update } = require('../controllers/BukuController');

router.get('/', getAll); // /buku
router.get('/paginate', getPaginate); // /buku/paginate?page=1&limit=1
router.get('/find', isQueryValid, find); // /buku/find?key=judul&value=bukupemrograman
router.get('/recent', getRecentBook); // /buku/recent?limit=6
router.post('/', isAuthorized, isContainReqData, add); // /buku
router.delete('/:id', isAuthorized, deleteBuku); // /buku/:id
router.put('/:id', isAuthorized, isContainReqData, update); // /buku/:id

module.exports = router;