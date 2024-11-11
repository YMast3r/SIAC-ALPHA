const bcrypt = require('bcrypt');

//funcion para mostrar la pantalla de inicio de sesion
function ingreso(req, res) {
    if (!req.session.loggedin) {
        res.render('admiciones/ingreso');
    } else {
        res.redirect('/');
    }
}

//funcion para la identificacion del usuario (saber si existe)
function identificacion(req, res) {
    const data = req.body;
    //coneccion con la base de datos
    req.getConnection((err, conn) => {
        if(err){
            console.log(err);
            return res.status(500).send('Error en la conexión a la base de datos. Intente reiniciar la BD.');
        }
        conn.query('SELECT * FROM usuario WHERE correo_electronico = ?', [data.correo_electronico], (err, userdata) => {
            if(err){
                console.log(err);
                return res.status(500).send('Error en la conexión a la base de datos. Intente reiniciar la BD.');
            }
            if (userdata.length > 0) {
                const user = userdata[0];
                bcrypt.compare(data.password, user.password, (err, isMatch) => {
                    if (isMatch) {
                        if (user.status == 4){
                            req.session.loggedin = true;
                            req.session.name = user.nombre;
                            req.session.idUser = user.id_usuario;
                            req.session.tipoUsuario = user.tipo_usuario;
                            res.redirect('/');
                        }else{
                            pendiente(req, res);
                        }
                    } else { 
                        return res.render('admiciones/ingreso', { 
                        error: 'Error: Contraseña o usuario incorrecto',
                        formData: data 
                    });
                    }
                });
            } else {
                console.log("Error en la autenticación");
                return res.render('admiciones/ingreso', { 
                    error: 'Error: Contraseña o usuario incorrecto',
                formData: data 
            });
            }
        });
    });
}

function ingresoA(req, res){
    req.session.loggedin = true;
    req.session.name = "ivan";
    req.session.idUser = 2;
    req.session.tipoUsuario = 2;
    res.redirect('/');
}

function ingresoAP(req, res){
    req.session.loggedin = true;
    req.session.name = "ivan";
    req.session.idUser = 2;
    req.session.tipoUsuario = 2;
    req.session.idCon = 3;
    res.redirect('/manPago-2');
}

function ingresoAS(req, res){
    req.session.loggedin = true;
    req.session.name = "ivan";
    req.session.idUser = 2;
    req.session.tipoUsuario = 2;
    req.session.idFolio = 1;
    req.session.idCon = 3;
    res.redirect('/manSeguimiento-1');
}

//funcion para resistrar a un usuario
function registro(req, res) {
    return res.render('admiciones/registro');
};

//funcion para dar alta a un usuario
function alta(req, res) {
    const data = req.body;

    if (data.password !== data.confPassword) {
        return res.render('admiciones/registro', { 
            error: 'Error: La contraseña y la confirmación no coinciden',
            formData: data 
        });
    }
    //conceccion con la base de datos
    req.getConnection((err, conn) => {
        if(err){
            console.log(err);
            return res.status(500).send('Error en la conexión a la base de datos. Intente reiniciar la BD.');
        }
        conn.query('SELECT * FROM usuario WHERE correo_electronico = ? OR nombre = ? OR telefono = ?', [data.correo_electronico, data.nombre, data.telefono], (err, userdata) => {
            if(err){
                console.log(err);
                return res.status(500).send('Error en la conexión a la base de datos. Intente reiniciar la BD.');
            }
            if (userdata.length > 0) {
                return res.render('admiciones/registro', { 
                    error: 'Error: El usuario o el correo o el teléfono ya existe!',
                    formData: data 
                });
            }else {
                let letras = /.{8,}/; // Al menos 8 caracteres
                let especialCaracter = /[^A-Za-z0-9]/; // Al menos 1 carácter especial
                let numero = /[0-9]/; // Al menos 1 número
                let mayuscula = /[A-Z]/; // Al menos 1 letra mayúscula
                let errorMensaje = "";

                if (!letras.test(data.password)) {
                    errorMensaje += ` 8 caracteres.<br>`;
                }
                if (!especialCaracter.test(data.password)) {
                    errorMensaje += `1 carácter especial.<br>`;
                }
                if (!numero.test(data.password)) {
                    errorMensaje += ` 1 número.<br>`;
                }
                if (!mayuscula.test(data.password)) {
                    errorMensaje += ` 1 letra mayúscula.<br>`;
                }
                if (errorMensaje !== "") {
                    const errM = `La contraseña debe tener al menos.<br>` + errorMensaje;
                    return res.render('admiciones/registro', { 
                        error: errM,
                        formData: data 
                });
                }else{
                    bcrypt.hash(data.password, 12).then(hash => {
                        data.password = hash;
                        req.getConnection((err, conn) => {
                            if(err){
                                console.log(err);
                                return res.status(500).send('Error en la conexión a la base de datos. Intente reiniciar la BD.');
                            }
                            conn.query('INSERT INTO usuario (nombre, correo_electronico, password, telefono, tipo_usuario, status) VALUES (?, ?, ?, ?, ?, ?)', [data.nombre, data.correo_electronico, data.password, data.telefono, 3, 1], (err, rows) => {
                                if(err){
                                    console.log(err);
                                    return res.status(500).send('Error en la conexión a la base de datos. Intente reiniciar la BD.');
                                }
                                if (err) {
                                    console.error('Error al insertar:', err);
                                    return res.render('admiciones/registro', { 
                                        error: 'Error: Al ingresar los datos!',
                                        formData: data 
                                    });
                                }
                                pendiente(req, res);
                            });
                        });
                    });
                }
            };
        });
    });
}

//funcion para desconectar al usuario
function desconectarse(req, res) {
    if (req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect('/');
}

//funcion para la pagina principal
function principal(req, res){
    if (!req.session.loggedin) {
        res.render('principal');
    } else {
        res.redirect('/');
    }
}

//funcion para una pagina pendiente
function pendiente(req, res){
    if (!req.session.loggedin) {
        return res.render('pendiente');
    } else {
        res.redirect('/');
    }
}

//para llamar a las funciones
module.exports = {
    ingreso,
    ingresoA,
    ingresoAP,
    ingresoAS,
    identificacion,
    registro,
    alta,
    desconectarse,
    principal,
    pendiente,
};