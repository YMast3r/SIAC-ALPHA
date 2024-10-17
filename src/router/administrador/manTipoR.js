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
    manTipo.manTipo(req, res, 'tipo_pago', 'id_tipo_pago', 'descripcion', formFields);
});

// Ruta para manejar 'manTipoPago'
router.get('/manTipoIncidencia', (req, res) => {
    const formFields = [
        { label: 'Descripción', type: 'text', name: 'descripcion', required: true }
    ];
    req.session.errorBorrarR = 'tipo_incidencia';
    manTipo.manTipo(req, res, 'tipo_incidencia', 'id_tipo_incidencia', 'descripcion', formFields);
});

// Ruta para renderizar manTipoUsuario general (ejemplo con 'altaTipo')
router.get('/manTipoUsuario', (req, res) => {
    const formFields = [
        { label: 'Descripción', type: 'text', name: 'descripcion', required: true }
    ];
    req.session.errorBorrarR = 'tipo_usuario';
    manTipo.manTipo(req, res, 'tipo_usuario', 'id_tipo_usuario', 'descripcion', formFields);
});

// Ruta para manejar el alta de un tipo de pago
router.post('/altaTipo', manTipo.altaTipo);

module.exports = router;