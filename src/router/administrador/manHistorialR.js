const express = require('express');
const manHistorial = require('../../controllers/administrador/manHistorial.js');
const router = express.Router();

router.get('/renderHistorial', manHistorial.renderHistorial);
router.get('/manPagosConsulta', manHistorial.manPagos);
router.get('/manIncidenciasConsulta', manHistorial.manIncidencias);
router.get('/manSeguimientoConsulta', manHistorial.manSeguimiento);
router.get('/manHistorialEspesifico-:campo', manHistorial.manHistorialEspesifico)
router.post('/consultaEspesifica', manHistorial.consultaEspesifica);

module.exports = router;