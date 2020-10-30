const express = require('express');
const router = express.Router();
const { add, getAll, getPaginate, find, deletePengunjung } = require('../controllers/PengunjungController');
const { isContainReqData, isAuthorized, isQueryValid } = require('../middlewares/auth');

router.post('/', isContainReqData, add); // /pengunjung/
router.get('/', isAuthorized, getAll); // /pengunjung/
router.get('/paginate', isAuthorized, getPaginate); // /pengunjung/paginate?page=1&limit=1
router.get('/find', isQueryValid, find); // /pengunjung/find?key=_id&value=blabla
router.delete('/:id', isAuthorized, deletePengunjung); // /pengunjung/:id

module.exports = router;