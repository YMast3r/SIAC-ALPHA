function renManPropiedad(req, res){
    try{
        res.redirect('/manPropiedad');
    }catch{
        manPropiedad(req, res);
    }
}

function renderManPropiedad(req, res){
    req.session.errorM = "";
    req.session.errorMT = "";
    req.session.dataCampos = "";
    renManPropiedad(req, res)
}

function altaTipoPropiedad(req, res) {
    const data = req.body; 
    req.session.errorM = "";

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

                conn.query('INSERT INTO tipo_propiedad (descripcion, pago) VALUES (?, ?)', [data.descripcionTipoPro, data.pago], (error, rows) => {
                    if (error) {
                        console.error("Error al insertar el tipo de propiedad:", error);
                        return res.status(500).send("Error al agregar el tipo de propiedad");
                    }
                    renderManPropiedad(req, res);
                });
            }else {
                req.session.errorMT = 'Ya existe esa descripción';
                req.session.dataCampos = data;
                renManPropiedad(req, res);
            }
        });
    });
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
                    conn.query('SELECT id_usuario FROM usuario WHERE nombre = ?', [data.condomino], (err, rows) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (rows.length > 0) {
                            const idUsuario = rows[0].id_usuario;
                            consulta = 'INSERT INTO propiedad (id_usuario, descripcion, id_tipo_propiedad) VALUES (?, ?, ?)';
                            parametros = [idUsuario, data.descripcionPropiedad, data.tipoPropiedad];
                            conn.query(consulta, parametros, (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).send("Error al agregar la propiedad");
                                } else {
                                    renderManPropiedad(req, res);
                                }
                            });
                        } else {
                            req.session.errorM = 'No existe el condomino';
                            req.session.dataCampos = data;
                            renManPropiedad(req, res);
                        }
                    });
                } else{
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
            }else {
                req.session.errorM = 'Ya existe esa descripción';
                req.session.dataCampos = data;
                renManPropiedad(req, res);
            }
        });
    });
}

function manPropiedad(req, res) {
    const error = req.session.errorM;
    const errorT = req.session.errorMT;
    const data = req.session.dataCampos;
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        conn.query('SELECT * FROM tipo_propiedad', (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows.length > 0) {
                const tipo = rows;
                conn.query('SELECT a.id_propiedad, a.descripcion, COALESCE(u.nombre, "NULL") AS condomino, b.descripcion AS tipo_propiedad FROM propiedad a JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad LEFT JOIN usuario u ON a.id_usuario = u.id_usuario ORDER BY a.id_propiedad', (err, rows) => {
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
                        data: data,
                        error: error,
                        errorT: errorT
                    });
                }
            });
        }else{
            return res.render('usuarios/administrador/manPropiedad', {
                name: req.session.name,
                tipoUsuario: 2,
                data: data,
                error: error,
                errorT: errorT
            });
            }
        });
    })
}

//para llamar a las funciones
module.exports = {
    manPropiedad,
    altaTipoPropiedad,
    altaPropiedad,
    renderManPropiedad,
};
