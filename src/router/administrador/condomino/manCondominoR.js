//modulos
const express = require('express');
const manCondominoControllers = require('../../../controllers/administrador/condomino/manCondomino');
const router = express.Router();

// funciones para el super administrador
router.get('/renderManCondomino', manCondominoControllers.renderManCondomino);
router.get('/manCondomino', manCondominoControllers.manCondomino);
router.post('/manipulaCondomino', manCondominoControllers.manipulaCondomino);
router.get('/ediCondomino:id', manCondominoControllers.ediCondomino);
router.get('/recuperarPropiedad-:id', manCondominoControllers.recuperarPropiedad);
router.get('/anexarPropiedad-:id', manCondominoControllers.anexarPropiedad);

module.exports = router;
