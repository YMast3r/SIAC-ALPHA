// Obtener la fecha y hora actual
const fechaActual = new Date();
const path = require('path');
const fs = require('fs');  // Módulo fs para manipular el sistema de archivos
const multer = require('multer');

// Configuración de Multer para almacenamiento temporal
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../public/imagenes')); // Almacenamiento temporal
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único basado en la fecha actual
    }
});

const upload = multer({ storage: storage }).single('imagen');


function renPago(req, res) {
    // Recuperamos el id guardado
    const id = req.session.idPropiedad;
    try {
        res.redirect(`/manPago-${id}`);
        return;
    } catch {
        manPago(req, res);
    }
}

function renderRecuperarPropiedadPago(req, res) {
    req.session.errorMPago = "";
    req.session.errorMPagoP = "";
    req.session.dataCampos = "";
    // Recuperamos el id guardado
    const id = req.session.idCon;

    try {
        res.redirect(`/recuperarPropiedadPago-${id}`);
        return;
    } catch {
        recuperarPropiedadPago(req, res);
    }
}

function renPagoAlta(req, res) {
    // Recuperamos el id guardado
    const id = req.session.idPropiedad;
    // Limpiamos otros campos de error y datos
    req.session.errorMPago = "";
    req.session.errorMPagoP = "";
    req.session.dataCampos = "";
    try {
        res.redirect(`/manPago-${id}`);
        return;
    } catch {
        manPago(req, res);
    }
}

function renderPago(req, res) {
    // Recuperamos y guardamos el id del condomino y de la propiedad
    req.session.idCon = req.session.idCon;
    req.session.idPropiedad = req.session.idPropiedad;

    // Limpiamos los mensajes de alta
    req.session.mensajeAltaPago = "";
    req.session.mensajeAltaPagoPlazo = "";

    // Limpiamos otros campos de error y datos
    req.session.errorMPago = "";
    req.session.errorMPagoP = "";
    req.session.dataCampos = "";

    renPago(req, res);
}

function recuperarPropiedadPago(req, res) {
    // recuperamos el id del condomino
    const idCon = req.session.idCon;
    req.session.errorMPago = "";
    req.session.errorMPagoP = "";
    req.session.dataCampos = "";
    // Limpiamos los mensajes de alta
    req.session.mensajeAltaPago = "";
    req.session.mensajeAltaPagoPlazo = "";

    let id;
    if (req.params.id) {
        // recupera el id de la ruta inicial
        id = req.params.id;
    } else {
        id = idCon;
    }
    // guardamos el id del condomino
    req.session.idCon = id;

    let tipo;
    if (req.session.tipoUsuario == 3) {
        tipo = 3;
    } else {
        tipo = 2;
    }

    req.getConnection((err, conn) => {
        conn.query('SELECT a.id_propiedad, a.descripcion, b.descripcion AS tipo_propiedad, b.pago, a.fecha_anexo FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad WHERE a.id_usuario = ? ORDER BY a.id_propiedad DESC', [id], (err, rowsPropia) => {
            if (err) {
                console.log(err);
            }
            if (rowsPropia && rowsPropia.length > 0) {
                const propiedades = rowsPropia.map(row => ({
                    ...row,
                    fecha_anexo: formatDate(row.fecha_anexo), // Formatea la fecha
                }));
                res.render('usuarios/administrador/condomino/manPago', {
                    propia: 1,
                    propiedades: propiedades,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: tipo
                });
                return;
            } else {
                res.render('usuarios/administrador/condomino/manPago', {
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: tipo
                });
                return;
            }
        });//
    });
}

function manPago(req, res) {
    const error = req.session.errorMPago;
    const mensajeAlta = req.session.mensajeAltaPago;
    const mensajeAltaP = req.session.mensajeAltaPagoPlazo;
    const errorP = req.session.errorMPagoP;
    const data = req.session.dataCampos;
    // recuperamos el id del condomino
    const idCon = req.session.idCon;
    // recuperamos el id de la propiedad
    const idPro = req.session.idPropiedad;

    let id;
    if (req.params.id) {
        // recupera el id de la ruta inicial
        id = req.params.id;
    } else {
        id = idPro;
    }
    // guardamos el id de la propiedad
    req.session.idPropiedad = id;
    // guardamos el id del condomino
    req.session.idCon = idCon;

    let tipo;
    if (req.session.tipoUsuario == 3) {
        tipo = 3;
    } else {
        tipo = 2;
    }

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        conn.query('SELECT a.id_usuario AS id, a.nombre, a.correo_electronico, a.telefono, a.tipo_usuario, a.status, a.status AS estado, b.descripcion AS tipo, c.descripcion AS status FROM usuario a, tipo_usuario b, status c WHERE b.id_tipo_usuario = a.tipo_usuario AND c.id_status = a.status AND a.id_usuario = ?', [idCon], (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows.length > 0) {
                const usuario = rows;
                const estado = usuario[0].status;
                conn.query('SELECT a.id_propiedad, a.descripcion, a.fecha_anexo, m.descripcion AS mes, DATE_FORMAT(a.fecha_anexo, \'%y\') AS año, b.descripcion AS tipo_propiedad, b.pago FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad LEFT JOIN mes m ON DATE_FORMAT(a.fecha_anexo, \'%m\') = m.mes WHERE a.id_propiedad = ?', [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (rows.length > 0) {
                        const usuarioPro = rows.map(row => ({
                            ...row,
                            fecha_anexo: formatDate(row.fecha_anexo), // Formatea la fecha
                        }));

                        conn.query("SELECT * FROM tipo_pago", [id], (err, rows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            const tipoPagoFiltro = rows;
                            conn.query("SELECT t.id_tipo_pago, t.descripcion, pg.folio, CASE WHEN t.id_tipo_pago = 1 THEN tp.pago ELSE t.precio END AS importe, CASE WHEN t.id_tipo_pago = 1 THEN tp.recargo ELSE t.recargo END AS recargo, CASE WHEN pg.año IS NULL AND pg.mes IS NULL THEN EXTRACT(YEAR FROM CURDATE()) * 12 + EXTRACT(MONTH FROM CURDATE()) - (EXTRACT(YEAR FROM p.fecha_anexo) * 12 + EXTRACT(MONTH FROM p.fecha_anexo)) ELSE (EXTRACT(YEAR FROM CURDATE()) * 12 + EXTRACT(MONTH FROM CURDATE()) - (pg.año * 12 + pg.mes) - 1) END AS meses_por_pagar, CASE WHEN pg.año IS NULL AND pg.mes IS NULL THEN CONCAT((SELECT descripcion FROM mes WHERE mes.mes = EXTRACT(MONTH FROM p.fecha_anexo)), ' de ', EXTRACT(YEAR FROM p.fecha_anexo)) ELSE CONCAT((SELECT descripcion FROM mes WHERE mes.mes = pg.mes + 1), ' de ', pg.año) END AS fecha, CASE WHEN pg.año IS NULL AND pg.mes IS NULL THEN EXTRACT(MONTH FROM p.fecha_anexo) - 1 ELSE pg.mes END AS mes, CASE WHEN pg.año IS NULL AND pg.mes IS NULL THEN EXTRACT(YEAR FROM p.fecha_anexo) ELSE pg.año END AS year FROM tipo_pago t CROSS JOIN propiedad p LEFT JOIN tipo_propiedad tp ON p.id_tipo_propiedad = tp.id_tipo_propiedad LEFT JOIN (SELECT p1.id_propiedad, p1.tipo_pago, p1.año, p1.mes, p1.folio FROM pago p1 JOIN (SELECT id_propiedad, tipo_pago, MAX(CONCAT(año, LPAD(mes, 2, '0'))) AS max_fecha FROM pago WHERE Cancelado_Activo = 'Activo' GROUP BY id_propiedad, tipo_pago) p2 ON p1.id_propiedad = p2.id_propiedad AND p1.tipo_pago = p2.tipo_pago AND CONCAT(p1.año, LPAD(p1.mes, 2, '0')) = p2.max_fecha) pg ON p.id_propiedad = pg.id_propiedad AND pg.tipo_pago = t.id_tipo_pago WHERE p.id_propiedad = ? ORDER BY t.id_tipo_pago;", [id], (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (rows.length > 0) {
                                    const tipoPago = rows;
                                    conn.query('SELECT a.folio, a.año, b.descripcion AS mes, a.fecha, COALESCE(a.numero_recibo, "Indefinido") AS numero_recibo, COALESCE(a.referencia, "Indefinido") AS referencia, FORMAT(a.importe, 2) AS importe, FORMAT(a.recargo, 2) AS recargo, FORMAT(a.importe + a.recargo, 2) AS total, COALESCE(c.nombre, "Condomino") AS registro, t.descripcion AS tipo, a.evidencia, COALESCE(a.id_plazo, "Individual") AS plazo, a.Cancelado_Activo FROM pago a LEFT JOIN usuario c ON a.id_administrador = c.id_usuario JOIN mes b ON a.mes = b.mes JOIN tipo_pago t ON a.tipo_pago = t.id_tipo_pago WHERE a.id_propiedad = ? ORDER BY a.folio DESC', [id], (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (rows.length > 0) {
                                            const datos = rows.map(row => ({
                                                ...row,
                                                fecha: formatDate(row.fecha), // Formatea la fecha
                                            }));
                                            conn.query('SELECT a.folio, b1.descripcion AS mes_inicio, a.año_inicio, b2.descripcion AS mes_final, a.año_final, t.descripcion AS tipo_pago, a.fecha, COALESCE(a.numero_recibo, "Indefinido") AS numero_recibo, COALESCE(a.referencia, "Indefinido") AS referencia, FORMAT(a.importe, 2) AS importe, FORMAT(a.recargo, 2) AS recargo, FORMAT(a.importe + a.recargo, 2) AS total, COALESCE(c.nombre, "Condomino") AS registro, t.descripcion AS tipo, a.comprobante AS evidencia FROM pago_plazos a LEFT JOIN usuario c ON a.id_administrador = c.id_usuario JOIN mes b1 ON a.mes_inicio = b1.mes JOIN mes b2 ON a.mes_final = b2.mes JOIN tipo_pago t ON a.id_tipo_pago = t.id_tipo_pago WHERE a.id_propiedad = ? ORDER BY a.folio DESC', [id], (err, rows) => {
                                                if (err) {
                                                    console.log(err);
                                                }

                                                if (rows.length > 0) {
                                                    const datosPlazo = rows.map(row => ({
                                                        ...row,
                                                        fecha: formatDate(row.fecha), // Formatea la fecha
                                                    }));
                                                    return res.render('usuarios/administrador/condomino/manPago', {
                                                        datosPlazo: datosPlazo,
                                                        datos: datos,
                                                        usuario: usuario,
                                                        estado: estado,
                                                        usuarioPro: usuarioPro,
                                                        tipoPago: tipoPago,
                                                        tipoPagoFiltro: tipoPagoFiltro,
                                                        error: error,
                                                        errorP: errorP,
                                                        mensajeAlta: mensajeAlta,
                                                        mensajeAltaP: mensajeAltaP,
                                                        data: data,
                                                        propia: 1,
                                                        name: req.session.name,
                                                        id: req.session.idUser,
                                                        tipoUsuario: tipo
                                                    });
                                                } else {
                                                    console.log('No se encontraron pagos a plazos');
                                                    return res.render('usuarios/administrador/condomino/manPago', {
                                                        datos: datos,
                                                        errorDatosP: 1,
                                                        name: req.session.name,
                                                        id: req.session.idUser,
                                                        tipoUsuario: tipo,
                                                        propia: 1,
                                                        data: data,
                                                        usuario: usuario,
                                                        estado: estado,
                                                        usuarioPro: usuarioPro,
                                                        tipoPago: tipoPago,
                                                        tipoPagoFiltro: tipoPagoFiltro,
                                                        error: error,
                                                        errorP: errorP,
                                                        mensajeAlta: mensajeAlta,
                                                        mensajeAltaP: mensajeAltaP,
                                                    });
                                                }
                                            });//
                                        } else {
                                            console.log('No se encontraron pagos');
                                            return res.render('usuarios/administrador/condomino/manPago', {
                                                errorDatos: 1,
                                                errorDatosP: 1,
                                                name: req.session.name,
                                                id: req.session.idUser,
                                                tipoUsuario: tipo,
                                                propia: 1,
                                                data: data,
                                                usuario: usuario,
                                                estado: estado,
                                                usuarioPro: usuarioPro,
                                                tipoPago: tipoPago,
                                                tipoPagoFiltro: tipoPagoFiltro,
                                                error: error,
                                                errorP: errorP,
                                                mensajeAlta: mensajeAlta,
                                                mensajeAltaP: mensajeAltaP,
                                            });
                                        }
                                    });//
                                }
                            });
                        });
                    }
                });
            } else {
                console.log('Error en la búsqueda del usuario');
            }
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

function altaPago(req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al subir la imagen");
        }

        const data = req.body;
        const nombre = req.session.name;
        const idCon = req.session.idCon;
        const idPro = req.session.idPropiedad;


        // Verificar el formato la fecha final o fecha de inicio
        const regex = /^\d{4}-(0[1-9]|1[0-2])$/;

        if (!regex.test(data.fecha)) {
            req.session.errorMPago = 'La fecha no tienen el formato (YYYY-MM)';
            req.session.errorMPagoP = "";
            req.session.mensajeAltaPagoPlazo = "";
            req.session.dataCampos = data;
            try {
                borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
            } catch {
                console.log('No hay imagen');
            }
            renPago(req, res);
            return;
        }
        // Extraer año y mes del campo fecha
        let [year, mes] = data.fecha.split('-');

        year = year;
        mes = mes;

        let yearUltimo = parseInt(data.year);
        let mesUltimo = parseInt(data.mes);

        if (data.reciboFolio == "") {
            data.reciboFolio = null;
        }

        if (data.referencia == "") {
            data.referencia = null;
        }

        req.session.idPropiedad = idPro;
        req.session.idCon = idCon;

        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                req.session.errorMPago = 'Error en la conexión con la base de datos';
                renPago(req, res);
                return;
            }
            conn.query('SELECT id_usuario, tipo_usuario FROM usuario WHERE nombre = ?', [nombre], (err, rows) => {
                if (err) {
                    console.log(err);
                    req.session.errorMPago = 'Error en la consulta';
                    renPago(req, res);
                    return;
                }
                if (rows.length > 0) {
                    const idAdm = rows[0].id_usuario;
                    const tipo = rows[0].tipo_usuario;
                    let consulta;
                    let parametros;
                    let imagenRuta;
                    try {
                        imagenRuta = req.file ? `/imagenes/imagenesPago/${req.file.filename}` : null;
                    } catch {
                        imagenRuta = null;
                        console.log('No hay imagen');
                    }

                    conn.query('SELECT COUNT(*) AS pago FROM pago WHERE mes = ? AND año = ? AND id_propiedad = ? AND tipo_pago = ? AND Cancelado_Activo = "Activo"', [mes, year, idPro, data.tipoPago], (err, rows) => {
                        if (err) {
                            console.log(err);
                        }
                        let tempPath;
                        try {
                            tempPath = req.file.path
                        } catch {
                            console.log('No hay imagen');
                        }
                        const contador = rows[0].pago;
                        //console.log(`year = ${year}, data.year = ${data.year}, mes = ${mes}, data.mes = ${data.mes}, folio = ${data.folio}`)
                        if (contador == 0) {

                            conn.query(`SELECT DATE_FORMAT(fecha_anexo, '%Y-%m') AS año_mes_anexo FROM propiedad WHERE id_propiedad = ?`, [idPro], (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    req.session.errorMPago = 'Error en la consulta de propiedad';
                                    renPago(req, res);
                                    return;
                                }

                                const [yearAnexo, mesAnexo] = rows[0].año_mes_anexo.split('-').map(Number);
                                // Si no hay último pago, verificar por la fecha anexo
                                if ((year < parseInt(yearAnexo)) || (year == parseInt(yearAnexo)) && (mes < parseInt(mesAnexo))) {
                                    req.session.errorMPago = 'No se pueden hacer pagos anteriores a la fecha de anexo';
                                    req.session.mensajeAltaPagoPlazo = "";
                                    req.session.errorMPagoP = "";
                                    req.session.dataCampos = data;
                                    try {
                                        borrarImagenTemporal(tempPath);
                                    } catch {
                                        console.log('No hay imagen');
                                    }
                                    renPago(req, res);
                                    return;
                                }

                                // Verificar si la fecha proporcionada es mayor al último pago
                                if (
                                    (year > yearUltimo + 1) || // Evita años más de un año por delante
                                    (year == yearUltimo + 1 && !(mesUltimo == 12 && mes == 1)) || // Permitir solo diciembre a enero del siguiente año
                                    (year == yearUltimo && mes > (mesUltimo + 1)) // Dentro del mismo año, no permitir meses adelantados
                                ) {
                                    req.session.errorMPago = 'No se pueden adelantar pagos sin cubrir los meses anteriores';
                                    req.session.mensajeAltaPagoPlazo = "";
                                    req.session.errorMPagoP = "";
                                    req.session.dataCampos = data;
                                    try {
                                        borrarImagenTemporal(tempPath);
                                    } catch {
                                        console.log('No hay imagen');
                                    }
                                    renPago(req, res);
                                    return;
                                }
                                if (data.meses <= 0) {
                                    data.recargoPago = 0.00
                                }

                                if (tipo == 3) {
                                    consulta = 'INSERT INTO pago(id_propiedad , importe, recargo, año, mes, fecha, numero_recibo, referencia, tipo_pago, evidencia) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)';
                                    parametros = [idPro, data.importe, data.recargoPago, year, mes, data.reciboFolio, data.referencia, data.tipoPago, imagenRuta];
                                } else {
                                    consulta = 'INSERT INTO pago(id_propiedad , importe, recargo, año, mes, fecha, numero_recibo, referencia, tipo_pago, id_administrador, evidencia) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?)';
                                    parametros = [idPro, data.importe, data.recargoPago, year, mes, data.reciboFolio, data.referencia, data.tipoPago, idAdm, imagenRuta];
                                }

                                // Si pasó las verificaciones, proceder con la inserción del pago
                                conn.query(consulta, parametros, (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).send("Error en la insert");
                                    } else {
                                        if (imagenRuta) {
                                            const targetPath = path.join(__dirname, '../../../public/imagenes/imagenesPago', req.file.filename);
                                            fs.rename(tempPath, targetPath, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                    req.session.errorMPago = 'Error al mover la imagen';
                                                    req.session.mensajeAltaPagoPlazo = "";
                                                    req.session.errorMPagoP = "";
                                                    renPago(req, res);
                                                    return;
                                                }
                                                renderPago(req, res);
                                            });
                                        }
                                        req.session.mensajeAltaPago = "Se registró el pago correctamente";
                                        req.session.mensajeAltaPagoPlazo = "";
                                        req.session.errorMPagoP = "";
                                        renPagoAlta(req, res);
                                    }
                                });
                            });
                        } else {
                            req.session.errorMPago = 'Ya existe un pago registrado';
                            req.session.mensajeAltaPagoPlazo = "";
                            req.session.errorMPagoP = "";
                            req.session.dataCampos = data;
                            try {
                                borrarImagenTemporal(tempPath);
                            } catch {
                                console.log('No hay imagen');
                            }
                            renPago(req, res);
                        }
                    });
                }
            });
        });
    });
}

function altaPagoPlazo(req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al subir la imagen");
        }

        const data = req.body;

        // Verificar el formato la fecha final o fecha de inicio
        const regex = /^\d{4}-(0[1-9]|1[0-2])$/;

        if (!regex.test(data.fechaInicio) || !regex.test(data.fechaFin)) {
            req.session.errorMPagoP = 'La fecha inicio o fecha final no tienen el formato (YYYY-MM)';
            req.session.mensajeAltaPago = "";
            req.session.errorMPago = "";
            req.session.dataCampos = data;
            try {
                borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
            } catch {
                console.log('No hay imagen');
            }
            renPago(req, res);
            return;
        }

        // Continúa con el procesamiento si las fechas son válidas

        // Extraer año y mes del campo fecha Inicio
        let [añoInicio, mesInicio] = data.fechaInicio.split('-');
        // Extraer año y mes del campo fecha Inicio
        const [añoFin, mesFin] = data.fechaFin.split('-');

        añoInicio = parseInt(añoInicio);
        mesInicio = parseInt(mesInicio);

        let yearUltimo = parseInt(data.yearVarios);
        let mesUltimo = parseInt(data.mesVarios);

        if (data.reciboFolioPlazo == "") {
            data.reciboFolioPlazo = null;
        }

        if (data.referenciaPlazo == "") {
            data.referenciaPlazo = null;
        }

        const nombre = req.session.name;
        const idCon = req.session.idCon;
        const idPro = req.session.idPropiedad;
        // guardamos el id de la propiedad
        req.session.idPropiedad = idPro;
        // guardamos el id del condomino
        req.session.idCon = idCon;
        let imagenRuta;
        try {
            imagenRuta = req.file ? `/imagenes/imagenesPago/${req.file.filename}` : null;
        } catch {
            imagenRuta = null;
            console.log('No hay imagen');
        }

        // Verificar que la fecha final sea mayor a la fecha de inicio
        if (añoFin < añoInicio || (añoFin == añoInicio && mesFin < mesInicio)) {
            req.session.errorMPagoP = 'La fecha final debe ser mayor a la fecha de inicio';
            req.session.mensajeAltaPago = "";
            req.session.errorMPago = "";
            req.session.dataCampos = data;
            try {
                borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
            } catch {
                console.log('No hay imagen');
            }
            renPago(req, res);
            return;
        }

        // Verificar si se seleccionó más de un mes
        if (añoFin == añoInicio && mesFin == mesInicio) {
            req.session.errorMPagoP = 'Seleccione más de un mes';
            req.session.mensajeAltaPago = "";
            req.session.errorMPago = "";
            req.session.dataCampos = data;
            try {
                borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
            } catch {
                console.log('No hay imagen');
            }
            renPago(req, res);
            return;
        }

        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                return res.status(400).send("Error en la conexión con la base de datos");
            }

            conn.query('SELECT id_usuario, tipo_usuario FROM usuario WHERE nombre = ?', [nombre], (err, rows) => {
                if (err) {
                    console.log(err);
                    req.session.errorMPagoP = 'Error en la consulta del administrador';
                    req.session.mensajeAltaPago = "";
                    req.session.errorMPago = "";
                    renPago(req, res);
                }

                if (rows.length > 0) {
                    const idAdm = rows[0].id_usuario;
                    const tipo = rows[0].tipo_usuario;

                    // Verificar si existe algún pago en el rango de fechas seleccionado
                    conn.query('SELECT COUNT(*) AS count FROM pago WHERE Cancelado_Activo = "Activo" AND id_propiedad = ? AND tipo_pago = ? AND ((año > ? OR (año = ? AND mes >= ?)) AND (año < ? OR (año = ? AND mes <= ?)))',
                        [idPro, data.tipoPagoPlazo, añoInicio, añoInicio, mesInicio, añoFin, añoFin, mesFin], (err, rows) => {
                            if (err) {
                                console.log(err);
                                req.session.errorMPagoP = 'Error en la consulta de pagos';
                                req.session.mensajeAltaPago = "";
                                renPago(req, res);
                            }

                            if (rows[0].count > 0) {
                                req.session.errorMPagoP = 'Ya existe un pago registrado en el rango de fechas seleccionado';
                                req.session.mensajeAltaPago = "";
                                req.session.errorMPago = "";
                                req.session.dataCampos = data;
                                try {
                                    borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
                                } catch {
                                    console.log('No hay imagen');
                                }
                                renPago(req, res);
                                return;
                            }

                            conn.query(`SELECT DATE_FORMAT(fecha_anexo, '%Y-%m') AS año_mes_anexo FROM propiedad WHERE id_propiedad = ?`, [idPro], (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    req.session.errorMPago = 'Error en la consulta de propiedad';
                                    renPago(req, res);
                                    return;
                                }

                                const [yearAnexo, mesAnexo] = rows[0].año_mes_anexo.split('-').map(Number);

                                // Si no hay último pago, verificar por la fecha anexo
                                if (añoInicio < parseInt(yearAnexo) || (añoInicio == parseInt(yearAnexo) && mesInicio < parseInt(mesAnexo))) {
                                    req.session.errorMPagoP = 'No se pueden hacer pagos anteriores a la fecha de anexo';
                                    req.session.mensajeAltaPago = "";
                                    req.session.errorMPago = "";
                                    req.session.dataCampos = data;
                                    try {
                                        borrarImagenTemporal(tempPath);
                                    } catch {
                                        console.log('No hay imagen');
                                    }
                                    renPago(req, res);
                                    return;
                                }

                                // Verificar si la fecha proporcionada es mayor al último pago
                                if (
                                    (añoInicio > yearUltimo + 1) || // Evita años más de un año por delante
                                    (añoInicio == yearUltimo + 1 && !(mesUltimo == 12 && mesInicio == 1)) || // Permitir solo diciembre a enero del siguiente año
                                    (añoInicio == yearUltimo && mesInicio > (mesUltimo + 1)) // Dentro del mismo año, no permitir meses adelantados
                                ) {
                                    req.session.errorMPagoP = 'No se pueden adelantar pagos sin cubrir los meses anteriores';
                                    req.session.mensajeAltaPago = "";
                                    req.session.errorMPago = "";
                                    req.session.dataCampos = data;
                                    try {
                                        borrarImagenTemporal(tempPath);
                                    } catch {
                                        console.log('No hay imagen');
                                    }
                                    renPago(req, res);
                                    return;
                                }

                                let pagos = [];
                                let recargoOperacion;
                                const fechaActual = new Date();
                                const fechaFormateada = fechaActual.toISOString().split('T')[0];

                                // Calcular el número total de meses
                                const totalMeses = (añoFin - añoInicio) * 12 + (mesFin - mesInicio + 1);

                                if (data.mesesVarios <= totalMeses) {
                                    recargoOperacion = data.recargoPagoVarios * (data.mesesVarios >= 0 ? data.mesVarios : 0);
                                } else {
                                    recargoOperacion = data.recargoPagoVarios * totalMeses;
                                }

                                // Asegurarte de que recargoOperacion sea un número
                                if (isNaN(recargoOperacion)) {
                                    recargoOperacion = 0; // O algún valor por defecto apropiado
                                }

                                // Ingresar el pago en la tabla "pagoPlazos"
                                const queryPagoPlazo = tipo == 3 ?
                                    'INSERT INTO pago_plazos (mes_inicio, año_Inicio, mes_final, año_final, id_propiedad, id_tipo_pago, fecha, numero_recibo, referencia, importe, recargo, comprobante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' :
                                    'INSERT INTO pago_plazos (mes_inicio, año_Inicio, mes_final, año_final, id_propiedad, id_tipo_pago, fecha, numero_recibo, referencia, id_administrador, importe, recargo, comprobante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                                let pagoPlazo;

                                const importePlazo = data.importeVarios * totalMeses;
                                if (tipo == 3) {
                                    pagoPlazo = [mesInicio, añoInicio, mesFin, añoFin, idPro, data.tipoPagoPlazo, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, importePlazo, recargoOperacion, imagenRuta];
                                } else {
                                    pagoPlazo = [mesInicio, añoInicio, mesFin, añoFin, idPro, data.tipoPagoPlazo, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, idAdm, importePlazo, recargoOperacion, imagenRuta];
                                }

                                conn.query(queryPagoPlazo, pagoPlazo, (err) => {
                                    if (err) {
                                        console.log(err);
                                        req.session.errorMPagoP = 'Error al insertar el pago en pagoPlazos';
                                        req.session.mensajeAltaPago = "";
                                        renPago(req, res);
                                    }

                                    conn.query('SELECT MAX(folio) as folio FROM pago_plazos', (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                            req.session.errorMPagoP = 'Error al insertar los pagos';
                                            req.session.mensajeAltaPago = "";
                                            renPago(req, res);
                                        }
                                        const id_plazo = rows[0].folio;
                                        let recargoOperacion2;
                                        let cont = 0;
                                        for (let año = añoInicio; año <= añoFin; año++) {
                                            // Definir el mes de inicio y fin para cada año
                                            let mesIni = (año === añoInicio) ? mesInicio : 1;
                                            let mesFinLoop = (año == añoFin) ? mesFin : 12;

                                            // Iterar sobre los meses del año actual
                                            for (let mes = mesIni; mes <= mesFinLoop; mes++) {
                                                if (cont < data.mesesVarios) {
                                                    recargoOperacion2 = data.recargoPagoVarios;
                                                } else {
                                                    recargoOperacion2 = 0.00;
                                                }
                                                cont++;

                                                if (tipo == 3) {
                                                    pagos.push([idPro, data.importeVarios, recargoOperacion2, año, mes, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, data.tipoPagoPlazo, imagenRuta, id_plazo]);
                                                } else {
                                                    pagos.push([idPro, data.importeVarios, recargoOperacion2, año, mes, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, data.tipoPagoPlazo, idAdm, imagenRuta, id_plazo]);
                                                }
                                            }
                                        }

                                        const queryPagos = tipo == 3 ?
                                            'INSERT INTO pago (id_propiedad, importe, recargo, año, mes, fecha, numero_recibo, referencia, tipo_pago, evidencia, id_plazo) VALUES ?' :
                                            'INSERT INTO pago (id_propiedad, importe, recargo, año, mes, fecha, numero_recibo, referencia, tipo_pago, id_administrador, evidencia, id_plazo) VALUES ?';

                                        conn.query(queryPagos, [pagos], (err) => {
                                            if (err) {
                                                console.log(err);
                                                req.session.errorMPagoP = 'Error al insertar los pagos';
                                                req.session.mensajeAltaPago = "";
                                                renPago(req, res);
                                            } else {
                                                if (imagenRuta) {
                                                    const targetPath = path.join(__dirname, '../../../public/imagenes/imagenesPago', req.file.filename);
                                                    fs.rename(req.file.path, targetPath, function (err) {
                                                        if (err) {
                                                            console.log(err);
                                                            req.session.errorMPagoP = 'Error al mover la imagen';
                                                            req.session.mensajeAltaPago = "";
                                                            renPago(req, res);
                                                        }
                                                        return renderPago(req, res);
                                                    });
                                                }
                                                req.session.mensajeAltaPagoPlazo = "Se registró el pago a plazos correctamente";
                                                req.session.mensajeAltaPago = "";
                                                return renPagoAlta(req, res);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                }
            });
        });
    });
}


// Función para borrar la imagen temporal en caso de error
function borrarImagenTemporal(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('Error al borrar la imagen temporal:', err);
        } else {
            console.log('Imagen temporal borrada');
        }
    });
}

module.exports = {
    altaPago,
    renderPago,
    manPago,
    recuperarPropiedadPago,
    renderRecuperarPropiedadPago,
    altaPagoPlazo
}