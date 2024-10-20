function renHistorial(req, res) {
    res.render('usuarios/administrador/manHistorial', {
        name: req.session.name,
        tipoUsuario: 2,
    });
}

function manPagos(req, res) {

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        conn.query(`SELECT a.folio, a.id_propiedad AS propiedad, FORMAT(a.importe, 2) AS importe, t.descripcion AS tipo_pago, a.fecha, b.descripcion AS mes, a.año, COALESCE(a.numero_recibo, 'Indefinido') AS numero_recibo,  COALESCE(a.referencia, 'Indefinido') AS referencia FROM pago a JOIN mes b ON a.mes = b.mes JOIN tipo_pago t ON a.tipo_pago = t.id_tipo_pago ORDER BY a.folio DESC`, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }

            if (rows.length > 0) {
                // Mapeamos los datos para formatear la fecha
                const pagos = rows.map(row => ({
                    ...row,
                    fecha: formatDate(row.fecha), // Asegúrate de tener la función formatDate
                }));

                // Renderizamos la vista con los pagos
                return res.render('usuarios/administrador/manHistorial', {
                    pagos: pagos,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: req.session.tipoUsuario
                });
            } else {
                // Si no hay pagos, mostramos un mensaje de error
                return res.render('usuarios/administrador/pagos', {
                    errorDatos: 1,
                    name: req.session.name,
                    id: req.session.idUser,
                    tipoUsuario: req.session.tipoUsuario
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

function manIncidencias(req, res) {
    // Obtén el ID del usuario desde la sesión o la ruta
    const idUsuario = req.session.idUser || req.params.id;

    // Determina el tipo y la ruta dependiendo del tipo de usuario
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Consulta para recuperar las incidencias
        conn.query(`SELECT a.folio, d.nombre AS usuario, b.descripcion AS tipo_incidencia, a.fecha, a.descripcion FROM incidencia a JOIN tipo_incidencia b ON a.id_tipo_incidencia = b.id_tipo_incidencia JOIN usuario d ON a.id_usuario = d.id_usuario ORDER BY a.folio DESC`, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }

                if (rows && rows.length > 0) {
                    const incidencias = rows.map(row => ({
                        ...row,
                        fecha: formatDate(row.fecha), // Asegúrate de tener la función formatDate
                    }));

                    // Renderiza la vista con las incidencias
                    return res.render('usuarios/administrador/manHistorial', {
                        incidencias: incidencias,
                        name: req.session.name,
                        id: req.session.idUser,
                        tipoUsuario: 2
                    });
                } else {
                    console.log('No se encontraron incidencias');
                    return res.render('usuarios/administrador/manHistorial', {
                        name: req.session.name,
                        id: req.session.idUser,
                        tipoUsuario: 2,
                        errorDatos: 1, // O un mensaje que desees mostrar
                    });
                }
            });
    });
}

function manCondominos(req, res) {
    const usuario = req.session.dataCampos;
    const error = req.session.errorMC;

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        
        // Consulta para obtener los condóminos
        conn.query(`SELECT a.id_usuario AS id, a.nombre, a.correo_electronico, a.telefono, GROUP_CONCAT(b.descripcion SEPARATOR ', ') AS propiedades FROM usuario a LEFT JOIN propiedad b ON a.id_usuario = b.id_usuario WHERE a.tipo_usuario = 3 GROUP BY a.id_usuario ORDER BY a.id_usuario DESC`, 
        (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            
            if (rows.length > 0) {
                const datos = rows;
                res.render('usuarios/administrador/manHistorial', { 
                    datos: datos, 
                    name: req.session.name, 
                    tipoUsuario: 2, 
                    usuario: usuario, 
                    error: error 
                });
                return;
            } else {
                res.render('usuarios/administrador/manHistorial', { 
                    name: req.session.name, 
                    tipoUsuario: 2, 
                    usuario: usuario, 
                    error: error 
                });
                return;
            }
        });
    });
}

function manPropiedad(req, res) {
    const error = req.session.errorMPro;
    const errorT = req.session.errorMT;
    const data = req.session.dataCampos;
    const altaT = req.session.altaT;

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }

        // Consulta para obtener los condóminos
        conn.query('SELECT nombre, id_usuario FROM usuario WHERE tipo_usuario = 3', (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows.length > 0) {
                const condomino = rows;

                // Consulta para obtener los tipos de propiedad
                conn.query('SELECT id_tipo_propiedad, descripcion FROM tipo_propiedad ORDER BY id_tipo_propiedad DESC', (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (rows.length > 0) {
                        const tipo = rows;

                        // Consulta para obtener las propiedades
                        conn.query(`SELECT a.id_propiedad, a.descripcion, COALESCE(u.nombre, 'Indefinido') AS condomino, b.descripcion AS tipo_propiedad FROM propiedad a LEFT JOIN usuario u ON a.id_usuario = u.id_usuario JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad ORDER BY a.id_propiedad DESC`, 
                        (err, rows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (rows.length > 0) {
                                const propiedad = rows;
                                return res.render('usuarios/administrador/manHistorial', {
                                    name: req.session.name,
                                    tipoUsuario: 2,
                                    tipoPropiedad: tipo,
                                    propiedad: propiedad,
                                    condomino: condomino,
                                    data: data,
                                    altaT: altaT,
                                    error: error,
                                    errorT: errorT
                                });
                            } else {
                                return res.render('usuarios/administrador/manHistorial', {
                                    name: req.session.name,
                                    tipoUsuario: 2,
                                    tipoPropiedad: tipo,
                                    propiedad: [],
                                    condomino: condomino,
                                    data: data,
                                    altaT: altaT,
                                    error: error,
                                    errorT: errorT
                                });
                            }
                        });
                    } else {
                        return res.render('usuarios/administrador/manHistorial', {
                            name: req.session.name,
                            tipoUsuario: 2,
                            data: data,
                            altaT: altaT,
                            condomino: condomino,
                            error: error,
                            errorT: errorT
                        });
                    }
                });
            }
        });
    });
}
module.exports = { 
    renHistorial,
    manPagos,
    manIncidencias,
    manCondominos,
    manPropiedad
};