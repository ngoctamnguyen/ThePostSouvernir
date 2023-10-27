const express = require('express')
const router = express.Router()

const { addUser} = require('../controllers/usersControllers')

router.post('/', addUser)

module.exports = router;