const path = require('path');
const fs = require('fs');  // Módulo fs para manipular el sistema de archivos
const multer = require('multer');

// Configuración de Multer para almacenamiento temporal
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../public/imagenes/temp')); // Almacenamiento temporal
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único basado en la fecha actual
    }
});

const upload = multer({ storage: storage }).single('imagen');

function renIncidencia(req, res) {
    const id = req.session.idCon;

    try {
        res.redirect(`/manIncidencia-${id}`);
        return;
    } catch {
        manIncidencia(req, res);
    }
}

function renderIncidencia(req, res) {
    req.session.errorM = "";
    req.session.dataCampos = "";
    renIncidencia(req, res);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function manIncidencia(req, res) {
    const id = req.params.id;
    req.session.idCon = id;
    const error = req.session.errorM;
    const data = req.session.dataCampos;

    let tipo;
    let ruta;
    if (req.session.tipoUsuario == 3) {
        tipo = 3;
        ruta = 'usuarios/condomino/manIncidencia';
    } else {
        tipo = 2;
        ruta = 'usuarios/administrador/condomino/manIncidencia';
    }

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        conn.query('SELECT a.id_usuario AS id, a.nombre, a.correo_electronico, a.telefono, a.tipo_usuario, a.status, a.status AS estado, b.descripcion AS tipo, c.descripcion AS status FROM usuario a, tipo_usuario b, status c WHERE b.id_tipo_usuario = a.tipo_usuario AND c.id_status = a.status AND a.id_usuario = ?', [id], (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows && rows.length > 0) {
                const usuario = rows;

                conn.query('SELECT * FROM tipo_incidencia', [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (rows && rows.length > 0) {
                        const tipos = rows;

                        conn.query('SELECT * FROM status_incidencia', (err, statusRows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (statusRows && statusRows.length > 0) {
                                const status = statusRows;

                                conn.query('SELECT a.folio, a.asunto, a.fecha, a.evidencia, b.descripcion AS tipo, c.descripcion AS status, d.nombre AS usuario FROM incidencia a JOIN tipo_incidencia b ON a.id_tipo_incidencia = b.id_tipo_incidencia JOIN status_incidencia c ON a.id_status_incidencia = c.id_status_incidencia JOIN usuario d ON a.id_usuario = d.id_usuario  WHERE a.id_usuario = ? ORDER BY folio ', [id], (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    if (rows && rows.length > 0) {
                                        const datos = rows.map(row => ({
                                            ...row,
                                            fecha: formatDate(row.fecha),
                                        }));
                                        return res.render(ruta, {
                                            datos: datos,
                                            usuario: usuario,
                                            error: error,
                                            data: data,
                                            status: status,
                                            tipos: tipos, 
                                            name: req.session.name,
                                            id: req.session.idUser,
                                            tipoUsuario: tipo
                                        });
                                    } else {
                                        console.log('No se encontraron incidencias');
                                        return res.render(ruta, {
                                            name: req.session.name,
                                            id: req.session.idUser,
                                            tipoUsuario: tipo,
                                            usuario: usuario,
                                            tipos: tipos,
                                            status: status,
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
}

function altaIncidencia(req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al subir la imagen");
        }

        const data = req.body;
        const nombreAdm = req.session.name;
        const idCon = req.session.idCon;
        req.session.idCon = idCon;

        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                return;
            }
            conn.query('SELECT id_usuario, tipo_usuario FROM usuario WHERE nombre = ?', [nombreAdm], (err, rows) => {
                if (err) {
                    console.log(err);
                    borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
                }
                if (rows && rows.length > 0) {
                    const idAdm = rows[0].id_usuario;
                    const tipo = rows[0].tipo_usuario;
                    let consulta;
                    let parametros;
                    let evidencia = req.file ? `/imagenes/imagenesIncidencia/${req.file.filename}` : null;

                    if (tipo == 3) {
                        consulta = 'INSERT INTO incidencia (id_usuario, descripcion, id_tipo_incidencia, fecha, id_status_incidencia, asunto, evidencia) VALUES (?, ?, ?, ?, ?, ?, ?)';
                        parametros = [idCon, data.descripcion, data.tipo, data.fecha, 1, data.asunto, evidencia];
                    } else {
                        consulta = 'INSERT INTO incidencia (id_usuario, descripcion, id_tipo_incidencia, fecha, id_status_incidencia, id_administardor, asunto, evidencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                        parametros = [idCon, data.descripcion, data.tipo, data.fecha, data.status, idAdm, data.asunto, evidencia];
                    }
                    conn.query(consulta, parametros, (err, rows) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (evidencia) {
                                const tempPath = req.file.path;
                                const targetPath = path.join(__dirname, '../../../public/imagenes/imagenesIncidencia', req.file.filename);
                                fs.rename(tempPath, targetPath, function(err) {
                                    if (err) {
                                        console.log(err);
                                        req.session.errorM = 'Error al mover la imagen';
                                        renIncidencia(req, res);
                                        return;
                                    }
                                    renderIncidencia(req, res);
                                });
                            } else {
                                renderIncidencia(req, res);
                            }
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
    manIncidencia,
    altaIncidencia,
    renderIncidencia
};
