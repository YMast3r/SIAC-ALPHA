const express = require('express');
const manTipo = require('../../controllers/administrador/manTipo');
const router = express.Router();

// Configuración centralizada de tipos
const tiposConfig = {
    manTipoPago: {
        tabla: 'tipo_pago',
        id: 'id_tipo_pago',
        titulo: 'Tipo pago',
        formFields: [
            { label: 'Tipo pago', type: 'text', name: 'descripcion', required: true },
            { label: 'Precio', type: 'tel', name: 'precio', required: true },
            { label: 'Recargo', type: 'tel', name: 'recargo', required: true },
        ],
    },
    manTipoPropiedad: {
        tabla: 'tipo_propiedad',
        id: 'id_tipo_propiedad',
        titulo: 'Tipo propiedad',
        formFields: [
            { label: 'Tipo propiedad', type: 'text', name: 'descripcion', required: true },
            { label: 'Pago', type: 'tel', name: 'precio', required: true },
            { label: 'Recargo', type: 'tel', name: 'recargo', required: true },
        ],
    },
    manTipoIncidencia: {
        tabla: 'tipo_incidencia',
        id: 'id_tipo_incidencia',
        titulo: 'Tipo incidencia',
        formFields: [
            { label: 'Tipo incidencia', type: 'text', name: 'descripcion', required: true },
        ],
    },
    manTipoEmpleado: {
        tabla: 'tipo_empleado',
        id: 'id_tipo_empleado',
        titulo: 'Tipo empleado',
        formFields: [
            { label: 'Tipo empleado', type: 'text', name: 'descripcion', required: true },
            { label: 'Salario', type: 'tel', name: 'precio', required: true },
        ],
    },
    manClasificacion: {
        tabla: 'clasificacion_incidencia',
        id: 'id_clasificacion_incidencia',
        titulo: 'Clasificación incidencia',
        formFields: [
            { label: 'Clasificación incidencia', type: 'text', name: 'descripcion', required: true },
            { label: 'Tipo de Incidencia', type: 'select', name: 'tipo_incidencia', required: true, options: [] },
        ],
    },
};

// Generador dinámico de rutas
Object.entries(tiposConfig).forEach(([ruta, config]) => {
    router.get(`/${ruta}`, (req, res) => {
        req.session.errorBorrarR = config.tabla;
        manTipo.manTipo(req, res, config.tabla, config.id, config.titulo, config.formFields);
    });
});

// Página de gestión de tipos
router.get('/manPaginaTipo', (req, res) => {
    req.session.errorMT = '';
    req.session.dataCampos = '';
    req.session.altaTDM = '';
    res.render('usuarios/administrador/manPaginaTipo', {
        name: req.session.name,
        tipoUsuario: 2,
    });
});

// Alta de un tipo
router.post('/altaTipo', manTipo.altaTipo);

module.exports = router;
