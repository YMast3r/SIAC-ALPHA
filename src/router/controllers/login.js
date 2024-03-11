const bcrypt = require('bcrypt');

function ingreso(req, res) {
    if (!req.session.loggedin) {
        res.render('admiciones/ingreso');
    } else {
        res.redirect('/');
    }
}

function identificacion(req, res) {
    const data = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE correo_electronico = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                const user = userdata[0];
                bcrypt.compare(data.password, user.password, (err, isMatch) => {
                    if (isMatch) {
                        if (user.status == 4){
                            //req.session.loggedin = true;
                            //req.session.name = user.nombre;
                            if (user.tipo_usuario == 1){
                                catalogosAdm(req, res, user.nombre); 
                            }else if (user.tipo_usuario == 2){
                                req.session.tipo = 'Administrador';
                                principal(req, res);
                            }else if (user.tipo_usuario == 3){
                                req.session.tipo = 'Condomino'
                                principal(req, res);
                            }else if (user.tipo_usuario == 4){
                                req.session.tipo = 'Vigilante';
                                principal(req, res);
                            }else{
                                req.session.tipo = 'Indefinido';
                                principal(req, res);
                            }
                            
                        }else{
                            pendiente(req, res);
                        }
                    } else {
                        console.log("Error en la autenticación");
                        res.render('admiciones/ingreso', { error: 'Error: Contraseña o usuario incorrecto' });
                    }
                });
            } else {
                console.log("Error en la autenticación");
                res.render('admiciones/ingreso', { error: 'Error: Contraseña o usuario incorrecto' });
            }
        });
    });
}

function registro(req, res) {
    req.usuario = "condomino";
    res.render('admiciones/registro', {usuario: req.usuario});
}

function alta(req, res) {
    const data = req.body;
    const usuario = req.session.usuario;
    if (data.password !== data.confpassword) {
        return res.render('admiciones/registro', { 
            error: 'Error: La contraseña y la confirmación no coinciden',
            formData: data 
        });
    }
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE correo_electronico = ? OR nombre = ?', [data.email, data.name], (err, userdata) => {
            if (userdata.length > 0) {
                console.log(userdata.length);
                res.render('admiciones/registro', { 
                    error: 'Error: El usuario ya existe o el correo ya existe!',
                    formData: data 
                });
            } else {
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    req.getConnection((err, conn) => {
                        console.log("Usuario: ", usuario)
                        if (usuario == "condomino"){
                            conn.query('INSERT INTO usuario (nombre, correo_electronico, password, telefono, tipo_usuario, propiedad, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.name, data.email, data.password, data.telefono, 3, 1, 1], (err, rows) => {
                                if (err) {
                                    console.error('Error al insertar:', err);
                                    return res.render('admiciones/registro', { 
                                        error: 'Error: Al ingresar los datos!',
                                        formData: data 
                                    });
                                }
                                pendiente(req, res);
                            });
                        }else if(usuario == "Adm"){
                            conn.query('INSERT INTO usuario (nombre, correo_electronico, password, telefono, tipo_usuario, propiedad, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.name, data.email, data.password, data.telefono, 2, 1, 4], (err, rows) => {
                                if (err) {
                                    console.error('Error al insertar:', err);
                                    return res.render('admiciones/registro', { 
                                        error: 'Error: Al ingresar los datos!',
                                        formData: data 
                                    });
                                }
                                res.redirect('/administra');
                            });
                        }else{
                            res.redirect('/pendiente');
                            console.log("Nada: ", req.session.usuario);
                        }
                    });
                });
            }
        });
    });
}

function desconectarse(req, res) {
    if (req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect('/');
}

function principal(req, res){
    if (!req.session.loggedin) {
        res.render('principal');
    } else {
        res.redirect('/');
    }
}

function pendiente(req, res){
    if (!req.session.loggedin) {
        return res.render('pendiente');
    } else {
        res.redirect('/');
    }
}

function catalogosAdm(req, res, nombre){
    res.render('usuarios/super-adm/catalogos', {nombre});
}

module.exports = {
    ingreso,
    identificacion,
    registro,
    alta,
    desconectarse,
    principal,
    pendiente,
    catalogosAdm,
};