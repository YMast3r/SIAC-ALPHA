// Diccionario para formularios
const formularios = {
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
    pagos: {
        id: 'pagos',
        columnas: ['tipo_pago', 'id_tipo_pago', 'descripcion']
    },
    incidencia: {
        id: 'incidencia',
        columnas: ['tipo_incidencia', 'id_tipo_incidencia', 'descripcion']
    },
    usuario: {
        id: 'usuario',
        columnas: ['tipo_usuario', 'id_tipo_usuario', 'descripcion']
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
        } else {
            res.redirect('/manTipoUsuario');
        }
    } catch (error) {
        console.error('Error:', error);
        manTipo(req, res, tablaCampos['columnas'][0], tablaCampos['columnas'][1], tablaCampos['columnas'][2], formFields);
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
    } else if (altaTD == "Se registró tipo usuario correctamente") {
        req.session.formF = formularios['simple']
        req.session.tablaC = tablas['usuario']
    } else {
        req.session.formF = formularios['pagos']
        req.session.tablaC = tablas['pagos']
    }
    renTipo(req, res)
}

function manTipo(req, res, tableName, idField, descriptionField, formFields, orderBy = idField, orderDirection = 'DESC') {

    if (req.session.errorBorrar != req.session.errorBorrarR) {
        req.session.errorMT = "";
        req.session.dataCampos = "";
        req.session.altaTDM = "";
    }
    const errorT = req.session.errorMT;
    const data = req.session.dataCampos;

    // Obtener los parámetros de la consulta
    const orderByParam = req.query.orderBy || orderBy; // Toma el parámetro de la consulta o usa el predeterminado
    const orderDirectionParam = req.query.orderDirection || orderDirection; // Toma el parámetro de la consulta o usa el predeterminado

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        let query;
        let tableHeaders = [];

        if (tableName == "tipo_pago") {
            query = `SELECT ${idField}, descripcion, COALESCE(FORMAT(precio, 2), 'Indefinido') AS precio 
            FROM ${tableName} 
            ORDER BY ${orderByParam} ${orderDirectionParam}`;
            tableHeaders = [
                { name: 'ID', field: idField, sortable: true, orderDirection: orderByParam === idField ? orderDirectionParam : null },
                { name: 'Descripción', field: descriptionField, sortable: false, orderDirection: orderByParam === descriptionField ? orderDirectionParam : null },
                { name: 'Precio', field: 'precio', sortable: false }
            ];
        } else {
            query = `SELECT ${idField}, descripcion
                      FROM ${tableName} 
                      ORDER BY ${orderByParam} ${orderDirectionParam}`;
            tableHeaders = [
                { name: 'ID', field: idField, sortable: true, orderDirection: orderByParam === idField ? orderDirectionParam : null },
                { name: 'Descripción', field: descriptionField, sortable: false, orderDirection: orderByParam === descriptionField ? orderDirectionParam : null }
            ];
        }

        conn.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }

            // Mapeamos formFields y añadimos el valor correspondiente de data
            const updatedFormFields = formFields.map(field => {
                // Añadimos el valor de data al campo
                return {
                    ...field,
                    data: data[field.name] || '' // Asignamos el valor de data o una cadena vacía si no existe
                };
            });

            let titulo;
            if (tableName == "tipo_pago") {
                titulo = "Tipo pago"
            } else if (tableName == "tipo_usuario") {
                titulo = "Tipo usuario"
            } else {
                titulo = "Tipo incidencia"
            }

            return res.render('usuarios/administrador/manTipo', {
                name: req.session.name,
                tipoUsuario: 2,
                titulo: titulo,
                tableData: rows,
                tableHeaders: tableHeaders,
                formFields: updatedFormFields,
                orderBy: orderByParam,
                orderDirection: orderDirectionParam === 'ASC' ? 'DESC' : 'ASC', // Cambia la dirección de orden
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
                    if (tipo === "tipo_incidencia" || tipo === "tipo_usuario") {
                        insertQuery = `INSERT INTO ${tipo}  (descripcion) VALUES (?)`;
                    } else {
                        insertQuery = 'INSERT INTO tipo_pago (descripcion, precio) VALUES (?, ?)';

                    }

                    const insertParams = tipo === "tipo_pago" ? [data.descripcion, data.precio] : [data.descripcion];

                    conn.query(insertQuery, insertParams, (error, rows) => {
                        if (error) {
                            console.error("Error al insertar el tipo:", error);
                            return res.status(500).send("Error al agregar el tipo");
                        }
                        if (tipo === "tipo_incidencia") {
                            req.session.altaTDM = "Se registró tipo incidencia correctamente";
                        } else if (tipo === "tipo_usuario") {
                            req.session.altaTDM = "Se registró tipo usuario correctamente";
                        }
                        renderManTipoAlta(req, res);
                    });
                } else {
                    req.session.errorMT = 'Ya existe esa descripción';
                    req.session.dataCampos = data;
                    if (tipo === "tipo_incidencia") {
                        req.session.formF = formularios['simple']
                        req.session.tablaC = tablas['incidencia']
                    } else if (tipo === "tipo_usuario") {
                        req.session.formF = formularios['simple']
                        req.session.tablaC = tablas['usuario']
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