const express = require('express');
const router = express.Router();
const { addAdmin, getAll, find, getPaginate, deleteAdmin, update, updatePassword, updateRole } = require('../controllers/AdminController');
const { isContainReqData, isAuth, isAuthorized, isValidNIP } = require('../middlewares/auth');

router.get('/getall', isAuth, isAuthorized, getAll);
router.get('/find/:key/:value', isAuth, isAuthorized, find);
router.get('/page/:page/limit/:limit', isAuth, isAuthorized, getPaginate);
router.post('/add', isContainReqData, isValidNIP, addAdmin);
router.delete('/delete/:id', isAuth, isAuthorized, deleteAdmin);
router.put('/update/role', isAuth, isAuthorized, isContainReqData, updateRole);
router.put('/update/:id', isAuth, isAuthorized, isContainReqData, update);
router.put('/update/pwd/:id', isAuth, isAuthorized, isContainReqData, updatePassword);

module.exports = router;