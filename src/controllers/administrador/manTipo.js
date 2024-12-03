// Diccionario para formularios
const formularios = {
    clasificacion: {
        id: 'clasificacion',
        campos: [
            { label: 'Clasificación incidencia', type: 'text', name: 'descripcion', required: true },
            { label: 'Tipo de Incidencia', type: 'select', name: 'tipo_incidencia', required: true, options: [] }
        ]
    },
    pagos: {
        id: 'pagos',
        campos: [
            { label: 'Tipo pago', type: 'text', name: 'descripcion', required: true },
            { label: 'Precio', type: 'tel', name: 'precio', required: true, step: '0.00' },
            { label: 'Recargo', type: 'tel', name: 'recargo', required: true, step: '0.00' }
        ]
    },
    propiedad: {
        id: 'propiedad',
        campos: [
            { label: 'Tipo propiedad', type: 'text', name: 'descripcion', required: true },
            { label: 'Pago', type: 'tel', name: 'precio', required: true, step: '0.00' },
            { label: 'Recargo', type: 'tel', name: 'recargo', required: true, step: '0.00' }
        ]
    },
    empleado: {
        id: 'empleado',
        campos: [
            { label: 'Tipo empleado', type: 'text', name: 'descripcion', required: true },
            { label: 'Salario', type: 'tel', name: 'precio', required: true, step: '0.00' }
        ]
    },
    incidencia: {
        id: 'incidencia',
        campos: [
            { label: 'Tipo incidencia', type: 'text', name: 'descripcion', required: true }
        ]
    }
};

// Diccionario para datos de tablas
const tablas = {
    clasificacion: {
        id: 'clasificacion',
        columnas: ['clasificacion_incidencia', 'id_clasificacion_incidencia', 'Clasificación incidencia']
    },
    pagos: {
        id: 'pagos',
        columnas: ['tipo_pago', 'id_tipo_pago', 'Tipo pago']
    },
    propiedad: {
        id: 'propiedad',
        columnas: ['tipo_propiedad', 'id_tipo_propiedad', 'Tipo propiedad']
    },
    incidencia: {
        id: 'incidencia',
        columnas: ['tipo_incidencia', 'id_tipo_incidencia', 'Tipo incidencia']
    },
    empleado: {
        id: 'empleado',
        columnas: ['tipo_empleado', 'id_tipo_empleado', 'Tipo empleado']
    }
};

function renTipo(req, res) {
    const redirecciones = {
        pagos: '/manTipoPago',
        incidencia: '/manTipoIncidencia',
        clasificacion: '/manClasificacion',
        propiedad: '/manTipoPropiedad',
        empleado: '/manTipoEmpleado'
    };

    try {
        const tablaId = req.session.tablaC?.id;
        const ruta = redirecciones[tablaId] || '/manTipoEmpleado';
        res.redirect(ruta);
    } catch (error) {
        console.error('Error:', error);
        const { columnas } = req.session.tablaC || {};
        manTipo(req, res, columnas[0], columnas[1], columnas[2], req.session.formF);
    }
}


function renderManTipo(req, res) {
    req.session.errorMT = "";
    req.session.dataCampos = "";
    req.session.altaTDM = "";
    renTipo(req, res)
}

function renderManTipoAlta(req, res) {
    req.session.errorMT = "";
    req.session.dataCampos = "";

    const altaTD = req.session.altaTDM;
    req.session.formF = formularios[altaTD];
    req.session.tablaC = tablas[altaTD];

    renTipo(req, res);
}


function manTipo(req, res, tableName, idField, descriptionField, formFields, orderBy = idField, orderDirection = 'DESC') {
    if (req.session.errorBorrar !== req.session.errorBorrarR) {
        req.session.errorMT = "";
        req.session.dataCampos = "";
        req.session.altaTDM = "";
    }

    const errorT = req.session.errorMT;
    const data = req.session.dataCampos;

    // Parámetros de orden
    const orderByParam = req.query.orderBy || orderBy;
    const orderDirectionParam = req.query.orderDirection || orderDirection;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error de conexión:", err);
            return res.status(500).send("Error de conexión a la base de datos");
        }

        let query;
        let tableHeaders = [];
        let updatedFormFields = formFields.map(field => ({
            ...field,
            data: data[field.name] || "" // Asignar valor de data o vacío si no existe
        }));

        switch (tableName) {
            case "tipo_pago":
                query = `
                    SELECT ${idField}, descripcion,
                    COALESCE(CONCAT('$', FORMAT(precio, 2)), 'Por tipo de propiedad') AS precioP,
                    COALESCE(CONCAT('$', FORMAT(recargo, 2)), 'Por tipo de propiedad') AS recargoP
                    FROM ${tableName}
                    ORDER BY ${orderByParam} ${orderDirectionParam}`;
                tableHeaders = [
                    { name: 'ID', id: idField, field: idField, sortable: true },
                    { name: descriptionField, field: 'descripcion', sortable: false },
                    { name: 'Precio', id: 'precioT', field: 'precioP', sortable: true },
                    { name: 'Recargo', id: 'recargoT', field: 'recargoP', sortable: true }
                ];
                break;

            case "clasificacion_incidencia":
                // Consulta adicional para rellenar opciones del select
                conn.query('SELECT id_tipo_incidencia, descripcion FROM tipo_incidencia', (err, incidencias) => {
                    if (err) {
                        console.error("Error al obtener incidencias:", err);
                        return res.status(500).send("Error al cargar las opciones");
                    }

                    const incidenciaOptions = incidencias.map(row => ({
                        value: row.id_tipo_incidencia,
                        text: row.descripcion
                    }));

                    updatedFormFields = formFields.map(field =>
                        field.name === "tipo_incidencia"
                            ? { ...field, options: incidenciaOptions }
                            : { ...field, data: data[field.name] || "" }
                    );

                    query = `
                        SELECT a.id_clasificacion_incidencia, a.descripcion, b.descripcion AS tipo
                        FROM clasificacion_incidencia a
                        LEFT JOIN tipo_incidencia b ON a.tipo_incidencia = b.id_tipo_incidencia
                        ORDER BY ${orderByParam} ${orderDirectionParam}`;
                    tableHeaders = [
                        { name: 'ID', id: idField, field: idField, sortable: true },
                        { name: descriptionField, field: 'descripcion', sortable: false },
                        { name: 'Tipo incidencia', field: 'tipo', sortable: false }
                    ];

                    // Ejecutamos la consulta principal
                    conn.query(query, (err, rows) => {
                        if (err) {
                            console.error("Error al obtener clasificaciones:", err);
                            return res.status(500).send("Error al cargar clasificaciones");
                        }

                        renderTable(req, res, tableName, rows, tableHeaders, updatedFormFields, errorT);
                    });
                });
                return;

            case "tipo_empleado":
                query = `
                    SELECT ${idField}, descripcion, CONCAT('$', FORMAT(salario, 2)) AS salarioP
                    FROM ${tableName}
                    ORDER BY ${orderByParam} ${orderDirectionParam}`;
                tableHeaders = [
                    { name: 'ID', id: idField, field: idField, sortable: true },
                    { name: descriptionField, field: 'descripcion', sortable: false },
                    { name: 'Salario', id: 'salario', field: 'salarioP', sortable: true }
                ];
                break;

            case "tipo_propiedad":
                query = `
                    SELECT ${idField}, descripcion,
                    CONCAT('$', FORMAT(pago, 2)) AS pagoP,
                    COALESCE(CONCAT('$', FORMAT(recargo, 2)), 'Por tipo de propiedad') AS recargoP
                    FROM ${tableName}
                    ORDER BY ${orderByParam} ${orderDirectionParam}`;
                tableHeaders = [
                    { name: 'ID', id: idField, field: idField, sortable: true },
                    { name: descriptionField, field: 'descripcion', sortable: false },
                    { name: 'Pago', id: 'pago', field: 'pagoP', sortable: true },
                    { name: 'Recargo', id: 'recargoT', field: 'recargoP', sortable: true }
                ];
                break;

            default:
                query = `
                    SELECT ${idField}, descripcion
                    FROM ${tableName}
                    ORDER BY ${orderByParam} ${orderDirectionParam}`;
                tableHeaders = [
                    { name: 'ID', id: idField, field: idField, sortable: true },
                    { name: descriptionField, field: 'descripcion', sortable: false }
                ];
        }

        // Ejecutamos la consulta principal
        conn.query(query, (err, rows) => {
            if (err) {
                console.error(`Error al obtener datos de ${tableName}:`, err);
                return res.status(500).send("Error al cargar los datos");
            }
            renderTable(req, res, tableName, rows, tableHeaders, updatedFormFields, errorT);
        });
    });
}

// Función auxiliar para renderizar la tabla
function renderTable(req, res, tableName, rows, tableHeaders, formFields, errorT) {
    const tituloMap = {
        tipo_pago: "Tipo Pago",
        clasificacion_incidencia: "Clasificación Incidencia",
        tipo_empleado: "Tipo Empleado",
        tipo_propiedad: "Tipo Propiedad",
        tipo_incidencia: "Tipo Incidencia"
    };

    const titulo = tituloMap[tableName] || "Datos";

    res.render("usuarios/administrador/manTipo", {
        name: req.session.name,
        tipoUsuario: 2,
        titulo,
        tableData: rows,
        tableHeaders,
        formFields,
        orderBy: req.query.orderBy || "id",
        orderDirection: req.query.orderDirection === "ASC" ? "DESC" : "ASC",
        tipo: tableName,
        errorT
    });
}


function altaTipo(req, res) {
    const data = req.body;

    // Verifica qué tipo se está procesando
    const tipo = data.tipo;

    if (data.precio == 0.00) {
        req.session.errorMT = 'No puedes ingresar un precio de 0.00';
        req.session.dataCampos = data;
        req.session.errorBorrar = tipo;
        if (tipo === "tipo_empleado") {
            req.session.formF = formularios['empleado'];
            req.session.tablaC = tablas['empleado'];
        } else if (tipo === "tipo_propiedad") {
            req.session.formF = formularios['propiedad'];
            req.session.tablaC = tablas['propiedad'];
        } else {
            req.session.formF = formularios['pagos'];
            req.session.tablaC = tablas['pagos'];
        }
        renTipo(req, res);
        return;
    } else if (data.recargo == 0.00) {
        req.session.errorMT = 'No puedes ingresar un recargo de 0.00';
        req.session.dataCampos = data;
        req.session.errorBorrar = tipo;
        if (tipo === "tipo_empleado") {
            req.session.formF = formularios['empleado'];
            req.session.tablaC = tablas['empleado'];
        } else if (tipo === "tipo_propiedad") {
            req.session.formF = formularios['propiedad'];
            req.session.tablaC = tablas['propiedad'];
        } else {
            req.session.formF = formularios['pagos'];
            req.session.tablaC = tablas['pagos'];
        }
        renTipo(req, res);
        return;
    } else {
        req.getConnection((err, conn) => {
            if (err) {
                console.error("Error de conexión:", err);
                return res.status(500).send("Error de conexión a la base de datos");
            }

            conn.query('SELECT COUNT(*) AS cont FROM ?? WHERE descripcion = ?', [tipo, data.descripcion], (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (rows[0].cont == 0) {
                    if (data.precio) {
                        data.precio = data.precio.replace(/,/g, ''); // Remueve todas las comas del precio
                    }
                    if (data.recargo) {
                        data.recargo = data.recargo.replace(/,/g, ''); // Remueve todas las comas del precio
                    }
                    // Ajusta la consulta de inserción según el tipo
                    let insertQuery;
                    let insertParams;
                    if (tipo === "tipo_pago") {
                        insertQuery = 'INSERT INTO tipo_pago (descripcion, precio, recargo) VALUES (?, ?, ?)';
                        insertParams = [data.descripcion, data.precio, data.recargo];
                    } else if (tipo == 'clasificacion_incidencia') {
                        insertQuery = 'INSERT INTO clasificacion_incidencia (descripcion, tipo_incidencia) VALUES (?, ?)';
                        insertParams = [data.descripcion, data.tipo_incidencia];
                    } else if (tipo == 'tipo_empleado') {
                        insertQuery = 'INSERT INTO tipo_empleado (descripcion, salario) VALUES (?, ?)';
                        insertParams = [data.descripcion, data.precio];
                    } else if (tipo == 'tipo_propiedad') {
                        insertQuery = 'INSERT INTO tipo_propiedad (descripcion, pago, recargo) VALUES (?, ?, ?)';
                        insertParams = [data.descripcion, data.precio, data.recargo];
                    } else {
                        insertQuery = `INSERT INTO ${tipo}  (descripcion) VALUES (?)`;
                        insertParams = [data.descripcion];
                    }

                    conn.query(insertQuery, insertParams, (error, rows) => {
                        if (error) {
                            console.error("Error al insertar el tipo:", error);
                            return res.status(500).send("Error al agregar el tipo");
                        }
                        if (tipo === "tipo_incidencia") {
                            req.session.altaTDM = "incidencia";
                        } else if (tipo === "tipo_empleado") {
                            req.session.altaTDM = "empleado";
                        } else if (tipo === "clasificacion_incidencia") {
                            req.session.altaTDM = "clasificacion";
                        } else if (tipo === "tipo_pago") {
                            req.session.altaTDM = "pagos";
                        } else {
                            req.session.altaTDM = "propiedad";
                        }
                        renderManTipoAlta(req, res);
                    });
                } else {
                    req.session.errorMT = 'Ya existe esa descripción';
                    req.session.dataCampos = data;
                    req.session.errorBorrar = tipo;
                    if (tipo === "tipo_incidencia") {
                        req.session.formF = formularios['incidencia'];
                        req.session.tablaC = tablas['incidencia'];
                    } else if (tipo === "tipo_empleado") {
                        req.session.formF = formularios['empleado'];
                        req.session.tablaC = tablas['empleado'];
                    } else if (tipo === "tipo_propiedad") {
                        req.session.formF = formularios['propiedad'];
                        req.session.tablaC = tablas['propiedad'];
                    } else if (tipo === "clasificacion_incidencia") {
                        req.session.formF = formularios['clasificacion'];
                        req.session.tablaC = tablas['clasificacion'];
                    } else {
                        console.log("tipo pago")
                        req.session.formF = formularios['pagos'];
                        req.session.tablaC = tablas['pagos'];
                    }
                    renTipo(req, res);
                }
            });
        });
    }
}

module.exports = {
    renderManTipo,
    altaTipo,
    manTipo,
};