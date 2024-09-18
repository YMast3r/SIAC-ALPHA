//modulos
const express = require('express');
const manPropiedadControllers = require('../../controllers/administrador/manPropiedad');
const router = express.Router();

// funciones para el super administrador
router.get('/renderManPropiedad', manPropiedadControllers.renderManPropiedad);
router.get('/manPropiedad', manPropiedadControllers.manPropiedad);
router.post('/altaTipoPropiedad', manPropiedadControllers.altaTipoPropiedad);
router.post('/altaPropiedad', manPropiedadControllers.altaPropiedad);

module.exports = router;
