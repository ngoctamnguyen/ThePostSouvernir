const express = require('express')
const router = express.Router()

const { getBillNumber} = require('../controllers/billControllers')

router.get('/', getBillNumber);

module.exports = router;