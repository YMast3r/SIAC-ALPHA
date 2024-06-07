//modulos
const express = require('express');
const incidenciaController = require('../../../controllers/administrador/condomino/manIncidencia');
const router = express.Router();

router.get('/renderIncidencia', incidenciaController.renderIncidencia);
router.get('/manIncidencia-:id', incidenciaController.manIncidencia);
router.post('/altaIncidencia', incidenciaController.altaIncidencia);

module.exports = router;