const express = require('express')
const router = express.Router()

const { getNcc, getDailySaleReport, getItemGroup } = require('../controllers/reportControllers')

router.get('/', getItemGroup);
router.get('/suppliers', getNcc)

module.exports = router;