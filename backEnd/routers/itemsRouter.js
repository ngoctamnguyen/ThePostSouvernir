const express = require('express')
const router = express.Router()

const { getItems, getItem, updateMathang} = require('../controllers/itemsControllers')

router.get('/', getItems);
router.get('/:mahang', getItem);
router.put('/:mahang', updateMathang);

module.exports = router;