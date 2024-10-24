function renHistorial(req, res) {
    res.render('usuarios/administrador/historial/manHistorial', {
        name: req.session.name,
        tipoUsuario: 2,
    });
}

function manPagos(req, res) {
    // Obtener los parámetros de ordenación desde la URL (si están definidos)
    const orderByParam = req.query.orderBy || 'folio'; // Cambia el valor por defecto si es necesario
    const orderDirectionParam = req.query.orderDirection === 'DESC' ? 'DESC' : 'ASC'; // Por defecto es ASC

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Modifica la consulta para incluir la ordenación dinámica
        conn.query(`SELECT a.folio, p.descripcion AS propiedad, FORMAT(a.importe, 2) AS importe, 
                           t.descripcion AS tipo_pago, a.fecha, b.descripcion AS mes, 
                           a.año, u.nombre AS administrador, 
                           COALESCE(a.numero_recibo, 'Indefinido') AS numero_recibo, 
                           COALESCE(a.referencia, 'Indefinido') AS referencia 
                    FROM pago a 
                    JOIN propiedad p ON a.id_propiedad = p.id_propiedad 
                    JOIN mes b ON a.mes = b.mes 
                    JOIN usuario u ON a.id_administrador = u.id_usuario 
                    JOIN tipo_pago t ON a.tipo_pago = t.id_tipo_pago 
                    ORDER BY ${orderByParam} ${orderDirectionParam}`,
            (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }

                if (rows.length > 0) {
                    const pagos = rows.map(row => ({
                        ...row,
                        fecha: formatDate(row.fecha),
                    }));

                    const tableHeaders = [
                        { name: 'Folio', field: 'folio', sortable: true },
                        { name: 'Propiedad', field: 'propiedad', sortable: false },
                        { name: 'Importe', field: 'importe', sortable: true },
                        { name: 'Tipo de Pago', field: 'tipo_pago', sortable: false },
                        { name: 'Fecha', field: 'fecha', sortable: true },
                        { name: 'Mes', field: 'mes', sortable: true }, // Ahora es sortable
                        { name: 'Año', field: 'año', sortable: true }, // Ahora es sortable
                        { name: 'Administrador', field: 'administrador', sortable: false },
                        { name: 'Número de Recibo', field: 'numero_recibo', sortable: false },
                        { name: 'Referencia', field: 'referencia', sortable: false }
                    ].map(header => ({
                        ...header,
                        orderDirection: header.sortable && orderByParam === header.field ? orderDirectionParam : null
                    }));
                    return res.render('usuarios/administrador/historial/manHistorialConsulta', {
                        tableHeaders: tableHeaders,
                        tableData: pagos,
                        name: req.session.name,
                        id: req.session.idUser,
                        tipoUsuario: req.session.tipoUsuario
                    });
                } /* else {
                    return res.render('usuarios/administrador/pagos', {
                        errorDatos: 1,
                        name: req.session.name,
                        id: req.session.idUser,
                        tipoUsuario: req.session.tipoUsuario
                    });
                } */
            });
    });
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function manIncidencias(req, res) {
    // Obtener los parámetros de ordenación desde la URL (si están definidos)
    const orderByParam = req.query.orderBy || 'folio';  // Por defecto se ordena por folio
    const orderDirectionParam = req.query.orderDirection === 'DESC' ? 'DESC' : 'ASC'; // Por defecto es ASC

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Consulta SQL con orden dinámico
        const query = `
            SELECT a.folio, a.asunto, a.fecha, b.descripcion AS tipo, e.descripcion AS clasificacion, 
                   c.descripcion AS STATUS, a.descripcion, d.nombre AS usuario
            FROM incidencia a
            JOIN tipo_incidencia b ON a.id_tipo_incidencia = b.id_tipo_incidencia
            JOIN status_incidencia c ON a.id_status_incidencia = c.id_status_incidencia
            JOIN usuario d ON a.id_usuario = d.id_usuario
            JOIN clasificacion_incidencia e ON a.clasificacion_incidencia = e.id_clasificacion_incidencia
            ORDER BY ${conn.escapeId(orderByParam)} ${orderDirectionParam}`;

        conn.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }

            if (rows.length > 0) {
                const incidencias = rows.map(row => ({
                    ...row,
                    fecha: formatDate(row.fecha), // Asegúrate de tener una función formatDate
                }));

                const tableHeaders = [
                    { name: 'Folio', field: 'folio', sortable: true },
                    { name: 'Asunto', field: 'asunto', sortable: true },
                    { name: 'Fecha', field: 'fecha', sortable: true },
                    { name: 'Tipo', field: 'tipo', sortable: false },
                    { name: 'Clasificación', field: 'clasificacion', sortable: false },
                    { name: 'Estatus', field: 'STATUS', sortable: true },
                    { name: 'Descripción', field: 'descripcion', sortable: false },
                    { name: 'Usuario', field: 'usuario', sortable: true }
                ].map(header => ({
                    ...header,
                    // Solo asigna orderDirection si es sortable y coincide con el campo actual
                    orderDirection: header.sortable && orderByParam === header.field ? orderDirectionParam : null
                }));

                return res.render('usuarios/administrador/historial/manHistorialConsulta', {
                    tableHeaders: tableHeaders,
                    tableData: incidencias,
                    orderDirection: orderDirectionParam,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: req.session.tipoUsuario
                });
            } /* else {
                // Si no hay incidencias, mostramos un mensaje de error
                return res.render('usuarios/administrador/incidencias', {
                    errorDatos: 1,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: req.session.tipoUsuario
                });
            } */
        });
    });
}

function manSeguimiento(req, res) {
    // Obtener los parámetros de ordenación desde la URL (si están definidos)
    const orderByParam = req.query.orderBy || 'movimiento';  // Por defecto se ordena por movimiento
    const orderDirectionParam = req.query.orderDirection === 'DESC' ? 'DESC' : 'ASC'; // Por defecto es ASC

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Consulta SQL con orden dinámico
        const query = `
            SELECT s.folio, s.movimiento, u.nombre AS empleado, s.comentario, ss.descripcion AS status, s.fecha 
            FROM seguimiento s
            JOIN usuario u ON s.id_empleado = u.id_usuario
            JOIN status_seguimiento ss ON s.id_status_seguimiento = ss.id_status_seguimiento
            ORDER BY ${conn.escapeId(orderByParam)} ${orderDirectionParam}`;

        conn.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }

            if (rows.length > 0) {
                const seguimientos = rows.map(row => ({
                    ...row,
                    fecha: formatDate(row.fecha), // Asegúrate de tener una función formatDate
                }));

                const tableHeaders = [
                    { name: 'Folio', field: 'folio', sortable: true },
                    { name: 'Movimiento', field: 'movimiento', sortable: true },
                    { name: 'Empleado', field: 'empleado', sortable: true },
                    { name: 'Comentario', field: 'comentario', sortable: false },
                    { name: 'Estatus', field: 'status', sortable: true },
                    { name: 'Fecha', field: 'fecha', sortable: true }
                ].map(header => ({
                    ...header,
                    // Solo asigna orderDirection si es sortable y coincide con el campo actual
                    orderDirection: header.sortable && orderByParam === header.field ? orderDirectionParam : null
                }));

                return res.render('usuarios/administrador/historial/manHistorialConsulta', {
                    tableHeaders: tableHeaders,
                    tableData: seguimientos,
                    orderDirection: orderDirectionParam,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: req.session.tipoUsuario
                });
            } /* else {
                // Si no hay seguimientos, mostramos un mensaje de error
                return res.render('usuarios/administrador/seguimientos', {
                    errorDatos: 1,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: req.session.tipoUsuario
                });
            } */
        });
    });
}

function renHistorialEspesifico(req, res) {
    // Recuperamos el id guardado
    const campoId = req.session.campo;
    try {
        res.redirect(`/manHistorialEspesifico-${campoId}`);
        return;
    } catch {
        manHistorialEspesifico(req, res);
    }
}

function renderHistorialEspesifico(req, res) {
    req.session.errorHistorialE = "";
    req.session.dataCampos = "";
    renHistorialEspesifico(req, res)
}

// Obtener la fecha y hora actual
const fechaActual = new Date();

function manHistorialEspesifico(req, res) {
    // recuperamos el id de la propiedad
    const campoId = req.session.campo;

    let campo;
    if (req.params.campo) {
        // recupera el id de la ruta inicial
        campo = req.params.campo;
    } else {
        campo = campoId;
    }
    // guardamos el id de la propiedad
    req.session.campo = campoId;

    const error = req.session.errorHistorialE;
    const data = req.session.dataCampos;

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        conn.query('SELECT mes, descripcion, DATE_FORMAT(CURDATE(), \'%m\') AS correcto FROM mes', (err, rowsMes) => {
            if (err) {
                console.log(err);
                return;
            }
            conn.query('SELECT pa.folio, pa.id_propiedad, p.descripcion AS propiedad_descripcion, pa.importe, pa.recargo, pa.año, pa.mes, pa.fecha, tp.id_tipo_pago, tp.descripcion AS tipo_pago_descripcion, tpro.id_tipo_propiedad, tpro.descripcion AS tipo_propiedad_descripcion, pa.numero_recibo, pa.referencia, c.id_usuario AS id_condomino, c.nombre AS condomino, a.id_usuario AS id_administrador, a.nombre AS administrador, c.status AS usuario_status FROM pago pa JOIN propiedad p ON pa.id_propiedad = p.id_propiedad JOIN usuario c ON p.id_usuario = c.id_usuario JOIN usuario a ON pa.id_administrador = a.id_usuario JOIN tipo_pago tp ON pa.tipo_pago = tp.id_tipo_pago JOIN tipo_propiedad tpro ON p.id_tipo_propiedad = tpro.id_tipo_propiedad ORDER BY pa.folio DESC', (err, rowsPago) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (rowsPago.length > 0) {
                    const año = fechaActual.getFullYear();
                    let años = [];
                    for (let i = año - 5; i <= año + 5; i++) {
                        correcto = (i === año) ? 1 : 0;
                        años.push({ año: i, correcto: correcto });
                    }
                    res.render('usuarios/administrador/historial/manHistorialEspesifico', {
                        name: req.session.name,
                        tipoUsuario: 2,
                        campo: campo,
                        años: años,
                        meses: rowsMes,
                        data: data,
                        error: error
                    });
                };
            });//tipo pago
        });// meses
    });
}

function consultaEspesifica(req, res) {

}

module.exports = {
    renHistorial,
    manPagos,
    manIncidencias,
    manHistorialEspesifico,
    consultaEspesifica,
    manSeguimiento
};