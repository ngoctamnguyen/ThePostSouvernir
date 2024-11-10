const express = require('express')
const router = express.Router()

const { getItems, getItem, updateMathang, getNhomHang, getGroupItem, getNhomKiemhang, saveKiemhang, getTongKetKiemhang, getTongKetKiemhangNgay, updateItemNameUnicode} = require('../controllers/itemsControllers')

router.get('/', getItems);
router.get('/nhomhang/', getNhomHang);
router.get('/nhomhang/:manhom', getGroupItem);
router.get('/kiemhang/today/', getTongKetKiemhangNgay);
router.get('/kiemhang/thang/', getTongKetKiemhang);
router.get('/kiemhang/:manhom', getNhomKiemhang);
router.post('/kiemhang', saveKiemhang);
router.get('/:mahang', getItem);
router.put('/:mahang', updateMathang);
router.put('/itemNameUni/:mahang', updateItemNameUnicode);

module.exports = router;