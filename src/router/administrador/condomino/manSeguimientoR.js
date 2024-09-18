//modulos
const express = require('express');
const seguimientoController = require('../../../controllers/administrador/condomino/manSeguimiento');
const router = express.Router();

router.get('/renderSeguimiento', seguimientoController.renderSeguimiento);
router.get('/manSeguimiento-:id', seguimientoController.manSeguimiento);
router.post('/altaSeguimiento', seguimientoController.altaSeguimiento);

module.exports = router;