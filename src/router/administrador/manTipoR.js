const express = require('express');
const manTipo = require('../../controllers/administrador/manTipo');
const router = express.Router();

router.get('/renderManTipo', manTipo.renderManTipo);
router.post('/altaTipoPago', manTipo.altaTipoPago);
router.get('/manTipo', manTipo.manTipo);

module.exports = router;