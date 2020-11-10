const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/data/coverbuku/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const { isAuthorized, isContainReqData, isQueryValid } = require('../middlewares/auth')
const { add, getAll, getPaginate, getRecentBook, find, deleteBuku, update, updateCover } = require('../controllers/BukuController')

router.get('/', getAll); // /buku
router.get('/paginate', getPaginate); // /buku/paginate?page=1&limit=1
router.get('/find', isQueryValid, find); // /buku/find?key=judul&value=bukupemrograman
router.get('/recent', getRecentBook); // /buku/recent?limit=6
router.post('/', isAuthorized, upload.single('coverBuku'), add); // /buku
router.delete('/:id', isAuthorized, deleteBuku); // /buku/:id
router.put('/:id', isAuthorized, isContainReqData, update); // /buku/:id
router.put('/:id/cover', isAuthorized, upload.single('coverBuku'), updateCover) // /buku/:id/cover

module.exports = router;