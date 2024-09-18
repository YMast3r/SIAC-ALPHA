function renTipo(req, res) {
    try {
        res.redirect('/manTipo');
    } catch {
        manTipo(req, res);
    }
}

function renderManTipo(req, res) {
    req.session.errorMT = "";
    req.session.dataCampos = "";
    renTipo(req, res)
}

function altaTipoPago(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error de conexión:", err);
            return res.status(500).send("Error de conexión a la base de datos");
        }
        conn.query('SELECT COUNT(*) AS cont FROM tipo_pago WHERE descripcion = ?', [data.descripcionTipoPago], (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows[0].cont == 0) {
                if (data.precio) {
                    data.precio = data.precio.replace(/,/g, ''); // Remueve todas las comas del precio
                }
                conn.query('INSERT INTO tipo_pago (descripcion, precio) VALUES (?, ?)', [data.descripcionTipoPago, data.precio], (error, rows) => {
                    if (error) {
                        console.error("Error al insertar el tipo de propiedad:", error);
                        return res.status(500).send("Error al agregar el tipo de propiedad");
                    }
                    renderManTipo(req, res);
                });
            } else {
                req.session.errorMT = 'Ya existe esa descripción';
                req.session.dataCampos = data;
                renTipo(req, res);
            }
        });
    });
}

function manTipo(req, res) {
    const errorT = req.session.errorMT;
    const data = req.session.dataCampos;
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        }
        conn.query('SELECT id_tipo_pago, descripcion, COALESCE(FORMAT(precio, 2), "Indefinido") AS precio FROM tipo_pago', (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            if (rows.length > 0) {
                const tipo = rows;
                return res.render('usuarios/administrador/manTipo', {
                    name: req.session.name,
                    tipoUsuario: 2,
                    tipoPagos: tipo,
                    data: data,
                    errorT: errorT
                });
            } else {
                return res.render('usuarios/administrador/manTipo', {
                    name: req.session.name,
                    tipoUsuario: 2,
                    data: data,
                    errorT: errorT
                });
            }
        });//
    })
}


module.exports = {
    renderManTipo,
    altaTipoPago,
    manTipo
};