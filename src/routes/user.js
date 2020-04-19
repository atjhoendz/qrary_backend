const express = require('express');
const router = express.Router();
const { getAll, getPaginate, find, deleteUser, update, updatePassword, setModePinjam } = require('../controllers/UserController');
const { isContainReqData, isPageaNumber, isAuthorized } = require('../middlewares/auth');

router.get('/getAll', isAuthorized, getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, isAuthorized, getPaginate);
router.get('/find/:key/:value', find);
router.delete('/delete/:id', isAuthorized, deleteUser);
router.put('/update/:id', isAuthorized, isContainReqData, update);
router.put('/update/pwd/:id', isAuthorized, isContainReqData, updatePassword);
router.post('/setmodepinjam', isAuthorized, isContainReqData, setModePinjam);

module.exports = router;