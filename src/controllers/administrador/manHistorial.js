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

    const campoDatos = req.session.campoDatos;
    const ruta = req.session.campoR;

    //console.log("campoDatos: ", campoDatos);

    // Validar si campoDatos tiene datos válidos

    // Construcción dinámica del WHERE basado en campoDatos
    let whereClause = ' WHERE 1=1 '; // Siempre true, para agregar condiciones dinámicamente
    let params = []; // Parámetros para la consulta preparada

    if (campoDatos) {
        if (campoDatos.folio) {
            whereClause += ' AND a.folio = ?';
            params.push(campoDatos.folio);
        }
        if (campoDatos.asunto) {
            whereClause += ' AND a.asunto LIKE ?';
            params.push(`%${campoDatos.asunto}%`); // Búsqueda parcial por asunto
        }
        if (campoDatos.fecha) {
            whereClause += ' AND a.fecha = ?';
            params.push(campoDatos.fecha);
        }
        if (campoDatos.tipo_incidencia) {
            whereClause += ' AND a.id_tipo_incidencia = ?';
            params.push(campoDatos.tipo_incidencia);
        }
        if (campoDatos.clasificacion_incidencia) {
            whereClause += ' AND a.clasificacion_incidencia = ?';
            params.push(campoDatos.clasificacion_incidencia);
        }
        if (campoDatos.status_incidencia) {
            whereClause += ' AND a.id_status_incidencia = ?';
            params.push(campoDatos.status_incidencia);
        }
        if (campoDatos.administrador) {
            if (campoDatos.administrador == 0) {
                whereClause += ' AND a.id_administardor IS NULL';

            } else {
                whereClause += ' AND a.id_administardor = ?';
                params.push(campoDatos.administrador);
            }
        }
        if (campoDatos.usuario) {
            whereClause += ' AND a.id_usuario = ?';
            params.push(campoDatos.usuario);
        }
    } else {
        console.log("No hay campos");
    }

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Consulta SQL con cláusula WHERE dinámica y orden dinámico
        const query = `
            SELECT a.folio, a.asunto, a.fecha, b.descripcion AS tipo, e.descripcion AS clasificacion, 
                   c.descripcion AS status, a.descripcion, d.nombre AS usuario, COALESCE(u.nombre, "Sin administrador") AS administrador
            FROM incidencia a
            JOIN tipo_incidencia b ON a.id_tipo_incidencia = b.id_tipo_incidencia
            JOIN status_incidencia c ON a.id_status_incidencia = c.id_status_incidencia
            JOIN usuario d ON a.id_usuario = d.id_usuario
            LEFT JOIN usuario u ON a.id_administardor = u.id_usuario
            JOIN clasificacion_incidencia e ON a.clasificacion_incidencia = e.id_clasificacion_incidencia
            ${whereClause}
            ORDER BY ${conn.escapeId(orderByParam)} ${orderDirectionParam}`;

        conn.query(query, params, (err, rows) => {
            if (err) {
                console.log(err);
                // Si no se encuentran incidencias, mostrar un mensaje de error
                req.session.errorConsultaE = "No se encontraron incidencias con los parámetros proporcionados.";
                req.session.consultaData = campoDatos;
                return manHistorialEspecifico(req, res);
            }

            if (rows.length > 0) {
                const incidencias = rows.map(row => ({
                    ...row,
                    fecha: formatDate(row.fecha), // Formatear la fecha si es necesario
                }));

                const tableHeaders = [
                    { name: 'Folio', field: 'folio', sortable: true },
                    { name: 'Asunto', field: 'asunto', sortable: true },
                    { name: 'Fecha', field: 'fecha', sortable: true },
                    { name: 'Tipo', field: 'tipo', sortable: false },
                    { name: 'Clasificación', field: 'clasificacion', sortable: false },
                    { name: 'Estatus', field: 'status', sortable: true },
                    { name: 'Incidencia', field: 'descripcion', sortable: false },
                    { name: 'Usuario', field: 'usuario', sortable: true },
                    { name: 'Administrador', field: 'administrador', sortable: true }
                ].map(header => ({
                    ...header,
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
            } else {
                // Si no se encuentran incidencias, mostrar un mensaje de error
                req.session.errorConsultaE = "No se encontraron incidencias con los parámetros proporcionados.";
                req.session.consultaData = campoDatos;
                return manHistorialEspecifico(req, res);
            }
        });
    });
}

function manSeguimiento(req, res) {
    // Obtener los parámetros de ordenación desde la URL (si están definidos)
    const orderByParam = req.query.orderBy || 'movimiento';  // Por defecto se ordena por movimiento
    const orderDirectionParam = req.query.orderDirection === 'DESC' ? 'DESC' : 'ASC'; // Por defecto es ASC

    const campoDatos = req.session.campoDatos;
    const campo = req.session.campo;
    const ruta = req.session.campoR;
    req.session.campo = campo;

    //console.log("campoDatos: ", campoDatos);

    // Validar si campoDatos tiene datos válidos

    // Construcción dinámica del WHERE basado en campoDatos
    let whereClause = ' WHERE 1=1 '; // Siempre true, para agregar condiciones dinámicamente
    let params = []; // Parámetros para la consulta preparada
    if (campoDatos) {

        if (campoDatos.folio) {
            whereClause += ' AND s.folio = ?';
            params.push(campoDatos.folio);
        }
        if (campoDatos.movimiento) {
            whereClause += ' AND s.movimiento LIKE ?';
            params.push(`%${campoDatos.movimiento}%`); // Búsqueda parcial por movimiento
        }
        if (campoDatos.fecha) {
            whereClause += ' AND s.fecha = ?';
            params.push(campoDatos.fecha);
        }
        if (campoDatos.comentario) {
            whereClause += ' AND s.comentario LIKE ?';
            params.push(`%${campoDatos.comentario}%`); // Búsqueda parcial por comentario
        }
        if (campoDatos.status_seguimiento) {
            whereClause += ' AND s.id_status_seguimiento = ?';
            params.push(campoDatos.status_seguimiento);
        }
        if (campoDatos.persona_asignada) {
            if (campoDatos.persona_asignada == 0) {
                whereClause += ' AND s.id_empleado IS NULL';
            } else {
                whereClause += ' AND s.id_empleado = ?';
                params.push(campoDatos.persona_asignada);
            }
        }
    } else {
        console.log("No hay campos");
    }

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Consulta SQL con cláusula WHERE dinámica y orden dinámico
        const query = `
            SELECT s.folio, s.movimiento, COALESCE(u.nombre, "Sin persona") AS empleado, s.comentario, ss.descripcion AS status, s.fecha 
            FROM seguimiento s
            LEFT JOIN usuario u ON s.id_empleado = u.id_usuario
            JOIN status_seguimiento ss ON s.id_status_seguimiento = ss.id_status_seguimiento
            ${whereClause}
            ORDER BY ${conn.escapeId(orderByParam)} ${orderDirectionParam}`;

        conn.query(query, params, (err, rows) => {
            if (err) {
                console.log(err);
                // Si no se encuentran seguimientos, mostrar un mensaje de error
                req.session.errorConsultaE = "No se encontraron seguimientos con los parámetros proporcionados.";
                req.session.consultaData = campoDatos;
                return manHistorialEspecifico(req, res);
            }

            if (rows.length > 0) {
                const seguimientos = rows.map(row => ({
                    ...row,
                    fecha: formatDate(row.fecha), // Formatear la fecha si es necesario
                }));

                const tableHeaders = [
                    { name: 'Folio', field: 'folio', sortable: true },
                    { name: 'Movimiento', field: 'movimiento', sortable: true },
                    { name: 'Persona', field: 'empleado', sortable: true },
                    { name: 'Comentario', field: 'comentario', sortable: false },
                    { name: 'Estatus', field: 'status', sortable: true },
                    { name: 'Fecha', field: 'fecha', sortable: true }
                ].map(header => ({
                    ...header,
                    orderDirection: header.sortable && orderByParam === header.field ? orderDirectionParam : null
                }));

                return res.render('usuarios/administrador/historial/manHistorialConsulta', {
                    tableHeaders: tableHeaders,
                    tableData: seguimientos,
                    orderDirection: orderDirectionParam,
                    ruta,
                    campo: campo,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: req.session.tipoUsuario
                });
            } else {
                // Si no se encuentran seguimientos, mostrar un mensaje de error
                req.session.errorConsultaE = "No se encontraron seguimientos con los parámetros proporcionados.";
                req.session.consultaData = campoDatos;
                return manHistorialEspecifico(req, res);
            }
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

    //console.log("campoDatos: ", campoDatos);

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
        if (campoDatos.recargo) {
            if (campoDatos.recargo == 'con_recargo') {
                whereClause += ' AND a.recargo != 0.00';
            } else {
                whereClause += ' AND a.recargo = 0.00';
            }
        }
        if (campoDatos.tipoPropiedad) {
            whereClause += ' AND p.id_propiedad = ?';
            params.push(campoDatos.tipoPropiedad);
        }
        if (campoDatos.administrador) {
            if (campoDatos.administrador == 0) {
                whereClause += ' AND a.id_administrador IS NULL';
            } else {
                whereClause += ' AND a.id_administrador = ?';
                params.push(campoDatos.administrador);
            }
        }
        if (campoDatos.condomino) {
            // Relacionar condómino a través de la tabla usuario (c.id_usuario)
            whereClause += ' AND c.id_usuario = ?';
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
        //console.log("params", params);
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
            `SELECT 
                    a.folio, 
                    p.descripcion AS propiedad, 
                    FORMAT(a.importe, 2) AS importe, 
                    FORMAT(a.recargo, 2) AS recargo, 
                    FORMAT((a.importe + a.recargo), 2) AS total, 
                    t.descripcion AS tipo_pago, 
                    a.fecha, 
                    b.descripcion AS mes, 
                    a.año, 
                    COALESCE(u.nombre, 'Sin administrador') AS administrador, 
                    c.nombre AS condomino, 
                    c.id_usuario, 
                    COALESCE(a.numero_recibo, 'Indefinido') AS numero_recibo, 
                    COALESCE(a.referencia, 'Indefinido') AS referencia 
                FROM 
                    pago a 
                JOIN 
                    propiedad p ON a.id_propiedad = p.id_propiedad 
                JOIN 
                    mes b ON a.mes = b.mes 
                LEFT JOIN 
                    usuario u ON a.id_administrador = u.id_usuario 
                JOIN 
                    tipo_pago t ON a.tipo_pago = t.id_tipo_pago 
                JOIN 
                    usuario c ON p.id_usuario = c.id_usuario
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
                        { name: 'Recargo', field: 'recargo', sortable: true },
                        { name: 'Total', field: 'total', sortable: true },
                        { name: 'Tipo de Pago', field: 'tipo_pago', sortable: false },
                        { name: 'Fecha', field: 'fecha', sortable: true },
                        { name: 'Mes', field: 'mes', sortable: true },
                        { name: 'Año', field: 'año', sortable: true },
                        { name: 'Administrador', field: 'administrador', sortable: false },
                        { name: 'Condómino', field: 'condomino', sortable: false },
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

function manHistorialEspecifico(req, res) {
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
            let formFields = [];


            // Generación de los años
            const fechaActual = new Date();
            const año = fechaActual.getFullYear();
            const años = [];
            for (let i = año - 5; i <= año + 5; i++) {
                años.push({ año: i, correcto: (i === año ? 1 : 0) });
            }

            /////////////////////////////////////////
            /* consultas para pagos */
            /////////////////////////////////////////
            // Consultas en paralelo para optimización

            const [rowsMes, rowsPropieda, rowsTipoPro, rowsTipoPago, rowsReferencia, rowsAdm, rowsCon] = await Promise.all([
                queryAsync(conn, 'SELECT mes, descripcion, DATE_FORMAT(CURDATE(), \'%m\') AS correcto FROM mes'),
                queryAsync(conn, 'SELECT descripcion AS propiedad_descripcion, id_propiedad FROM propiedad'),
                queryAsync(conn, 'SELECT descripcion AS tipo_propiedad_descripcion, id_tipo_propiedad FROM tipo_propiedad'),
                queryAsync(conn, 'SELECT descripcion AS tipo_pago_descripcion, id_tipo_pago FROM tipo_pago'),
                queryAsync(conn, 'SELECT DISTINCT referencia FROM pago'),
                queryAsync(conn, 'SELECT nombre AS administrador, id_usuario AS id_administrador FROM usuario WHERE tipo_usuario IN(0, 2)'),
                queryAsync(conn, 'SELECT nombre AS condomino, id_usuario AS id_condomino FROM usuario WHERE tipo_usuario = 3')
            ]);

            if (!rowsPropieda.length || !rowsTipoPro.length || !rowsTipoPago.length || !rowsReferencia.length || !rowsAdm.length || !rowsCon.length) {
                console.log("No data found in one or more queries");
                res.redirect('/renderHistorial');
                return;
            }


            /////////////////////////////////////////
            /* consultas para seguimiento */
            /////////////////////////////////////////
            // Consultas en paralelo para optimización
            const [rowsMovimiento, rowsPersona, rowsComentario, rowsStatusSeguimiento] = await Promise.all([
                queryAsync(conn, 'SELECT DISTINCT movimiento FROM seguimiento'),
                queryAsync(conn, "SELECT u.id_usuario, u.nombre, u.tipo_usuario, e.tipo_empleado, CONCAT( CASE WHEN u.tipo_usuario = 0 THEN 'Sin tipo' WHEN u.tipo_usuario = 3 THEN 'Condómino' WHEN u.tipo_usuario = 4 THEN te.descripcion WHEN u.tipo_usuario = 2 THEN 'Administrador' END, ' - ', u.nombre ) AS nombre_y_tipo FROM usuario u LEFT JOIN empleado e ON u.id_usuario = e.id_usuario LEFT JOIN tipo_empleado te ON e.tipo_empleado = te.id_tipo_empleado WHERE u.tipo_usuario IN(0, 2, 3, 4)"),
                queryAsync(conn, 'SELECT DISTINCT comentario FROM seguimiento'),
                queryAsync(conn, 'SELECT descripcion AS status_seguimiento, id_status_seguimiento FROM status_seguimiento')
            ]);

            if (!rowsMovimiento.length || !rowsPersona.length || !rowsComentario.length || !rowsStatusSeguimiento.length) {
                console.log("No data found in one or more queries");
                res.redirect('/renderHistorial');
                return;
            }

            /////////////////////////////////////////
            /* consultas para incidencias */
            /////////////////////////////////////////
            // Consultas en paralelo para optimización
            const [rowsTipoIncidencia, rowsClasificacion, rowsStatusIncidencia, rowsAdmIncidencia, rowsUsuario, rowsFolioIncidencia, rowsAsunto] = await Promise.all([
                queryAsync(conn, 'SELECT descripcion AS tipo_incidencia, id_tipo_incidencia FROM tipo_incidencia'),
                queryAsync(conn, 'SELECT descripcion AS clasificacion_incidencia, id_clasificacion_incidencia FROM clasificacion_incidencia'),
                queryAsync(conn, 'SELECT descripcion AS status_incidencia, id_status_incidencia FROM status_incidencia'),
                queryAsync(conn, 'SELECT nombre AS administrador, id_usuario AS id_administrador FROM usuario u WHERE tipo_usuario IN(0, 2)'),
                queryAsync(conn, 'SELECT nombre AS usuario, id_usuario FROM usuario u WHERE tipo_usuario = 3'),
                queryAsync(conn, 'SELECT folio AS folio_incidencia FROM incidencia'),
                queryAsync(conn, 'SELECT DISTINCT asunto FROM incidencia')
            ]);

            if (!rowsTipoIncidencia.length || !rowsClasificacion.length || !rowsStatusIncidencia.length || !rowsAdmIncidencia.length || !rowsUsuario.length || !rowsFolioIncidencia.length || !rowsAsunto.length) {
                console.log("No data found in one or more queries");
                res.redirect('/renderHistorial');
                return;
            }

            if (campo == 'pagos') {

                formFields = [
                    {
                        label: 'Fecha registro',
                        type: 'date',
                        name: 'fecha',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-calendar',
                    },
                    {
                        label: 'Referencia',
                        type: 'select',
                        name: 'referencia',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-file-signature',
                        options: rowsReferencia.map(r => ({ value: r.referencia, text: r.referencia }))
                    },
                    {
                        label: 'Propiedad',
                        type: 'select',
                        name: 'propiedad',
                        colSpan: 'md:col-span-2',
                        icon: 'fas fa-house',
                        options: rowsPropieda.map(p => ({ value: p.id_propiedad, text: p.propiedad_descripcion }))
                    },
                    {
                        label: 'Mes Inicio',
                        type: 'select',
                        name: 'mesI',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-calendar-day',
                        options: rowsMes.map(m => ({ value: m.mes, text: m.descripcion }))
                    },
                    {
                        label: 'Año Inicio',
                        type: 'select',
                        name: 'añoI',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-calendar-minus',
                        options: años.map(m => ({ value: m.año, text: m.año }))
                    },
                    {
                        label: 'Mes Final',
                        type: 'select',
                        name: 'mesF',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-calendar-day',
                        options: rowsMes.map(m => ({ value: m.mes, text: m.descripcion }))
                    },
                    {
                        label: 'Año Final',
                        type: 'select',
                        name: 'añoF',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-calendar-minus',
                        options: años.map(m => ({ value: m.año, text: m.año }))
                    },
                    {
                        label: 'Tipo de Pago',
                        type: 'select',
                        name: 'tipoPago',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-money-bill-alt',
                        options: rowsTipoPago.map(tp => ({ value: tp.id_tipo_pago, text: tp.tipo_pago_descripcion }))
                    },
                    {
                        label: 'Tipo de Propiedad',
                        type: 'select',
                        name: 'tipoPropiedad',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-city',
                        options: rowsTipoPro.map(tp => ({ value: tp.id_tipo_propiedad, text: tp.tipo_propiedad_descripcion }))
                    },
                    {
                        label: 'Recargo:',
                        type: 'radio',  // Cambiado de 'select' a 'radio'
                        name: 'recargo',
                        colSpan: 'md:col-span-2',
                        options: [
                            { value: 'con_recargo', text: 'Con recargo' },
                            { value: 'sin_recargo', text: 'Sin recargo' }
                        ]
                    },                    
                    {
                        label: 'Administrador',
                        type: 'select',
                        name: 'administrador',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-user-tie',
                        options: rowsAdm.map(a => ({ value: a.id_administrador, text: a.administrador }))
                    },
                    {
                        label: 'Condómino',
                        type: 'select',
                        name: 'condomino',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-user',
                        options: rowsCon.map(c => ({ value: c.id_condomino, text: c.condomino }))
                    },
                ];
            } else if (campo == 'incidencias') {
                formFields = [
                    {
                        label: 'Folio',
                        type: 'select',
                        name: 'folio',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-file-invoice',
                        options: rowsFolioIncidencia.map(p => ({ value: p.folio_incidencia, text: p.folio_incidencia }))
                    },
                    {
                        label: 'Asunto',
                        type: 'select',
                        name: 'asunto',
                        colSpan: 'md:col-span-21',
                        icon: 'fas fa-bullhorn',
                        options: rowsAsunto.map(m => ({ value: m.asunto, text: m.asunto }))
                    },
                    {
                        label: 'Fecha registro',
                        type: 'date',
                        name: 'fecha',
                        icon: 'fas fa-calendar',
                        colSpan: 'md:col-span-1',
                    },
                    {
                        label: 'Tipo incidencia',
                        type: 'select',
                        name: 'tipo_incidencia',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-clipboard-list',
                        options: rowsTipoIncidencia.map(m => ({ value: m.id_tipo_incidencia, text: m.tipo_incidencia }))
                    },
                    {
                        label: 'Clasificación de incidencia',
                        type: 'select',
                        name: 'clasificacion_incidencia',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-clipboard-list',
                        options: rowsClasificacion.map(m => ({ value: m.id_clasificacion_incidencia, text: m.clasificacion_incidencia }))
                    },
                    {
                        label: 'Status de la incidencia',
                        type: 'select',
                        name: 'status_incidencia',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-spinner',
                        options: rowsStatusIncidencia.map(m => ({ value: m.id_status_incidencia, text: m.status_incidencia }))
                    },
                    {
                        label: 'Administrador',
                        type: 'select',
                        name: 'administrador',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-user-tie',
                        options: rowsAdmIncidencia.map(a => ({ value: a.id_administrador, text: a.administrador }))
                    },
                    {
                        label: 'Usuario',
                        type: 'select',
                        name: 'usuario',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-user',
                        options: rowsUsuario.map(c => ({ value: c.id_usuario, text: c.usuario }))
                    },
                ]

            } else if (campo == 'seguimientos') {
                formFields = [
                    {
                        label: 'Folio de la Incidencia',
                        type: 'select',
                        name: 'folio',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-file-invoice',
                        options: rowsFolioIncidencia.map(p => ({ value: p.folio_incidencia, text: p.folio_incidencia }))
                    },
                    {
                        label: 'Número del seguimiento',
                        type: 'select',
                        name: 'movimiento',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-list-ol',
                        options: rowsMovimiento.map(m => ({ value: m.movimiento, text: m.movimiento }))
                    },
                    {
                        label: 'Fecha registro',
                        type: 'date',
                        name: 'fecha',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-calendar'
                    },
                    {
                        label: 'Comentario',
                        type: 'select',
                        name: 'comentario',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-message',
                        options: rowsComentario.map(m => ({ value: m.comentario, text: m.comentario }))
                    },
                    {
                        label: 'Status seguimiento',
                        type: 'select',
                        name: 'status_seguimiento',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-spinner',
                        options: rowsStatusSeguimiento.map(m => ({ value: m.id_status_seguimiento, text: m.status_seguimiento }))
                    },
                    {
                        label: 'Persona asignada',
                        type: 'select',
                        name: 'persona_asignada',
                        colSpan: 'md:col-span-1',
                        icon: 'fas fa-user-tie',
                        options: rowsPersona.map(c => ({ value: c.id_usuario, text: c.nombre_y_tipo }))
                    }
                ]
            } else {
                console.log("NIguno de los campos")
            }

            //console.log("pagoDatos: ", pagoDatos);
            // Renderizar la vista
            res.render('usuarios/administrador/historial/manHistorialEspecifico', {
                name: req.session.name,
                tipoUsuario: 2,
                campo,
                ruta,
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
    } else if (data.campo == 'incidencias') {
        manIncidencias(req, res);
    } else if (data.campo == 'seguimientos') {
        manSeguimiento(req, res);
    } else {
        console.log("adios: ");
    }
}

function renHistorialCampos(req, res) {
    // Limpiamos valores
    req.session.campo = "";
    req.session.errorConsultaE = "";
    req.session.consultaData = "";
    req.session.campoDatos = "";

    // Tomamos el campo de la ruta
    const renCampo = req.params.renCampo;

    if (renCampo == 'pagosG') {
        req.session.campoR = 'pagos';
        res.redirect('/manPagosConsulta');
    } else if (renCampo == 'pagosE') {
        req.session.campoR = 'pagos';
        res.redirect('/manHistorialEspecifico-pagos');
    } else if (renCampo == 'incidenciasG') {
        req.session.campoR = 'incidencias';
        res.redirect('/manIncidenciasConsulta');
    } else if (renCampo == 'incidenciasE') {
        req.session.campoR = 'incidencias';
        res.redirect('/manHistorialEspecifico-incidencias');
    } else if (renCampo == 'seguimientosG') {
        req.session.campoR = 'seguimientos';
        res.redirect('/manSeguimientoConsulta');
    } else if (renCampo == 'seguimientosE') {
        req.session.campoR = 'seguimientos';
        res.redirect('/manHistorialEspecifico-seguimientos');
    } else {
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