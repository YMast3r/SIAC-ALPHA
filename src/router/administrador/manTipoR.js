const express = require('express');
const manTipo = require('../../controllers/administrador/manTipo');
const router = express.Router();

router.get('/renderManTipo', manTipo.renderManTipo);
// Ruta para renderizar manTipoPago general (ejemplo con 'tipo_pago')
router.get('/manTipoPago', (req, res) => {
    const formFields = [
        { label: 'Descripción', type: 'text', name: 'descripcion', required: true },
        { label: 'Precio', type: 'tel', name: 'precio', required: true }
    ];
    req.session.errorBorrarR = 'tipo_pago';
    manTipo.manTipo(req, res, 'tipo_pago', 'id_tipo_pago', 'descripcion', null, formFields);
});

// Ruta para manejar 'manTipoPago'
router.get('/manTipoIncidencia', (req, res) => {
    const formFields = [
        { label: 'Descripción', type: 'text', name: 'descripcion', required: true }
    ];
    req.session.errorBorrarR = 'tipo_incidencia';
    manTipo.manTipo(req, res, 'tipo_incidencia', 'id_tipo_incidencia', 'descripcion', null, formFields);
});

// Ruta para renderizar manTipoUsuario general (ejemplo con 'altaTipo')
router.get('/manTipoEmpleado', (req, res) => {
    const formFields = [
        { label: 'Descripción', type: 'text', name: 'descripcion', required: true },
        { label: 'Salario', type: 'tel', name: 'precio', required: true }
    ];
    req.session.errorBorrarR = 'tipo_empleado';
    manTipo.manTipo(req, res, 'tipo_empleado', 'id_tipo_empleado', 'descripcion', null, formFields);
});

// Ruta para manejar 'manTipoPago'
router.get('/manClasificacion', (req, res) => {
    const formFields = [
        { label: 'Descripción', type: 'text', name: 'descripcion', required: true },
        { label: 'Tipo de Incidencia', type: 'select', name: 'tipo_incidencia', required: true, options: [] }
    ];
    req.session.errorBorrarR = 'clasificacion_incidencia';
    manTipo.manTipo(req, res, 'clasificacion_incidencia', 'id_clasificacion_incidencia', 'descripcion', 'tipo_incidencia', formFields);
});

// Ruta para manejar el alta de un tipo de pago
router.post('/altaTipo', manTipo.altaTipo);

module.exports = router;