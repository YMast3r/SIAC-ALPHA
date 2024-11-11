function renManPropiedad(req, res) {
    try {
        res.redirect('/manPropiedad');
    } catch {
        manPropiedad(req, res);
    }
}

function renManPropiedadAlta(req, res) {
    req.session.errorMPro = "";
    req.session.errorMT = "";
    req.session.dataCampos = "";
    try {
        res.redirect('/manPropiedad');
    } catch {
        manPropiedad(req, res);
    }
}

function renderManPropiedad(req, res) {
    req.session.errorMPro = "";
    req.session.errorMT = "";
    req.session.dataCampos = "";
    req.session.altaT = "";
    renManPropiedad(req, res)
}

function altaTipoPropiedad(req, res) {
    const data = req.body;

    if (data.pago == 0.00) {
        req.session.errorMT = 'No puedes ingresar un precio de 0.00';
        req.session.dataCampos = data;
        renManPropiedad(req, res);
        return;
    } else {
        req.getConnection((err, conn) => {
            if (err) {
                console.error("Error de conexión:", err);
                return res.status(500).send("Error de conexión a la base de datos");
            }
            conn.query('SELECT COUNT(*) AS cont FROM tipo_propiedad WHERE descripcion = ?', [data.descripcionTipoPro], (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (rows[0].cont == 0) {
                    if (data.pago) {
                        data.pago = data.pago.replace(/,/g, ''); // Remueve todas las comas del precio
                    }
                    conn.query('INSERT INTO tipo_propiedad (descripcion, pago, recargo) VALUES (?, ?, ?)', [data.descripcionTipoPro, data.pago, data.recargo], (error, rows) => {
                        if (error) {
                            console.error("Error al insertar el tipo de propiedad:", error);
                            return res.status(500).send("Error al agregar el tipo de propiedad");
                        }
                        req.session.altaT = 'Se registró tipo propiedad correctamente';
                        renManPropiedadAlta(req, res);
                    });
                } else {
                    req.session.errorMT = 'Ya existe esa descripción';
                    req.session.dataCampos = data;
                    renManPropiedad(req, res);
                }
            });
        });
    }
}

function altaPropiedad(req, res) {
    const data = req.body;
    req.session.errorMT = "";

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error de conexión a la base de datos");
        }
        let consulta;
        let parametros;

        conn.query('SELECT COUNT(*) AS cont FROM propiedad WHERE descripcion = ?', [data.descripcionPropiedad], (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows[0].cont == 0) {
                if (data.condomino != "") {
                    consulta = 'INSERT INTO propiedad (id_usuario, descripcion, id_tipo_propiedad, fecha_anexo) VALUES (?, ?, ?, CURDATE())';
                    parametros = [data.condomino, data.descripcionPropiedad, data.tipoPropiedad];
                    conn.query(consulta, parametros, (err, rows) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Error al agregar la propiedad");
                        } else {
                            renderManPropiedad(req, res);
                        }
                    });

                } else {
                    consulta = 'INSERT INTO propiedad (descripcion, id_tipo_propiedad) VALUES (?, ?)';
                    parametros = [data.descripcionPropiedad, data.tipoPropiedad];
                    conn.query(consulta, parametros, (err, rows) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Error al agregar la propiedad");
                        } else {
                            renderManPropiedad(req, res);
                        }
                    });
                }
            } else {
                req.session.errorMPro = 'Ya existe esa descripción';
                req.session.dataCampos = data;
                renManPropiedad(req, res);
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
        conn.query('SELECT nombre, id_usuario FROM usuario WHERE tipo_usuario = 3', (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows.length > 0) {
                const condomino = rows;
                conn.query('SELECT id_tipo_propiedad, descripcion, FORMAT(pago, 2) AS pago, FORMAT(recargo, 2) AS recargo FROM tipo_propiedad ORDER BY id_tipo_propiedad DESC', (err, rows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (rows.length > 0) {
                        const tipo = rows;
                        conn.query('SELECT a.id_propiedad, a.descripcion, COALESCE(u.nombre, "Sin condomino") AS condomino, b.descripcion AS tipo_propiedad FROM propiedad a JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad LEFT JOIN usuario u ON a.id_usuario = u.id_usuario ORDER BY a.id_propiedad DESC', (err, rows) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (rows.length > 0) {
                                const propiedad = rows;
                                return res.render('usuarios/administrador/manPropiedad', {
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
                            }
                        });
                    } else {
                        return res.render('usuarios/administrador/manPropiedad', {
                            name: req.session.name,
                            tipoUsuario: 2,
                            data: data,
                            altaT: altaT,
                            condomino: condomino,
                            error: error,
                            errorT: errorT
                        });
                    }
                });//
            }
        });//
    })
}

//para llamar a las funciones
module.exports = {
    manPropiedad,
    altaTipoPropiedad,
    altaPropiedad,
    renderManPropiedad,
};
