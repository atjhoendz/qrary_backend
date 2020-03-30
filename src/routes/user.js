const express = require('express');
const router = express.Router();
const { getAll, getPaginate, find, deleteUser, update, updatePassword, updateRole } = require('../controllers/UserController');
const { isContainReqData, isPageaNumber } = require('../middlewares/auth');

router.get('/getAll', getAll);
router.get('/page/:page/limit/:limit', isPageaNumber, getPaginate);
router.get('/find/:key/:value', find);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', isContainReqData, update);
router.put('/update/pwd/:id', isContainReqData, updatePassword);
router.put('/update/role/:id', isContainReqData, updateRole);

module.exports = router;