const express = require('express');
const router = express.Router();
const { getAll, getPaginate, find, deleteUser, update, updatePassword, setModePinjam, resetPassword, sendMailResetPWD } = require('../controllers/UserController');
const { isAuth, isContainReqData, isAuthorized, isQueryValid } = require('../middlewares/auth');

router.get('/', isAuth, isAuthorized, getAll); // /user/
router.get('/paginate', isAuth, isAuthorized, getPaginate); // /user/paginate?page=1&limit=1
router.get('/find', isAuth, isQueryValid, find); // /user/find?key=nama&value=blabla
router.delete('/:id', isAuth, isAuthorized, deleteUser); // /user/:id
router.put('/:id', isAuth, isContainReqData, update); // /user/:id
router.put('/password/:npm', isAuth, isContainReqData, updatePassword); // /user/password/:npm
router.post('/modepinjam', isAuth, isAuthorized, isContainReqData, setModePinjam); // /user/modepinjam
router.get('/password/reset', resetPassword); // /user/password/reset/
router.post('/password/sendmail', isContainReqData, sendMailResetPWD); // /user/password/sendmail/

module.exports = router;