// Obtener la fecha y hora actual
const fechaActual = new Date();
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
    req.session.errorM = "";
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

function renderPago(req, res) {
    // recuperamos el id del condomino
    const idCon = req.session.idCon;
    // recuperamos el id de la propiedad
    const idPro = req.session.idPropiedad;
    // guardamos el id de la propiedad
    req.session.idPropiedad = idPro;
    // guardamos el id del condomino
    req.session.idCon = idCon;

    req.session.errorM = "";
    req.session.dataCampos = "";
    renPago(req, res);
}

function recuperarPropiedadPago(req, res) {
    // recuperamos el id del condomino
    const idCon = req.session.idCon;
    let id;
    if (req.params.id){
        // recupera el id de la ruta inicial
        id = req.params.id;
    }else{
        id = idCon;
    }
    // guardamos el id del condomino
    req.session.idCon = id;

    let tipo;
    if (req.session.tipoUsuario == 3){
        tipo = 3;
    }else{
        tipo = 2;
    }

    req.getConnection((err, conn) =>{
        conn.query('SELECT a.id_propiedad, a.descripcion, b.descripcion AS tipo_propiedad FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad WHERE a.id_usuario = ?', [id], (err, rowsPropia) => {
            if (err){
                console.log(err);
            }
            if (rowsPropia && rowsPropia.length > 0){
                const propiedades = rowsPropia;
                res.render('usuarios/administrador/condomino/manPago', { 
                propia: 1,
                propiedades: propiedades,
                name: req.session.name, 
                id: req.session.idUser,
                tipoUsuario: tipo});
                return;     
            }else {
                res.render('usuarios/administrador/condomino/manPago', { 
                name: req.session.name, 
                id: req.session.idUser,
                tipoUsuario: tipo});
                return;
                }
        });//
    });
}

function manPago(req, res) {
    const error = req.session.errorM;
    const data = req.session.dataCampos;
    // recuperamos el id del condomino
    const idCon = req.session.idCon;
    // recuperamos el id de la propiedad
    const idPro = req.session.idPropiedad;
    
    let id;
    if (req.params.id){
        // recupera el id de la ruta inicial
        id = req.params.id;
    }else{
        id = idPro;
    }
    // guardamos el id de la propiedad
    req.session.idPropiedad = id;
    // guardamos el id del condomino
    req.session.idCon = idCon;

    let tipo;
    if (req.session.tipoUsuario == 3){
        tipo = 3;
    }else{
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
                conn.query('SELECT a.id_propiedad, a.descripcion, b.descripcion AS tipo_propiedad FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad WHERE a.id_propiedad = ?', [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (rows.length > 0) {
                        const usuarioPro = rows;

                        let mesQuery;
                        if (data) {
                            mesQuery = data.mes;
                        } else {
                            mesQuery = fechaActual.getMonth() + 1;
                        }
                        conn.query('SELECT mes, descripcion, ? AS correcto FROM mes', [mesQuery], (err, rows) => {
                            if (rows.length > 0) {
                                const meses = rows;
                                conn.query('SELECT a.folio, a.año, b.descripcion AS mes, a.fecha, a.importe, a.recargo, a.importe - a.recargo AS total, COALESCE(c.nombre, "NULL") AS registro, a.evidencia FROM pago a LEFT JOIN usuario c ON a.id_administrador = c.id_usuario JOIN mes b ON a.mes = b.mes WHERE a.id_propiedad = ? ORDER BY a.folio ASC', [id], (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    let años = [];
                                    let correcto;

                                    const año = fechaActual.getFullYear();
                                    for (let i = año - 5; i <= año + 5; i++) {
                                        if (data) {
                                            correcto = (i == data.anio) ? 1 : 0;
                                        } else {
                                            correcto = (i === año) ? 1 : 0;
                                        }
                                        años.push({ año: i, correcto: correcto });
                                    }

                                    if (rows.length > 0) {
                                        const datos = rows.map(row => ({
                                            ...row,
                                            fecha: formatDate(row.fecha), // Formatea la fecha
                                        }));
                                        return res.render('usuarios/administrador/condomino/manPago', {
                                            datos: datos,
                                            usuario: usuario,
                                            usuarioPro: usuarioPro,
                                            meses: meses,
                                            error: error,
                                            data: data,
                                            años: años,
                                            propia: 1,
                                            name: req.session.name,
                                            id: req.session.idUser,
                                            tipoUsuario: tipo
                                        });
                                    } else {
                                        console.log('No se encontraron pagos');
                                        return res.render('usuarios/administrador/condomino/manPago', {
                                            errorDatos: 1,
                                            name: req.session.name,
                                            id: req.session.idUser,
                                            tipoUsuario: tipo,
                                            años: años,
                                            propia: 1,
                                            usuario: usuario,
                                            usuarioPro: usuarioPro,
                                            meses: meses
                                        });
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
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al subir la imagen");
        }
        const data = req.body;
        const nombre = req.session.name;
        const idCon = req.session.idCon;
        const idPro = req.session.idPropiedad;
        // guardamos el id de la propiedad
        req.session.idPropiedad = idPro;
        // guardamos el id del condomino
        req.session.idCon = idCon;

        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                req.session.errorM = 'Error en la conexión con la base de datos';
                renPago(req, res);
                return;
            }

            conn.query('SELECT status FROM usuario WHERE id_usuario = ?', [idCon], (err, rows) => {
                if (err) {
                    console.log(err);
                    req.session.errorM = 'Error en la consulta del usuario';
                    renPago(req, res);
                    return;
                }
                if (rows.length > 0) {
                    const status = rows[0].status;
                    conn.query('SELECT id_usuario, tipo_usuario FROM usuario WHERE nombre = ?', [nombre], (err, rows) => {
                        if (err) {
                            console.log(err);
                            req.session.errorM = 'Error en la consulta del administrador';
                            renPago(req, res);
                            return;
                        }
                        if (rows.length > 0) {
                            const idAdm = rows[0].id_usuario;
                            const tipo = rows[0].tipo_usuario;
                            let consulta;
                            let parametros;
                            
                            if (status == 4) {
                                let imagenRuta = req.file ? `/imagenes/imagenesPago/${req.file.filename}` : null;
                                conn.query('SELECT id_tipo_propiedad FROM propiedad WHERE id_propiedad = ?', [idPro], (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).send("Error en la consuta del tipo propiedad");
                                    }     
                                    if (rows.length > 0) {
                                        const tipoP = rows[0].id_tipo_propiedad;    
                                        conn.query('SELECT pago FROM tipo_propiedad WHERE id_tipo_propiedad = ?', [tipoP], (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                            return res.status(500).send("Error en la consuta del tipo propiedad");
                                        }     
                                        if (rows.length > 0) {
                                            const cuota = rows[0].pago;    
                                            if (tipo == 3) {
                                                console.log('Condomino');
                                                consulta = 'INSERT INTO pago(id_propiedad , importe, recargo, año, mes, fecha, evidencia) VALUES (?, ?, ?, ?, ?, CURDATE(), ?)';
                                                parametros = [idPro, cuota, data.recargo, data.anio, data.mes, imagenRuta];
                                            } else {
                                                console.log('adm');
                                                consulta = 'INSERT INTO pago(id_propiedad , importe, recargo, año, mes, fecha, id_administrador, evidencia) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?)';
                                                parametros = [idPro, cuota, data.recargo, data.anio, data.mes, idAdm, imagenRuta];
                                            }
                                            conn.query('SELECT COUNT(*) AS pago FROM pago WHERE mes = ? AND año = ? AND id_propiedad = ?', [data.mes, data.anio, idPro], (err, rows) => {
                                                if (err) {
                                                    console.log(err);
                                                    req.session.errorM = 'Error en la consulta de pagos';
                                                    renPago(req, res);
                                                    return;
                                                }
                                                if (rows[0].pago == 0) {
                                                    conn.query(consulta, parametros, (err, rows) => {
                                                        if (err) {
                                                            console.log(err);
                                                            console.log(rows);
                                                            req.session.errorM = 'Error al insertar el pago';
                                                            renPago(req, res);
                                                        } else {
                                                            if (imagenRuta) {
                                                                const tempPath = req.file.path;
                                                                const targetPath = path.join(__dirname, '../../../public/imagenes/imagenesPago', req.file.filename);
                                                                fs.rename(tempPath, targetPath, function(err) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        req.session.errorM = 'Error al mover la imagen';
                                                                        renPago(req, res);
                                                                        return;
                                                                    }
                                                                    renderPago(req, res);
                                                                });
                                                            } else {
                                                                renderPago(req, res);
                                                            }                                                       
                                                        }
                                                    });
                                                } else {
                                                    req.session.errorM = 'Ya existe un pago registrado';
                                                    req.session.dataCampos = data;
                                                    try{

                                                        borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
                                                    }catch{
                                                        console.log('No hay imagen')
                                                    }
                                                    renPago(req, res);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                            } else {
                                try{

                                    borrarImagenTemporal(req.file.path); // Borrar imagen temporal en caso de error
                                }catch{
                                    console.log('No hay imagen')
                                }
                                req.session.errorM = 'El usuario no está activo';
                                req.session.dataCampos = data;
                                renPago(req, res);
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
    altaPago,
    renderPago,
    manPago,
    recuperarPropiedadPago,
    renderRecuperarPropiedadPago,
};