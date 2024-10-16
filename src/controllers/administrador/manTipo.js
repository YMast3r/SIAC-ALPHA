function renTipo(req, res) {
    const formFields = req.session.formF;
    const tablaCampos = req.session.tablaC;
    try {
        if (tablaCampos[0] == 'tipo_pago') {
            res.redirect('/manTipoPago');
        } else if (tablaCampos[0] == 'tipo_incidencia') {
            res.redirect('/manTipoIncidencia');
        }
    } catch {
        manTipo(req, res, tablaCampos[0], tablaCampos[1], tablaCampos[2], formFields);
    }
}

function renderManTipo(req, res) {
    req.session.errorMT = "";
    req.session.dataCampos = "";
    req.session.altaTDM = "";
    req.session.formF = [
        { label: 'Descripción', type: 'text', name: 'descripcion', required: true },
        { label: 'Precio', type: 'tel', name: 'precio', required: true }
    ];
    req.session.tablaC = ['tipo_pago', 'id_tipo_pago', 'descripcion']
    renTipo(req, res)
}

function renderManTipoAlta(req, res) {
    req.session.errorMT = "";
    req.session.dataCampos = "";
    const altaTD = req.session.altaTDM;
    if (altaTD) {
        req.session.formF = [
            { label: 'Descripción', type: 'text', name: 'descripcion', required: true }
        ];
        req.session.tablaC = ['tipo_incidencia', 'id_tipo_incidencia', 'descripcion']
    } else {
        req.session.formF = [
            { label: 'Descripción', type: 'text', name: 'descripcion', required: true },
            { label: 'Precio', type: 'tel', name: 'precio', required: true }
        ];
        req.session.tablaC = ['tipo_pago', 'id_tipo_pago', 'descripcion']
    }
    renTipo(req, res)
}

function manTipo(req, res, tableName, idField, descriptionField, formFields, orderBy = idField, orderDirection = 'DESC') {
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
            if (tableName == "tipo_pago"){
                titulo = "Tipo pago"
            }else {
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
                    const insertQuery = tipo === "tipo_pago"
                        ? 'INSERT INTO tipo_pago (descripcion, precio) VALUES (?, ?)'
                        : 'INSERT INTO tipo_incidencia (descripcion) VALUES (?)'; // Cambia a la tabla de incidencias

                    const insertParams = tipo === "tipo_pago" ? [data.descripcion, data.precio] : [data.descripcion];

                    conn.query(insertQuery, insertParams, (error, rows) => {
                        if (error) {
                            console.error("Error al insertar el tipo:", error);
                            return res.status(500).send("Error al agregar el tipo");
                        }
                        if (tipo === "tipo_incidencia") {
                            req.session.altaTDM = "Se registró tipo incidencia correctamente";
                        }
                        renderManTipoAlta(req, res);
                    });
                } else {
                    req.session.errorMT = 'Ya existe esa descripción';
                    req.session.dataCampos = data;
                    if (tipo === "tipo_incidencia") {
                        req.session.formF = [
                            { label: 'Descripción', type: 'text', name: 'descripcion', required: true }
                        ];
                        req.session.tablaC = ['tipo_incidencia', 'id_tipo_incidencia', 'descripcion']
                        console.log("tipo incidencia")
                    } else {
                        console.log("tipo pago")
                    }
                    console.log("formFields A ", req.session.formF)
                    console.log("tablaCampos A", req.session.tablaC)
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