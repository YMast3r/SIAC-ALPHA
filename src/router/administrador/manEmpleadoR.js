const express = require('express');
const manEmpleado = require('../../controllers/administrador/manEmpleados');
const router = express.Router();

router.get('/renAltaEmpleados', manEmpleado.renAltaEmpleados);
router.post('/registrarEmpleado', manEmpleado.registrarEmpleado);
router.get('/manEmpleados', manEmpleado.manEmpleados);

module.exports = router;