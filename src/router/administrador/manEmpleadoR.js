const express = require('express');
const manEmpleado = require('../../controllers/administrador/manEmpleados');
const router = express.Router();

router.get('/renderEmpleados', manEmpleado.renderEmpleados);
router.post('/registrarEmpleado', manEmpleado.registrarEmpleado);
router.get('/manEmpleados', manEmpleado.manEmpleados);
router.get('/ediEmpleados', manEmpleado.ediEmpleados);
router.get('/manipulaEmpleados', manEmpleado.manipulaEmpleados);

module.exports = router;