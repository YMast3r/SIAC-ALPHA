const express = require('express');
const manHistorial = require('../../controllers/administrador/manHistorial.js');
const router = express.Router();

router.get('/renHistorial', manHistorial.renHistorial);
router.get('/manPagos', manHistorial.manPagos);
router.get('/manIncidencias', manHistorial.manIncidencias);
router.get('/manCondominos', manHistorial.manCondominos);
router.get('/manPropiedad', manHistorial.manPropiedad);

module.exports = router;