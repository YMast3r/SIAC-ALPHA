const express = require('express');
const manHistorial = require('../../controllers/administrador/manHistorial.js');
const router = express.Router();

router.get('/renHistorial', manHistorial.renHistorial);
router.get('/manPagosH', manHistorial.manPagos);
router.get('/manIncidenciasH', manHistorial.manIncidencias);
router.get('/manCondominosH', manHistorial.manCondominos);
router.get('/manPropiedadesH', manHistorial.manPropiedad);

module.exports = router;