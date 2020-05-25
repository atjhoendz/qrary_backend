const express = require('express');
const router = express.Router();
const { getAll, getPaginate, find, deleteUser, update, updatePassword, setModePinjam, resetPassword, sendMailResetPWD } = require('../controllers/UserController');
const { isAuth, isContainReqData, isPageaNumber, isAuthorized, isQueryValid } = require('../middlewares/auth');

router.get('/getAll', isAuth, isAuthorized, getAll);
router.get('/page/:page/limit/:limit', isAuth, isPageaNumber, isAuthorized, getPaginate);
router.get('/find', isAuth, isQueryValid, find);
router.delete('/delete/:id', isAuth, isAuthorized, deleteUser);
router.put('/update/:id', isAuth, isAuthorized, isContainReqData, update);
router.put('/update/pwd/:npm', isAuth, isAuthorized, isContainReqData, updatePassword);
router.post('/setmodepinjam', isAuth, isAuthorized, isContainReqData, setModePinjam);
router.get('/reset/pwd', resetPassword);
router.post('/reset/pwd/sendEmail', isContainReqData, sendMailResetPWD);

module.exports = router;