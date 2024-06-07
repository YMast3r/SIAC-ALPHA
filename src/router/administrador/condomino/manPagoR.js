//modulos
const express = require('express');
const pagoController = require('../../../controllers/administrador/condomino/manPago');
const router = express.Router();

router.get('/renderPago', pagoController.renderPago);
router.get('/manPago-:id', pagoController.manPago);
router.post('/altaPago', pagoController.altaPago);
router.get('/recuperarPropiedadPago-:id', pagoController.recuperarPropiedadPago);
router.get('/renderRecuperarPropiedadPago', pagoController.renderRecuperarPropiedadPago);


module.exports = router;