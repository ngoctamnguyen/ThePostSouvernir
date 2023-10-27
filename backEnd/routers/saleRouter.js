const express = require('express')
const router = express.Router()

const { saveSale } = require('../controllers/saleController');

router.post('/', saveSale);

module.exports = router;