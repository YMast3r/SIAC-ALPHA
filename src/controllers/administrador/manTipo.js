// Diccionario para formularios
const formularios = {
    clasificacion: {
        id: 'clasificacion',
        campos: [
            { label: 'Descripción', type: 'text', name: 'descripcion', required: true },
            { label: 'Tipo de Incidencia', type: 'select', name: 'tipo_incidencia', required: true, options: [] }
        ]
    },
    pagos: {
        id: 'pagos',
        campos: [
            { label: 'Descripción', type: 'text', name: 'descripcion', required: true },
            { label: 'Precio', type: 'tel', name: 'precio', required: true }
        ]
    },
    incidencia: {
        id: 'simple',
        campos: [
            { label: 'Descripción', type: 'text', name: 'descripcion', required: true }
        ]
    }
};

// Diccionario para datos de tablas
const tablas = {
    clasificacion: {
        id: 'clasificacion',
        columnas: ['clasificacion_incidencia', 'id_clasificacion_incidencia', 'descripcion', 'tipo_incidencia']
    },
    pagos: {
        id: 'pagos',
        columnas: ['tipo_pago', 'id_tipo_pago', 'descripcion', null]
    },
    incidencia: {
        id: 'incidencia',
        columnas: ['tipo_incidencia', 'id_tipo_incidencia', 'descripcion', null]
    },
    empleado: {
        id: 'empleado',
        columnas: ['tipo_empleado', 'id_tipo_empleado', 'descripcion', null]
    }
};

function renTipo(req, res) {
    const formFields = req.session.formF;
    const tablaCampos = req.session.tablaC;
    try {
        if (tablaCampos['id'] == 'pagos') {
            res.redirect('/manTipoPago');
        } else if (tablaCampos['id'] == 'incidencia') {
            res.redirect('/manTipoIncidencia');
        } else if (tablaCampos['id'] == 'clasificacion') {
            res.redirect('/manClasificacion');
        } else {
            res.redirect('/manTipoEmpleado');
        }
    } catch (error) {
        console.error('Error:', error);
        manTipo(req, res, tablaCampos['columnas'][0], tablaCampos['columnas'][1], tablaCampos['columnas'][2], null, formFields);
    }
}


function renderManTipo(req, res) {
    req.session.errorMT = "";
    req.session.dataCampos = "";
    req.session.altaTDM = "";
    req.session.formF = formularios['pagos'];
    req.session.tablaC = tablas['pagos'];
    renTipo(req, res)
}

function renderManTipoAlta(req, res) {
    req.session.errorMT = "";
    req.session.dataCampos = "";
    const altaTD = req.session.altaTDM;
    if (altaTD == "Se registró tipo incidencia correctamente") {
        req.session.formF = formularios['simple']
        req.session.tablaC = tablas['incidencia']
    } else if (altaTD == "Se registró tipo empleado correctamente") {
        req.session.formF = formularios['simple']
        req.session.tablaC = tablas['empleado']
    } else if (altaTD == "Se registró clasificacion incidencia correctamente") {
        req.session.formF = formularios['clasificacion']
        req.session.tablaC = tablas['clasificacion']
    } else {
        req.session.formF = formularios['pagos']
        req.session.tablaC = tablas['pagos']
    }
    renTipo(req, res)
}

function manTipo(req, res, tableName, idField, descriptionField, tipoField, formFields, orderBy = idField, orderDirection = 'DESC') {

    if (req.session.errorBorrar != req.session.errorBorrarR) {
        req.session.errorMT = "";
        req.session.dataCampos = "";
        req.session.altaTDM = "";
    }
    const errorT = req.session.errorMT;
    const data = req.session.dataCampos;

    const orderByParam = req.query.orderBy || orderBy;
    const orderDirectionParam = req.query.orderDirection || orderDirection;

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        let query;
        let tableHeaders = [];
        let updatedFormFields = formFields.map(field => ({
            ...field,
            data: data[field.name] || '' // Asignamos el valor de data o una cadena vacía si no existe
        }));

        if (tableName === "tipo_pago") {
            query = `SELECT ${idField}, descripcion, COALESCE(CONCAT('$', FORMAT(precio, 2)), 'Indefinido') AS precio 
                     FROM ${tableName} 
                     ORDER BY ${orderByParam} ${orderDirectionParam}`;
            tableHeaders = [
                { name: 'ID', field: idField, sortable: true, orderDirection: orderByParam === idField ? orderDirectionParam : null },
                { name: 'Descripción', field: descriptionField, sortable: false, orderDirection: orderByParam === descriptionField ? orderDirectionParam : null },
                { name: 'Precio', field: 'precio', sortable: false }
            ];
        } else if (tableName === 'clasificacion_incidencia') {
            const queryIncidencias = `SELECT id_tipo_incidencia, descripcion FROM tipo_incidencia`;

            // Primero consultamos las incidencias
            conn.query(queryIncidencias, (err, incidencias) => {
                if (err) {
                    console.log(err);
                    return;
                }

                // Generamos las opciones para el select de tipo_incidencia
                const incidenciaOptions = incidencias.map(row => ({
                    value: row.id_tipo_incidencia,
                    text: row.descripcion
                }));

                // Actualizamos formFields con las opciones del select
                updatedFormFields = formFields.map(field => {
                    if (field.name === 'tipo_incidencia') {
                        return { ...field, options: incidenciaOptions }; // Añadimos las opciones
                    }
                    return {
                        ...field,
                        data: data[field.name] || ''
                    };
                });

                query = `
                    SELECT a.id_clasificacion_incidencia, a.descripcion, b.descripcion AS tipo
                    FROM clasificacion_incidencia a 
                    LEFT JOIN tipo_incidencia b ON a.tipo_incidencia = b.id_tipo_incidencia 
                    ORDER BY ${orderByParam} ${orderDirectionParam};
                `;
                tableHeaders = [
                    { name: 'ID', field: idField, sortable: true, orderDirection: orderByParam === idField ? orderDirectionParam : null },
                    { name: 'Descripción', field: descriptionField, sortable: false, orderDirection: orderByParam === descriptionField ? orderDirectionParam : null },
                    { name: 'Tipo incidencia', field: 'tipo', sortable: false } // Corregido a 'tipo'
                ];
                
                // Ejecutar la consulta principal
                conn.query(query, (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    return res.render('usuarios/administrador/manTipo', {
                        name: req.session.name,
                        tipoUsuario: 2,
                        titulo: "Clasificación incidencia",
                        tableData: rows,
                        tableHeaders: tableHeaders,
                        formFields: updatedFormFields,
                        orderBy: orderByParam,
                        orderDirection: orderDirectionParam === 'ASC' ? 'DESC' : 'ASC',
                        tipo: tableName,
                        errorT: errorT
                    });
                });
            });
            
            return; // Salimos de la función después de hacer la consulta de incidencias
        } else {
            query = `SELECT ${idField}, descripcion
            FROM ${tableName} 
            ORDER BY ${orderByParam} ${orderDirectionParam}`;
            tableHeaders = [
                { name: 'ID', field: idField, sortable: true, orderDirection: orderByParam === idField ? orderDirectionParam : null },
                { name: 'Descripción', field: descriptionField, sortable: false, orderDirection: orderByParam === descriptionField ? orderDirectionParam : null }
            ];
        }

        // Ejecutamos la consulta principal para tablas que no sean clasificacion_incidencia
        conn.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            
            let titulo;
            if (tableName === "tipo_pago") {
                titulo = "Tipo pago";
            } else if (tableName === "tipo_empleado") {
                titulo = "Tipo empleado";
            } else {
                titulo = "Tipo incidencia";
            }

            return res.render('usuarios/administrador/manTipo', {
                name: req.session.name,
                tipoUsuario: 2,
                titulo: titulo,
                tableData: rows,
                tableHeaders: tableHeaders,
                formFields: updatedFormFields,
                orderBy: orderByParam,
                orderDirection: orderDirectionParam === 'ASC' ? 'DESC' : 'ASC',
                tipo: tableName,
                errorT: errorT
            });
        });
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
                    // Ajusta la consulta de inserción según el tipo
                    let insertQuery;
                    let insertParams;
                    if (tipo === "tipo_pago") {
                        insertQuery = 'INSERT INTO tipo_pago (descripcion, precio) VALUES (?, ?)';
                        insertParams = [data.descripcion, data.precio];
                    } else if (tipo == 'clasificacion_incidencia') {
                        insertQuery = 'INSERT INTO clasificacion_incidencia (descripcion, tipo_incidencia) VALUES (?, ?)';
                        insertParams = [data.descripcion, data.tipo_incidencia];
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
                            req.session.altaTDM = "Se registró tipo incidencia correctamente";
                        } else if (tipo === "tipo_empleado") {
                            req.session.altaTDM = "Se registró tipo empleado correctamente";
                        } else if (tipo === "clasificacion_incidencia") {
                            req.session.altaTDM = "Se registró clasificacion incidencia correctamente";
                        }
                        renderManTipoAlta(req, res);
                    });
                } else {
                    req.session.errorMT = 'Ya existe esa descripción';
                    req.session.dataCampos = data;
                    req.session.errorBorrar = tipo;
                    if (tipo === "tipo_incidencia") {
                        req.session.formF = formularios['simple']
                        req.session.tablaC = tablas['incidencia']
                    } else if (tipo === "tipo_empleado") {
                        req.session.formF = formularios['simple']
                        req.session.tablaC = tablas['empleado']
                    } else if (tipo === "clasificacion_incidencia") {
                        req.session.formF = formularios['clasificacion']
                        req.session.tablaC = tablas['clasificacion']
                    } else {
                        console.log("tipo pago")
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