const express = require ('express');
const authControler= require("../controllers/auth");
const router = express.Router();

router.post('/', authControler.login);

module.exports = router;