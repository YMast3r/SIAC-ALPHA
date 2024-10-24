const { manEmpleados } = require("./manEmpleados");

function renderHistorial(req, res) {
    req.session.campoR = '';
    res.render('usuarios/administrador/historial/manHistorial', {
        name: req.session.name,
        tipoUsuario: 2,
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
    const ruta = req.session.campoR;

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
                    ruta,
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

    const ruta = req.session.campoR;

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
                    ruta,
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

function manPagos(req, res) {
    // Obtener los parámetros de ordenación desde la URL (si están definidos)
    const orderByParam = req.query.orderBy || 'folio'; // Cambia el valor por defecto si es necesario
    const orderDirectionParam = req.query.orderDirection === 'DESC' ? 'DESC' : 'ASC'; // Por defecto es ASC

    const campoDatos = req.session.campoDatos;
    const campo = req.session.campo;
    const ruta = req.session.campoR;
    req.session.campo = campo;

    console.log("campoDatos: ", campoDatos);

    // Validar si campoDatos tiene datos válidos
    let whereClause = ' WHERE 1=1 '; // Siempre true, para agregar condiciones dinámicamente
    let params = []; // Parámetros para la consulta preparada
    if (campoDatos) {
        // Construcción dinámica del WHERE basado en campoDatos

        // Filtrar por cada campo de campoDatos si está presente
        if (campoDatos.fecha) {
            whereClause += ' AND a.fecha = ?';
            params.push(campoDatos.fecha);
        }
        if (campoDatos.mesI && campoDatos.mesF) {
            whereClause += ' AND a.mes BETWEEN ? AND ?';
            params.push(campoDatos.mesI, campoDatos.mesF);
        }
        if (campoDatos.añoI && campoDatos.añoF) {
            whereClause += ' AND a.año BETWEEN ? AND ?';
            params.push(campoDatos.añoI, campoDatos.añoF);
        }
        if (campoDatos.tipoPago) {
            whereClause += ' AND a.tipo_pago = ?';
            params.push(campoDatos.tipoPago);
        }
        if (campoDatos.tipoPropiedad) {
            whereClause += ' AND p.id_propiedad = ?';
            params.push(campoDatos.tipoPropiedad);
        }
        if (campoDatos.adm) {
            whereClause += ' AND a.id_administrador = ?';
            params.push(campoDatos.adm);
        }
        if (campoDatos.condomino) {
            // Relacionar condómino a través de la tabla usuario (c.id_usuario)
            whereClause += ' AND a.id_condomino = ?';
            params.push(campoDatos.condomino);
        }
        if (campoDatos.referencia) {
            whereClause += ' AND a.referencia = ?';
            params.push(campoDatos.referencia);
        }
        if (campoDatos.propiedad) {
            whereClause += ' AND p.id_propiedad = ?';
            params.push(campoDatos.propiedad);
        }
    } else {
        console.log("No hay campos");
    }

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Modificar la consulta para incluir la ordenación dinámica y el WHERE dinámico
        conn.query(
            `SELECT a.folio, p.descripcion AS propiedad, FORMAT(a.importe, 2) AS importe, 
                    t.descripcion AS tipo_pago, a.fecha, b.descripcion AS mes, 
                    a.año, u.nombre AS administrador, 
                    c.nombre AS condomino, COALESCE(a.numero_recibo, 'Indefinido') AS numero_recibo, 
                    COALESCE(a.referencia, 'Indefinido') AS referencia 
             FROM pago a 
             JOIN propiedad p ON a.id_propiedad = p.id_propiedad 
             JOIN mes b ON a.mes = b.mes 
             JOIN usuario u ON a.id_administrador = u.id_usuario 
             JOIN tipo_pago t ON a.tipo_pago = t.id_tipo_pago
             JOIN usuario c ON p.id_usuario = c.id_usuario
             ${whereClause} 
             ORDER BY ${orderByParam} ${orderDirectionParam}`,
            params,
            (err, rows) => {
                if (err) {
                    console.log(err);
                    // Si no hay registros, enviar un mensaje de error
                    req.session.errorConsultaE = "No se encontraron pagos con los parámetros proporcionados.";
                    req.session.consultaData = campoDatos;
                    return manHistorialEspecifico(req, res);
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
                        { name: 'Mes', field: 'mes', sortable: true },
                        { name: 'Año', field: 'año', sortable: true },
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
                        campo: campo,
                        ruta,
                        name: req.session.name,
                        id: req.session.idUser,
                        tipoUsuario: req.session.tipoUsuario
                    });
                } else {
                    // Si no hay registros, enviar un mensaje de error
                    req.session.errorConsultaE = "No se encontraron pagos con los parámetros proporcionados.";
                    req.session.consultaData = campoDatos;
                    return manHistorialEspecifico(req, res);
                }
            }
        );
    });
}

function renHistorialEspecifico(req, res) {
    // Recuperamos el id guardado
    const campoId = req.session.campo;
    try {
        res.redirect(`/manHistorialEspecifico-${campoId}`);
        return;
    } catch {
        manHistorialEspecifico(req, res);
    }
}

// Obtener la fecha y hora actual
const fechaActual = new Date();

function manHistorialEspecifico (req, res) {
    const campoId = req.session.campo;

    let campo;
    if (req.params.campo) {
        // recupera el id de la ruta inicial
        campo = req.params.campo;
    } else {
        campo = campoId;
    }
    req.session.campo = campo;

    const error = req.session.errorConsultaE;
    const data = req.session.consultaData;
    const ruta = req.session.campoR;

    req.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        try {
            // Consultas en paralelo para optimización
            const [rowsMes, rowsPropieda, rowsTipoPro, rowsTipoPago, rowsReferencia, rowsAdm, rowsCon] = await Promise.all([
                queryAsync(conn, 'SELECT mes, descripcion, DATE_FORMAT(CURDATE(), \'%m\') AS correcto FROM mes'),
                queryAsync(conn, 'SELECT DISTINCT p.descripcion AS propiedad_descripcion, pa.id_propiedad FROM pago pa JOIN propiedad p ON pa.id_propiedad = p.id_propiedad'),
                queryAsync(conn, 'SELECT DISTINCT tpro.descripcion AS tipo_propiedad_descripcion, tpro.id_tipo_propiedad FROM pago pa JOIN propiedad p ON pa.id_propiedad = p.id_propiedad JOIN tipo_propiedad tpro ON p.id_tipo_propiedad = tpro.id_tipo_propiedad'),
                queryAsync(conn, 'SELECT DISTINCT p.descripcion AS tipo_pago_descripcion, p.id_tipo_pago FROM pago pa JOIN tipo_pago p ON pa.tipo_pago = p.id_tipo_pago'),
                queryAsync(conn, 'SELECT DISTINCT pa.referencia FROM pago pa'),
                queryAsync(conn, 'SELECT DISTINCT a.nombre AS administrador, a.id_usuario AS id_administrador FROM pago pa JOIN usuario a ON pa.id_administrador = a.id_usuario'),
                queryAsync(conn, 'SELECT DISTINCT c.nombre AS condomino, c.id_usuario AS id_condomino FROM pago pa JOIN propiedad p ON pa.id_propiedad = p.id_propiedad JOIN usuario c ON p.id_usuario = c.id_usuario')
            ]);

            if (!rowsPropieda.length || !rowsTipoPro.length || !rowsTipoPago.length || !rowsReferencia.length || !rowsAdm.length || !rowsCon.length) {
                console.log("No data found in one or more queries");
                return;
            }

            // Generación de los años
            const fechaActual = new Date();
            const año = fechaActual.getFullYear();
            const años = [];
            for (let i = año - 5; i <= año + 5; i++) {
                años.push({ año: i, correcto: (i === año ? 1 : 0) });
            }

            // Creación del objeto pagoDatos con todas las consultas
            const formFields = [
                {
                    label: 'Fecha registro', 
                    type: 'date', 
                    name: 'fecha',
                    colSpan: 'md:col-span-1',
                },
                {
                    label: 'Propiedad', 
                    type: 'select', 
                    name: 'propiedad', 
                    colSpan: 'md:col-span-2',
                    options: rowsPropieda.map(p => ({ value: p.id_propiedad, text: p.propiedad_descripcion }))
                },
                {
                    label: 'Mes Inicio', 
                    type: 'select', 
                    name: 'mesI', 
                    colSpan: 'md:col-span-1',
                    options: rowsMes.map(m => ({ value: m.mes, text: m.descripcion }))
                },
                {
                    label: 'Año Final', 
                    type: 'select', 
                    name: 'añoI', 
                    colSpan: 'md:col-span-1',
                    options: años.map(m => ({ value: m.año, text: m.año }))
                },
                {
                    label: 'Mes Final', 
                    type: 'select', 
                    name: 'mesF', 
                    colSpan: 'md:col-span-1',
                    options: rowsMes.map(m => ({ value: m.mes, text: m.descripcion }))
                },
                {
                    label: 'Mes Final', 
                    type: 'select', 
                    name: 'añoF', 
                    colSpan: 'md:col-span-1',
                    options: años.map(m => ({ value: m.año, text: m.año }))
                },
                {
                    label: 'Tipo de Propiedad', 
                    type: 'select', 
                    name: 'tipoPropiedad', 
                    colSpan: 'md:col-span-1',
                    options: rowsTipoPro.map(tp => ({ value: tp.id_tipo_propiedad, text: tp.tipo_propiedad_descripcion }))
                },
                {
                    label: 'Tipo de Pago', 
                    type: 'select', 
                    name: 'tipoPago', 
                    colSpan: 'md:col-span-1',
                    options: rowsTipoPago.map(tp => ({ value: tp.id_tipo_pago, text: tp.tipo_pago_descripcion }))
                },
                {
                    label: 'Administrador', 
                    type: 'select', 
                    name: 'administrador', 
                    colSpan: 'md:col-span-1',
                    options: rowsAdm.map(a => ({ value: a.id_administrador, text: a.administrador }))
                },
                {
                    label: 'Condómino', 
                    type: 'select', 
                    name: 'condomino', 
                    colSpan: 'md:col-span-1',
                    options: rowsCon.map(c => ({ value: c.id_condomino, text: c.condomino }))
                },
                {
                    label: 'Referencia', 
                    type: 'select', 
                    name: 'referencia', 
                    colSpan: 'md:col-span-1',
                    options: rowsReferencia.map(r => ({ value: r.referencia, text: r.referencia }))
                },
            ];            

            //console.log("pagoDatos: ", pagoDatos);
            // Renderizar la vista
            res.render('usuarios/administrador/historial/manHistorialEspecifico', {
                name: req.session.name,
                tipoUsuario: 2,
                campo,
                ruta,
                años,
                meses: rowsMes,
                formFields,
                data: data,
                error: error
            });

        } catch (err) {
            console.log(err);
        }
    });
}

// Función auxiliar para ejecutar las consultas con promesas
function queryAsync(conn, query) {
    return new Promise((resolve, reject) => {
        conn.query(query, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function consultaEspesifica(req, res) {
    const data = req.body;
    req.session.campo = req.session.campo;
    req.session.campoDatos = data;

    if (data.campo == 'pagos') {
        manPagos(req, res);
    } else {
        console.log("adios: ");
    }
}

function renHistorialCampos(req, res) {
    // Tomamos el campo de la ruta
    const renCampo = req.params.renCampo;

    // Limpiamos valores
    req.session.campo = '';
    req.session.errorConsultaE = '';
    req.session.consultaData = '';
    
    if (renCampo == 'pagosG'){
        req.session.campoR = 'pagos';
        res.redirect('/manPagosConsulta');
    } else if (renCampo == 'pagosE'){
        req.session.campoR = 'pagos';
        res.redirect('/manHistorialEspecifico-pagos');
    } else if (renCampo == 'IncidenciasG'){
        req.session.campoR = 'incidencias';
        res.redirect('/manIncidenciasConsulta');
    } else if (renCampo == 'IncidenciasE'){
        req.session.campoR = 'incidencias';
        res.redirect('/manHistorialEspecifico-incidencias');
    } else if (renCampo == 'seguimientosG'){
        req.session.campoR = 'seguimientos';
        res.redirect('/manSeguimientoConsulta');
    } else if (renCampo == 'seguimientosE'){
        req.session.campoR = 'seguimientos';
        res.redirect('/manHistorialEspecifico-seguimientos');
    }else{
        console.log("No se encontro niguna ruta")
        renderHistorial(req, res);
    }
}

module.exports = {
    renderHistorial,
    manPagos,
    manIncidencias,
    manHistorialEspecifico,
    renHistorialCampos,
    consultaEspesifica,
    manSeguimiento
};