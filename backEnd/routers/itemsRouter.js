const express = require('express')
const router = express.Router()

const { getItems, getItem, updateMathang, getNhomHang, getGroupItem, getNhomKiemhang, saveKiemhang} = require('../controllers/itemsControllers')

router.get('/', getItems);
router.get('/nhomhang/', getNhomHang);
router.get('/nhomhang/:manhom', getGroupItem);
router.get('/kiemhang/:manhom', getNhomKiemhang);
router.post('/kiemhang', saveKiemhang);
router.get('/:mahang', getItem);
router.put('/:mahang', updateMathang);


module.exports = router;