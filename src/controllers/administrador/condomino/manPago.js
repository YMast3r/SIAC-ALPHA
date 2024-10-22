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
        conn.query('SELECT a.id_propiedad, a.descripcion, b.descripcion AS tipo_propiedad, b.pago FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad WHERE a.id_usuario = ?', [id], (err, rowsPropia) => {
            if (err) {
                console.log(err);
            }
            if (rowsPropia && rowsPropia.length > 0) {
                const propiedades = rowsPropia;
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
                conn.query('SELECT a.id_propiedad, a.descripcion, b.descripcion AS tipo_propiedad, b.pago FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad WHERE a.id_propiedad = ?', [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (rows.length > 0) {
                        const usuarioPro = rows;
                        let query;
                        if (tipo == 3) {
                            query = 'SELECT * FROM tipo_pago WHERE id_tipo_pago != 2'
                        } else {
                            query = 'SELECT * FROM tipo_pago'
                        }
                        conn.query(query, (err, rows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (rows.length > 0) {
                                const tipoPago = rows;
                                conn.query('SELECT pago FROM tipo_propiedad WHERE id_tipo_propiedad = (SELECT id_tipo_propiedad FROM propiedad WHERE id_propiedad = ?)', [id], (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }

                                    if (rows.length > 0) {
                                        const cuota = rows[0].pago;

                                        conn.query('SELECT a.folio, a.año, b.descripcion AS mes, a.fecha, COALESCE(a.numero_recibo, "Indefinido") AS numero_recibo, COALESCE(a.referencia, "Indefinido") AS referencia, FORMAT(a.importe, 2) AS importe, FORMAT(a.recargo, 2) AS recargo, FORMAT(a.importe + a.recargo, 2) AS total, COALESCE(c.nombre, "Condomino") AS registro, t.descripcion AS tipo, a.evidencia, COALESCE(a.id_plazo, "Individual") AS plazo FROM pago a LEFT JOIN usuario c ON a.id_administrador = c.id_usuario JOIN mes b ON a.mes = b.mes JOIN tipo_pago t ON a.tipo_pago = t.id_tipo_pago WHERE a.id_propiedad = ? ORDER BY a.folio DESC', [id], (err, rows) => {
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
                                                            usuarioPro: usuarioPro,
                                                            tipoPago: tipoPago,
                                                            cuota: cuota,
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
                                                            usuario: usuario,
                                                            usuarioPro: usuarioPro,
                                                            tipoPago: tipoPago,
                                                            cuota: cuota,
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
                                                    usuario: usuario,
                                                    usuarioPro: usuarioPro,
                                                    tipoPago: tipoPago,
                                                    cuota: cuota,
                                                    error: error,
                                                    errorP: errorP,
                                                    mensajeAlta: mensajeAlta,
                                                    mensajeAltaP: mensajeAltaP,
                                                });
                                            }
                                        });//
                                    }
                                });
                            }
                        });
                    } else {
                        console.log('Error en la búsqueda del usuario');
                    }
                });
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
        const [year, mes] = data.fecha.split('-');

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

                    conn.query('SELECT id_tipo_propiedad FROM propiedad WHERE id_propiedad = ?', [idPro], (err, rows) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Error en la consulta del tipo propiedad");
                        }
                        if (rows.length > 0) {
                            const tipoP = rows[0].id_tipo_propiedad;
                            conn.query('SELECT pago FROM tipo_propiedad WHERE id_tipo_propiedad = ?', [tipoP], (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).send("Error en la consulta del tipo propiedad");
                                }
                                if (rows.length > 0) {
                                    const cuota = rows[0].pago;

                                    conn.query('SELECT precio FROM tipo_pago WHERE id_tipo_pago = ?', [data.tipoPago], (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                            return res.status(500).send("Error en la consulta del tipo propiedad");
                                        }
                                        if (rows.length > 0) {
                                            const precio = rows[0].precio;

                                            let importe;
                                            if (data.tipoPago == 1 || data.tipoPago == 2) {
                                                importe = cuota;
                                            } else {
                                                importe = precio;
                                            }
                                            if (data.recargo) {
                                                data.recargo = data.recargo.replace(/,/g, ''); // Remueve todas las comas del precio
                                            }
                                            if (tipo == 3) {
                                                consulta = 'INSERT INTO pago(id_propiedad , importe, recargo, año, mes, fecha, numero_recibo, referencia, tipo_pago, evidencia) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)';
                                                parametros = [idPro, importe, data.recargo, year, mes, data.reciboFolio, data.referencia, data.tipoPago, imagenRuta];
                                            } else {
                                                consulta = 'INSERT INTO pago(id_propiedad , importe, recargo, año, mes, fecha, numero_recibo, referencia, tipo_pago, id_administrador, evidencia) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?)';
                                                parametros = [idPro, importe, data.recargo, year, mes, data.reciboFolio, data.referencia, data.tipoPago, idAdm, imagenRuta];
                                            }

                                            conn.query('SELECT COUNT(*) AS pago FROM pago WHERE mes = ? AND año = ? AND id_propiedad = ? AND tipo_pago = ?', [mes, year, idPro, data.tipoPago], (err, rows) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                let tempPath;
                                                try {
                                                    tempPath = req.file.path
                                                } catch {
                                                    console.log('No hay imagen');
                                                }
                                                if (rows[0].pago == 0) {
                                                    conn.query(`SELECT DATE_FORMAT(fecha_anexo, '%Y-%m') AS año_mes_anexo FROM propiedad WHERE id_propiedad = ?`, [idPro], (err, rows) => {
                                                        if (err) {
                                                            console.log(err);
                                                            req.session.errorMPago = 'Error en la consulta de propiedad';
                                                            renPago(req, res);
                                                            return;
                                                        }
                                                    
                                                        const [yearAnexo, mesAnexo] = rows[0].año_mes_anexo.split('-').map(Number);
                                                    
                                                        // Consulta para obtener el último pago registrado
                                                        conn.query(`SELECT folio, año, mes FROM pago WHERE id_propiedad = ? AND tipo_pago = ? ORDER BY año DESC, mes DESC LIMIT 1`, [idPro, data.tipoPago], (err, resultado) => {
                                                            if (err) {
                                                                console.log(err);
                                                                req.session.errorMPago = 'Error en la consulta de pagos';
                                                                renPago(req, res);
                                                                return;
                                                            }
                                                    
                                                            const ultimoPago = resultado[0] || null;

                                                            // Si no hay último pago, verificar por la fecha anexo
                                                            if (year < yearAnexo || (year == yearAnexo && mes < mesAnexo)) {
                                                                req.session.errorMPago = 'No se pueden hacer pagos anteriores a la fecha de anexo';
                                                                req.session.mensajeAltaPagoPlazo = "";
                                                                req.session.dataCampos = data;
                                                                try {
                                                                    borrarImagenTemporal(tempPath);
                                                                } catch {
                                                                    console.log('No hay imagen');
                                                                }
                                                                renPago(req, res);
                                                                return;
                                                            }
                                                            
                                                            // Lógica de comparación
                                                            if (ultimoPago) {
                                                                // Verificar si la fecha proporcionada es mayor al último pago
                                                                if (year > ultimoPago.año ||  (year == ultimoPago.año && mes > (ultimoPago.mes +1 ))){
                                                                    req.session.errorMPago = 'No se pueden adelantar pagos sin cubrir los meses anteriores';
                                                                    req.session.mensajeAltaPagoPlazo = "";
                                                                    req.session.dataCampos = data;
                                                                    try {
                                                                        borrarImagenTemporal(tempPath);
                                                                    } catch {
                                                                        console.log('No hay imagen');
                                                                    }
                                                                    renPago(req, res);
                                                                    return;
                                                                }
                                                            } else {
                                                                // Si no hay último pago, verificar por la fecha anexo
                                                                if (year > yearAnexo || (year == yearAnexo && mes > mesAnexo)) {
                                                                    req.session.errorMPago = 'No se pueden adelantar pagos sin cubrir los meses anteriores';
                                                                    req.session.mensajeAltaPagoPlazo = "";
                                                                    req.session.dataCampos = data;
                                                                    try {
                                                                        borrarImagenTemporal(tempPath);
                                                                    } catch {
                                                                        console.log('No hay imagen');
                                                                    }
                                                                    renPago(req, res);
                                                                    return;
                                                                }
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
                                                                                renPago(req, res);
                                                                                return;
                                                                            }
                                                                            renderPago(req, res);
                                                                        });
                                                                    } else {
                                                                        req.session.mensajeAltaPago = "Se registró el pago correctamente";
                                                                        req.session.mensajeAltaPagoPlazo = "";
                                                                        renPagoAlta(req, res);
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    });                                                    
                                                } else {
                                                    req.session.errorMPago = 'Ya existe un pago registrado';
                                                    req.session.mensajeAltaPagoPlazo = "";
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
                                }
                            });
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
        const [añoInicio, mesInicio] = data.fechaInicio.split('-');
        // Extraer año y mes del campo fecha Inicio
        const [añoFin, mesFin] = data.fechaFin.split('-');

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
                    renPago(req, res);
                }

                if (rows.length > 0) {
                    const idAdm = rows[0].id_usuario;
                    const tipo = rows[0].tipo_usuario;

                    // Verificar si existe algún pago en el rango de fechas seleccionado
                    conn.query('SELECT COUNT(*) AS count FROM pago WHERE id_propiedad = ? AND tipo_pago = ? AND ((año > ? OR (año = ? AND mes >= ?)) AND (año < ? OR (año = ? AND mes <= ?)))',
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
                                    req.session.errorMPagoP = 'Error en la consulta de propiedad';
                                    renPago(req, res);
                                    return;
                                }
                            
                                const [yearAnexo, mesAnexo] = rows[0].año_mes_anexo.split('-').map(Number);
                            
                                // Consulta para obtener el último pago registrado
                                conn.query(`SELECT folio, año, mes FROM pago WHERE id_propiedad = ? AND tipo_pago = ? ORDER BY año DESC, mes DESC LIMIT 1`, [idPro, data.tipoPago], (err, resultado) => {
                                    if (err) {
                                        console.log(err);
                                        req.session.errorMPagoP = 'Error en la consulta de pagos';
                                        renPago(req, res);
                                        return;
                                    }
                            
                                    const ultimoPago = resultado[0] || null;

                                    // Si no hay último pago, verificar por la fecha anexo
                                    if (añoInicio < yearAnexo || (añoInicio == yearAnexo && mesInicio < mesAnexo)) {
                                        req.session.errorMPagoP = 'No se pueden hacer pagos anteriores a la fecha de anexo';
                                        req.session.mensajeAltaPago = "";
                                        req.session.dataCampos = data;
                                        try {
                                            borrarImagenTemporal(tempPath);
                                        } catch {
                                            console.log('No hay imagen');
                                        }
                                        renPago(req, res);
                                        return;
                                    }
                                    
                                    // Lógica de comparación
                                    if (ultimoPago) {
                                        // Verificar si la fecha proporcionada es mayor al último pago
                                        if (añoInicio > ultimoPago.año ||  (añoInicio == ultimoPago.año && mesInicio > (ultimoPago.mes +1 ))){
                                            req.session.errorMPagoP = 'No se pueden adelantar pagos sin cubrir los meses anteriores';
                                            req.session.mensajeAltaPago = "";
                                            req.session.dataCampos = data;
                                            try {
                                                borrarImagenTemporal(tempPath);
                                            } catch {
                                                console.log('No hay imagen');
                                            }
                                            renPago(req, res);
                                            return;
                                        }
                                    } else {
                                        // Si no hay último pago, verificar por la fecha anexo
                                        if (añoInicio > yearAnexo || (añoInicio == yearAnexo && mesInicio > mesAnexo)) {
                                            req.session.errorMPagoP = 'No se pueden adelantar pagos sin cubrir los meses anteriores';
                                            req.session.mensajeAltaPago = "";
                                            req.session.dataCampos = data;
                                            try {
                                                borrarImagenTemporal(tempPath);
                                            } catch {
                                                console.log('No hay imagen');
                                            }
                                            renPago(req, res);
                                            return;
                                        }
                                    }
                                        // Obtener la cuota de tipo propiedad
                                        conn.query('SELECT pago FROM tipo_propiedad WHERE id_tipo_propiedad = (SELECT id_tipo_propiedad FROM propiedad WHERE id_propiedad = ?)', [idPro], (err, rows) => {
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).send("Error en la consulta del tipo propiedad");
                                            }

                                            if (rows.length > 0) {
                                                const cuota = rows[0].pago;

                                                conn.query('SELECT precio FROM tipo_pago WHERE id_tipo_pago = ?', [data.tipoPagoPlazo], (err, rows) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.status(500).send("Error en la consulta del tipo de pago");
                                                    }

                                                    if (rows.length > 0) {
                                                        const precio = rows[0].precio;

                                                        let importe;
                                                        if (data.tipoPagoPlazo == 1 || data.tipoPagoPlazo == 2) {
                                                            importe = cuota;
                                                        } else {
                                                            importe = precio;
                                                        }

                                                        // Registrar pagos individuales en la tabla "pagos" para cada mes en el rango
                                                        let pagos = [];
                                                        let recargoOperacion;
                                                        const fechaActual = new Date();
                                                        const fechaFormateada = fechaActual.toISOString().split('T')[0];

                                                        // Calcular el número total de meses
                                                        const totalMeses = (añoFin - añoInicio) * 12 + (mesFin - mesInicio + 1);

                                                        if (data.recargoPlazo) {
                                                            data.recargoPlazo = data.recargoPlazo.replace(/,/g, ''); // Remueve todas las comas del precio
                                                        }

                                                        // Dividir el recargo entre el número total de meses
                                                        recargoOperacion = data.recargoPlazo / totalMeses;

                                                        // Asegurarte de que recargoOperacion sea un número
                                                        if (isNaN(recargoOperacion)) {
                                                            recargoOperacion = 0; // O algún valor por defecto apropiado
                                                        }

                                                        // Ingresar el pago en la tabla "pagoPlazos"
                                                        const queryPagoPlazo = tipo == 3 ?
                                                            'INSERT INTO pago_plazos (mes_inicio, año_Inicio, mes_final, año_final, id_propiedad, id_tipo_pago, fecha, numero_recibo, referencia, importe, recargo, comprobante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' :
                                                            'INSERT INTO pago_plazos (mes_inicio, año_Inicio, mes_final, año_final, id_propiedad, id_tipo_pago, fecha, numero_recibo, referencia, id_administrador, importe, recargo, comprobante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                                                        let pagoPlazo;

                                                        const importePlazo = importe * totalMeses;
                                                        if (data.recargoPlazo) {
                                                            data.recargoPlazo = data.recargoPlazo.replace(/,/g, ''); // Remueve todas las comas del precio
                                                        }
                                                        if (data.recargoPlazo === null) {
                                                            data.recargoPlazo = 0;
                                                        }
                                                        if (tipo == 3) {
                                                            pagoPlazo = [mesInicio, añoInicio, mesFin, añoFin, idPro, data.tipoPagoPlazo, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, importePlazo, data.recargoPlazo, imagenRuta];
                                                        } else {
                                                            pagoPlazo = [mesInicio, añoInicio, mesFin, añoFin, idPro, data.tipoPagoPlazo, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, idAdm, importePlazo, data.recargoPlazo, imagenRuta];
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

                                                                for (let año = añoInicio; año <= añoFin; año++) {
                                                                    // Definir el mes de inicio y fin para cada año
                                                                    let mesIni = (año === añoInicio) ? mesInicio : 1;
                                                                    let mesFinLoop = (año === añoFin) ? mesFin : 12;

                                                                    // Iterar sobre los meses del año actual
                                                                    for (let mes = mesIni; mes <= mesFinLoop; mes++) {
                                                                        if (tipo == 3) {
                                                                            pagos.push([idPro, importe, recargoOperacion, año, mes, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, data.tipoPagoPlazo, imagenRuta, id_plazo]);
                                                                        } else {
                                                                            pagos.push([idPro, importe, recargoOperacion, año, mes, fechaFormateada, data.reciboFolioPlazo, data.referenciaPlazo, data.tipoPagoPlazo, idAdm, imagenRuta, id_plazo]);
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
                                                                    }

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
                                                                    } else {
                                                                        req.session.mensajeAltaPagoPlazo = "Se registró el pago a plazos correctamente";
                                                                        req.session.mensajeAltaPago = "";
                                                                        return renPagoAlta(req, res);
                                                                    }
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                });

                            });
                        });//
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