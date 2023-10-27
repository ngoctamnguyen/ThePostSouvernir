const express = require('express')
const router = express.Router()

const { getTygia } = require('../controllers/tygiaControllers')

router.get('/', getTygia);

module.exports = router;