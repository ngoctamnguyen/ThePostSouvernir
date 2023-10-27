const express = require('express')
const router = express.Router()

const { getNcc, getDailySaleReport } = require('../controllers/reportControllers')

router.get('/suppliers', getNcc)
router.get('/dailysalereports', getDailySaleReport)

module.exports = router;