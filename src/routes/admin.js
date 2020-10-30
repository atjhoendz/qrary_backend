const express = require('express');
const router = express.Router();
const { addAdmin, getAll, find, getPaginate, deleteAdmin, update, updatePassword, updateRole } = require('../controllers/AdminController');
const { isContainReqData, isAuth, isAuthorized, isValidNIP, isQueryValid } = require('../middlewares/auth');

router.get('/', isAuth, isAuthorized, getAll); // /admin/
router.get('/find', isAuth, isAuthorized, isQueryValid, find); // /admin/find?key=nama&value=ininama
router.get('/paginate', isAuth, isAuthorized, getPaginate); // /admin/paginate?page=1&limit=1
router.post('/', isContainReqData, isValidNIP, addAdmin); // /admin/
router.delete('/:id', isAuth, isAuthorized, deleteAdmin); // /admin/:id
router.put('/:id', isAuth, isAuthorized, isContainReqData, update); // /admin/:id
router.put('/role/:id', isAuth, isAuthorized, isContainReqData, updateRole); // /admin/role/:id
router.put('/password/:id', isAuth, isAuthorized, isContainReqData, updatePassword); // /admin/password/:id

module.exports = router;