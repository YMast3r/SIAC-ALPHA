const express = require('express');
const manHistorial = require('../../controllers/administrador/manHistorial.js');
const router = express.Router();

router.get('/renHistorial', manHistorial.renHistorial);

module.exports = router;