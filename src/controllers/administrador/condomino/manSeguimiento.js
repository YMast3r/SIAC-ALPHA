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


function renSeguimiento(req, res) {
    // Recuperamos el id guardado
    const id = req.session.idFolio;

    try {
        res.redirect(`/manSeguimiento-${id}`);
        return;
    } catch {
        manSeguimiento(req, res);
    }
}

function renderSeguimiento(req, res) {
    req.session.errorMSeg = "";
    req.session.dataCampos = "";
    renSeguimiento(req, res);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function manSeguimiento(req, res) {
    // recupera el id de la ruta inicial
    const id = req.params.id;
    // Guardamos el id
    req.session.idFolio = id;

    const error = req.session.errorMSeg;
    const data = req.session.dataCampos;

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        conn.query('SELECT * FROM tipo_usuario WHERE id_tipo_usuario !=1', (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows && rows.length > 0) {
                const tipos = rows;
                conn.query('SELECT * FROM tipo_empleado WHERE id_tipo_empleado != 1', (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (rows && rows.length > 0) {
                        const tipoEmpleado = rows;
                        conn.query("SELECT u.id_usuario, u.nombre, u.tipo_usuario, e.tipo_empleado, CONCAT( CASE WHEN u.tipo_usuario = 3 THEN 'Condómino' WHEN u.tipo_usuario = 4 THEN te.descripcion WHEN u.tipo_usuario = 2 THEN 'Administrador' END, ' - ', u.nombre ) AS nombre_y_tipo FROM usuario u LEFT JOIN empleado e ON u.id_usuario = e.id_usuario LEFT JOIN tipo_empleado te ON e.tipo_empleado = te.id_tipo_empleado WHERE u.tipo_usuario IN (2, 3, 4)", (err, rows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (rows && rows.length > 0) {
                                const empleado = rows;
                                conn.query('SELECT id_usuario, fecha FROM incidencia WHERE folio=?', [id], (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    if (rows && rows.length > 0) {
                                        const idCon = rows[0].id_usuario;
                                        conn.query('SELECT a.id_usuario AS id, a.nombre, a.correo_electronico, a.telefono, a.tipo_usuario, a.status, a.status AS estado, b.descripcion AS tipo, c.descripcion AS status FROM usuario a, tipo_usuario b, status c WHERE b.id_tipo_usuario = a.tipo_usuario AND c.id_status = a.status AND a.id_usuario = ?', [idCon], (err, UsuarioRows) => {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            }
                                            if (UsuarioRows && UsuarioRows.length > 0) {
                                                const usuario = UsuarioRows;
                                                // Consulta para obtener los status
                                                conn.query('SELECT * FROM status_seguimiento', (err, statusRows) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return;
                                                    }
                                                    if (statusRows && statusRows.length > 0) {
                                                        const status = statusRows;
                                                        conn.query('SELECT a.folio, a.asunto, a.fecha, a.evidencia, b.descripcion AS tipo, e.descripcion AS clasificacion, c.descripcion AS status, a.descripcion, d.nombre AS usuario FROM incidencia a JOIN tipo_incidencia b ON a.id_tipo_incidencia = b.id_tipo_incidencia JOIN status_incidencia c ON a.id_status_incidencia = c.id_status_incidencia JOIN usuario d ON a.id_usuario = d.id_usuario JOIN clasificacion_incidencia e ON a.clasificacion_incidencia = e.id_clasificacion_incidencia WHERE a.folio = ? ORDER BY a.folio DESC', [id], (err, inciRows) => {
                                                            if (err) {
                                                                console.log(err);
                                                                return;
                                                            }
                                                            if (inciRows && inciRows.length > 0) {
                                                                const incidencia = inciRows;

                                                                conn.query('SELECT s.folio, s.movimiento, u.nombre AS empleado, s.comentario, ss.descripcion AS status, s.fecha, s.evidencia FROM seguimiento s JOIN usuario u ON s.id_empleado = u.id_usuario JOIN status_seguimiento ss ON s.id_status_seguimiento = ss.id_status_seguimiento WHERE s.folio = ? ORDER BY s.movimiento DESC', [id], (err, rows) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        return;
                                                                    }
                                                                    if (rows && rows.length > 0) {
                                                                        const datos = rows.map(row => ({
                                                                            ...row,
                                                                            fecha: formatDate(row.fecha), // Formatea la fecha
                                                                        }));
                                                                        return res.render('usuarios/administrador/condomino/manSeguimiento', {
                                                                            datos: datos,
                                                                            usuario: usuario,
                                                                            incidencia: incidencia,
                                                                            empleado: empleado,
                                                                            tipos: tipos,
                                                                            tipoEmpleado: tipoEmpleado,
                                                                            status: status,
                                                                            error: error,
                                                                            data: data,
                                                                            name: req.session.name,
                                                                            tipoUsuario: 2
                                                                        });
                                                                    } else {
                                                                        console.log('No se encontraron Seguimientos');
                                                                        return res.render('usuarios/administrador/condomino/manSeguimiento', {
                                                                            errorDatos: 1,
                                                                            name: req.session.name,
                                                                            tipoUsuario: 2,
                                                                            segui: 1,
                                                                            error: error,
                                                                            usuario: usuario,
                                                                            incidencia: incidencia,
                                                                            status: status,
                                                                            empleado: empleado,
                                                                            tipos: tipos,
                                                                            tipoEmpleado: tipoEmpleado,
                                                                        });
                                                                    }
                                                                });
                                                                // seguimiento
                                                            }
                                                        }); // incidencia
                                                    }
                                                }); // status
                                            }
                                        }); // usuario
                                    }
                                }); // id_usuario
                            }
                        }); // empleado
                    }
                }); // tipos
            }
        }); // tipo empleado
    });
}

function altaSeguimiento(req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al subir la imagen");
        }
        const data = req.body;
        const id = req.session.idFolio;
        //recuperar fecha de hoy
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${fechaActual.getDate()}`;
        console.log(fechaFormateada); // Imprime la fecha formateada como dd/mm/yyyy
        console.log("fechas",data.fecha,fechaFormateada)
        // Verificar que la fecha proporcionada no sea futura
        if (data.fecha > fechaFormateada) {
            console.log(err);
            req.session.errorMSeg = 'No se pueden fechas adelantadas';
            renSeguimiento(req, res);
            return;
        } 
        if (data.fecha<fechaFormateada){
            console.log(err);
            console.log("fecha 1:",data.fecha,"fecha 2:",fechaFormateada);
            req.session.errorMSeg = 'La fecha no puede ser antes de la fecha Incidencia';
            renSeguimiento(req, res);
            return;
        };
        req.session.idFolio = id;

        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                req.session.errorMSeg = 'Error en la conexión con la base de datos';
                renSeguimiento(req, res);
                return;
            }
            conn.query('SELECT MAX(movimiento) + 1 as max_movimiento FROM seguimiento WHERE folio = ?', [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    req.session.errorMSeg = 'Error en la consulta del seguimiento';
                    renSeguimiento(req, res);
                    return;
                }
                if (rows.length > 0) {
                    let movimiento = rows[0].max_movimiento;
                    if (!movimiento) {
                        movimiento = 1;
                    }
                    conn.query('SELECT COUNT(*) AS cont FROM seguimiento WHERE id_status_seguimiento = ? AND id_status_seguimiento != 2 AND folio = ?', [data.status, id], (err, rows) => {
                        if (err) {
                            console.log(err);
                            req.session.errorMSeg = 'Error en la consulta del seguimiento';
                            renSeguimiento(req, res);
                            return;
                        }
                        if (rows[0].cont == 0) {
                            const imagenRuta = req.file ? `/imagenes/imagenesSeguimiento/${req.file.filename}` : null;

                            conn.query('INSERT INTO seguimiento (folio, movimiento, id_empleado, comentario, id_status_seguimiento, fecha, evidencia) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, movimiento, data.empleado, data.comentario, data.status, data.fecha, imagenRuta], (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    req.session.errorMSeg = 'Error al insertar el seguimiento';
                                    renSeguimiento(req, res);
                                } else {
                                    conn.query('UPDATE incidencia SET id_status_incidencia=? WHERE folio=?', [data.status, id], (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                            req.session.errorMSeg = 'Error al actualizar la incidencia';
                                            renSeguimiento(req, res);
                                        } else {
                                            if (imagenRuta) {
                                                const tempPath = req.file.path;
                                                const targetPath = path.join(__dirname, '../../../public/imagenes/imagenesSeguimiento', req.file.filename);
                                                fs.rename(tempPath, targetPath, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        req.session.errorMSeg = 'Error al mover la imagen';
                                                        renSeguimiento(req, res);
                                                        return;
                                                    }
                                                    renderSeguimiento(req, res);
                                                });
                                            } else {
                                                renderSeguimiento(req, res);
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            try {

                                borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
                            } catch {
                                console.log('No hay imagen')
                            }
                            req.session.errorMSeg = 'Ya existe ese estado';
                            req.session.dataCampos = data;
                            renSeguimiento(req, res);
                        }
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
    manSeguimiento,
    altaSeguimiento,
    renderSeguimiento,
    upload // Exportar upload para usarlo en la ruta
};
