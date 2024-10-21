const express = require('express');
const manAltaEmpleado = require('../../controllers/administrador/manAltaEmpleados');
const router = express.Router();

router.get('/renAltaEmpleados', manAltaEmpleado.renAltaEmpleados);
router.post('/registrarEmpleado', manAltaEmpleado.registrarEmpleado);

module.exports = router;