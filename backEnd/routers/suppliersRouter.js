const express = require('express')
const router = express.Router()

const { getSup, addSup, editSup, deleteSup } = require('../controllers/suppliersControllers')

router.get('/', getSup)
router.post('/', addSup);
router.put('/:mancc', editSup);
router.delete('/:mancc', deleteSup);

module.exports = router;