const bcrypt = require('bcrypt');
const { render } = require('express/lib/response');

function renderManCondomino(req, res){
    req.session.errorM = "";
    req.session.dataCampos = "";  

    req.session.id_usuario = "";
    req.session.idEdi = ""; 

    try{
        res.redirect('/manCondomino');
    }catch{
        manAdm(req, res);
    }
}

function ediCondomino(req, res) {
    let id;
    // pone como constante para usar el id 
    const idEdi = req.session.idEdi;
    // recupera algun mensaje de error 
    let error = req.session.errorM;
    if (req.params.id){
        // recupera el id de la ruta inicial
        id = req.params.id;
    }else{
        id = idEdi;
    }
    // envia el id a manipula
    req.session.id_usuario = id;
    req.getConnection((err, conn) =>{
        conn.query("SELECT a.id_usuario as id, a.nombre, a.correo_electronico, a.password,a.telefono, a.tipo_usuario, a.status, b.descripcion as tipo, c.descripcion as status FROM usuario a, tipo_usuario b, status c WHERE b.id_tipo_usuario = a.tipo_usuario AND c.id_status = a.status AND a.tipo_usuario = 3 ORDER BY id_usuario ASC",(err, rows) => {
            if (err){
                console.log(err);
            };
            if (rows && rows.length > 0){
                const datos = rows;

                if (req.params.id){
                    conn.query('SELECT a.id_usuario as id, a.nombre, a.correo_electronico, a.telefono, a.tipo_usuario, a.status, a.status as estado, b.descripcion as tipo, c.descripcion as status FROM usuario a, tipo_usuario b, status c WHERE b.id_tipo_usuario = a.tipo_usuario AND c.id_status = a.status AND a.id_usuario = ?', [id], (err, rows) => {
                        if (err) {
                            console.log(err);
                        }
                        if (rows && rows.length > 0) {
                            if (!err){
                                const usuario = rows[0];
                                conn.query('SELECT id_status, descripcion, ? as correcto FROM status', [usuario.estado], (err, rows) => {
                                    if (err){
                                        console.log(err);
                                    }
        
                                    if (rows && rows.length > 0) {
                                        const estados = rows;
                                        res.render('usuarios/administrador/condomino/manCondomino', { 
                                            datos: datos, 
                                            estados: estados, 
                                            name: req.session.name, 
                                            tipoUsuario: 2, 
                                            usuario: usuario, 
                                            error: "", 
                                            modificar: 1});
                                            return;     
                                    }
                                });
                            }
                        }
                    });
                }else{
                    const usuario = req.session.dataCampos;
                    console.log("usuario", usuario);
                    conn.query('SELECT id_status, descripcion, ? as correcto FROM status', [usuario.estado], (err, rows) => {
                        if (err){
                            console.log(err);
                        }

                        if (rows && rows.length > 0) {
                            const estados = rows;
                            res.render('usuarios/administrador/condomino/manCondomino', { 
                                datos: datos, 
                                estados: estados, 
                                name: req.session.name, 
                                tipoUsuario: 2, 
                                usuario: usuario, 
                                error: error, 
                                modificar: 1});
                                return;
                        }
                    });
                }
            };
        });
    });
}

function recuperarPropiedad(req, res) {
    let id;
    // pone como constante para usar el id 
    const idEdi = req.session.idEdi;
    // recupera algun mensaje de error 
    const error = req.session.errorM
    if (req.params.id){
        // recupera el id de la ruta inicial
        id = req.params.id;
    }else{
        id = idEdi;
    }
    // envia el id a manipula
    req.session.id_usuario = id;
    req.getConnection((err, conn) =>{
        conn.query("SELECT a.id_usuario as id, a.nombre, a.correo_electronico, a.telefono, a.tipo_usuario, a.status, a.status as estado, b.descripcion as tipo, c.descripcion as status FROM usuario a, tipo_usuario b, status c WHERE b.id_tipo_usuario = a.tipo_usuario AND c.id_status = a.status AND a.id_usuario = ?", [id], (err, rowsUsuario) => {
            if (err){
                console.log(err);
            };
            if (rowsUsuario && rowsUsuario.length > 0){
                if (!err){
                    const datos = rowsUsuario;
                    conn.query('SELECT a.id_propiedad, a.descripcion, b.descripcion AS tipo_propiedad FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad WHERE a.id_usuario = ?', [id], (err, rowsPropia) => {
                        if (err){
                            console.log(err);
                        }
                        if (rowsPropia){
                            const propia = rowsPropia;
                            conn.query('SELECT a.id_propiedad, a.descripcion, b.descripcion AS tipo_propiedad FROM propiedad a LEFT JOIN tipo_propiedad b ON a.id_tipo_propiedad = b.id_tipo_propiedad WHERE a.id_usuario IS NULL', (err, rowsPropiedad) => {
                                const propiedades = rowsPropiedad;
                                if (err){
                                console.log(err);
                                }
                                if (rowsPropiedad && rowsPropiedad.length > 0) {
                                    res.render('usuarios/administrador/condomino/manCondomino', { 
                                    propiedades: propiedades, 
                                    datos: datos, 
                                    error: error,
                                    propia: propia,
                                    name: req.session.name, 
                                    tipoUsuario: 2, 
                                    anexarPropiedad: 1});
                                    return;     
                            }else if(rowsPropiedad.length <= 0){
                                res.render('usuarios/administrador/condomino/manCondomino', { 
                                propia: propia,
                                datos: datos, 
                                name: req.session.name, 
                                tipoUsuario: 2, 
                                anexarPropiedad: 1});
                                return;
                                }else if (rowsPropiedad.length > 0 && rowsPropia.length <= 0){
                                    res.render('usuarios/administrador/condomino/manCondomino', { 
                                        error: error,
                                        propiedades: propiedades,
                                        datos: datos, 
                                        name: req.session.name, 
                                        tipoUsuario: 2, 
                                        anexarPropiedad: 1});
                                        return;
                                }
                            });//
                        }else if(rowsPropia.length <= 0){
                            res.render('usuarios/administrador/condomino/manCondomino', { 
                            error: error,
                            datos: datos, 
                            name: req.session.name, 
                            tipoUsuario: 2, 
                            anexarPropiedad: 1});
                            return;
                            }
                    });//
                }
            }
        });
    });
}


function anexarPropiedad(req, res){
    const id_propiedad = req.params.id;
    const idMod = req.session.id_usuario;
    
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error de conexión a la base de datos");
        }
            conn.query('UPDATE propiedad SET id_usuario=? WHERE id_propiedad = ?', [idMod, id_propiedad], (err, rows) => {
            if (err) {
            console.log(err);
            return res.status(500).send("Error al agregar la propiedad");
        } else {
            renderManCondomino(req, res);
        }
        });
    });
}

function manCondomino(req, res) {
    const usuario = req.session.dataCampos;
    const error = req.session.errorM;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT id_status, descripcion, 4 as correcto FROM status', (err, rows) => {
            if(err){
                console.log(err);
            }
            if (rows.length > 0) {
                const estados = rows;
                conn.query('SELECT a.id_usuario as id, a.nombre, a.correo_electronico, a.password,a.telefono, a.tipo_usuario, a.status, b.descripcion as tipo, c.descripcion as status FROM usuario a, tipo_usuario b, status c WHERE b.id_tipo_usuario = a.tipo_usuario AND c.id_status = a.status AND a.tipo_usuario = 3 ORDER BY id_usuario ASC', (err, rows) => {
                    if (rows.length > 0) {
                        const datos = rows; 
                        res.render('usuarios/administrador/condomino/manCondomino', { datos: datos, 
                            estados: estados, 
                            name: req.session.name, 
                            tipoUsuario: 2, 
                            usuario: usuario, 
                            error: error});
                            return;
                    } else {
                        res.render('usuarios/administrador/condomino/manCondomino', { estados: estados, 
                            name: req.session.name, 
                            tipoUsuario: 2, 
                            usuario: usuario, 
                            error: error});
                            return;
                    }
                });
            } else {
                return res.status(500).send("Error no hay status");
            }
        });
    });
}

function manipulaCondomino(req, res){
    const data = req.body;
    const idMod = req.session.id_usuario;

    req.session.idEdi = idMod; 
    let passIgual;

    if (idMod){
        if (data.password == "" && data.confPassword == ""){
            passIgual = true;
        }
    }

    if (!passIgual){
        if (data.password !== data.confPassword) {
            req.session.errorM = 'Error: La contraseña y la confirmación no coinciden';
            req.session.dataCampos = data;
            
            if (idMod){
                ediCondomino(req, res);
            }else{
                manCondomino(req, res);
            }
            return;
        }
    }
    //conceccion con la base de datos
    req.getConnection((err, conn) => {
        let consulta;
        let parametros;

        if (idMod){
            consulta = 'SELECT * FROM usuario WHERE (correo_electronico = ? OR nombre = ? OR telefono = ?) AND id_usuario != ?';
            parametros = [data.correo_electronico, data.nombre, data.telefono, idMod];
        }else{
            consulta = 'SELECT * FROM usuario WHERE correo_electronico = ? OR nombre = ? OR telefono = ?';
            parametros = [data.correo_electronico, data.nombre, data.telefono];
        }
        conn.query(consulta, parametros, (err, userdata) => {
            if (userdata.length > 0) {
                //console.log(userdata.length);
                req.session.errorM = 'Error: El usuario ya existe o el correo o el teléfono ya existe!';
                req.session.dataCampos = data;
                if (idMod){
                    ediCondomino(req, res);
                }else{
                    manCondomino(req, res);
                }
                return;
            }else {
                if (passIgual){
                    req.getConnection((err, conn) => {

                        // consulta para actualizar datos del administrador con la misma contraseña
                        const consulta2 = 'UPDATE usuario SET nombre=?, correo_electronico=?, telefono=?, tipo_usuario=?, status=? WHERE id_usuario = ?';
                        const parametros2 = [data.nombre, data.correo_electronico, data.telefono, 3, data.status, idMod];

                        conn.query(consulta2, parametros2, (err, rows) => {
                            if (err) {
                                console.error('Error al insertar:', err);
                                req.session.errorM = 'Error: Al ingresar los datos!';
                                manCondomino(req, res);
                            }
                            renderManCondomino(req, res); 
                            return;
                        });
                    });

                }else{
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
                            req.session.errorM = errM;
                            req.session.dataCampos = data;  
                        if (idMod){
                            ediCondomino(req, res);
                        }else{
                            manCondomino(req, res);
                        }    
                        return;
                    }else{
                        bcrypt.hash(data.password, 12).then(hash => {
                            data.password = hash;
                            req.getConnection((err, conn) => {
                                let consulta2;
                                let parametros2;

                                if (idMod){
                                    // consulta para actualizar datos del administrador con la misma contraseña
                                    consulta2 = 'UPDATE usuario SET nombre=?, correo_electronico=?, password=?, telefono=?, tipo_usuario=?, status=? WHERE id_usuario = ?';
                                    parametros2 = [data.nombre, data.correo_electronico, data.password, data.telefono, 3,  data.status, idMod];
                                }else{
                                    // consulta para insertar datos nuevos del administrador 
                                    consulta2 = 'INSERT INTO usuario (nombre, correo_electronico, password, telefono, tipo_usuario, status) VALUES (?, ?, ?, ?, ?, ?)';
                                    parametros2 = [data.nombre, data.correo_electronico, data.password, data.telefono, 3, data.status];
                                }
                                    conn.query(consulta2, parametros2, (err, rows) => {
                                        if (err) {
                                            console.error('Error al insertar:', err);
                                            req.session.errorM = 'Error: Al ingresar los datos!';
                                            manCondomino(req, res);
                                        }
                                        renderManCondomino(req, res); 
                                        return;
                                    });
                            });
                        }); // termina hash
                    }
                } // termina la condicion si la contraseña se mantiene
            };
        });
    });
}

//para llamar a las funciones
module.exports = {
    manCondomino,
    ediCondomino,
    manipulaCondomino,
    renderManCondomino,
    recuperarPropiedad,
    anexarPropiedad
};
