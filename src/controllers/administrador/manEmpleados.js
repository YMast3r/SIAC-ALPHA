function renEmpleados(req, res) {
    try {
        res.redirect('/manEmpleados');
        return;
    } catch {
        manEmpleados(req, res);
    }
}

function renderEmpleados(req, res) {
    // Limpiamos otros campos de error y datos
    req.session.errorMEmpleado = "";
    req.session.dataCampos = "";
    renEmpleados(req, res);
}

function registrarEmpleado(req, res) {
    const data = req.body;

    if (data.salario == 0.00) {
        req.session.errorMEmpleado = 'Error: No puedes ingresar un precio de 0.00';
        req.session.dataCampos = data;
        renEmpleados(req, res);
        return;
    }

    if (data.password !== data.confPassword) {
        req.session.errorMEmpleado = 'Error: La contraseña y la confirmación no coinciden';
        req.session.dataCampos = data;
        renEmpleados(req, res);
        return;
    }

    //recuperar fecha de hoy
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${fechaActual.getDate()}`;
    // Verificar que la fecha proporcionada no sea futura
    if (data.fecha_contratacion > fechaFormateada) {
        req.session.dataCampos = data;
        req.session.errorMEmpleado = 'No se pueden fechas adelantadas';
        renEmpleados(req, res);
        return;
    } 

    let letras = /.{8,}/; // Al menos 8 caracteres
    let especialCaracter = /[^A-Za-z0-9]/; // Al menos 1 carácter especial
    let numero = /[0-9]/; // Al menos 1 número
    let mayuscula = /[A-Z]/; // Al menos 1 letra mayúscula
    let errorMensaje = "";

    if (!letras.test(data.password)) {
        errorMensaje += ' 8 caracteres.<br>';
    }
    if (!especialCaracter.test(data.password)) {
        errorMensaje += ' 1 carácter especial.<br>';
    }
    if (!numero.test(data.password)) {
        errorMensaje += ' 1 número.<br>';
    }
    if (!mayuscula.test(data.password)) {
        errorMensaje += ' 1 letra mayúscula.<br>';
    }
    if (errorMensaje !== "") {
        const errM = 'La contraseña debe tener al menos.<br>' + errorMensaje;
        req.session.dataCampos = data;
        req.session.errorMEmpleado = errM;
        renEmpleados(req, res);
        return;
    } else {
        // Crear consulta para insertar en la tabla usuario
        const consultaUsuario = `
        INSERT INTO usuario (nombre, correo_electronico, password, tipo_usuario, status, telefono)
        VALUES (?, ?, ?, ?, ?, ?)`;
        const parametrosUsuario = [
            data.nombre,
            data.correo_electronico,
            data.password, // Asignar null si no se proporciona
            data.tipo_usuario || 4, // Asignar un valor por defecto para tipo_usuario si no se proporciona
            1, // Suponiendo que el estado por defecto es 1 (activo)
            data.telefono
        ];

        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error en la conexión con la base de datos");
            }

            conn.query('SELECT * FROM usuario WHERE correo_electronico = ? OR nombre = ? OR telefono = ?', [data.correo_electronico, data.nombre, data.telefono], (err, userdata) => {
                if (err) {
                    console.error('Error en la consulta:', err);
                    return;
                }
                if (userdata.length > 0) {
                    req.session.dataCampos = data;
                    req.session.errorMEmpleado = 'Error: El usuario o el correo o el teléfono ya existe!';
                    renEmpleados(req, res);
                } else {
                    // Insertar en la tabla usuario
                    conn.query(consultaUsuario, parametrosUsuario, (err, resultadoUsuario) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Error al registrar el usuario");
                        }

                        // Obtener el id_usuario del nuevo registro
                        const idUsuario = resultadoUsuario.insertId;

                        // Crear consulta para insertar en la tabla empleado
                        const consultaEmpleado = `
                INSERT INTO empleado (id_usuario, nombre, apellidos, tipo_empleado, salario, 
                fecha_contratacion, telefono, correo_electronico, empresa, 
                fecha_baja, motivo_baja)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                        if (data.salario) {
                            data.salario = data.salario.replace(/,/g, ''); // Remueve           
                        }
                        const parametrosEmpleado = [
                            idUsuario,
                            data.nombre,
                            data.apellidos,
                            data.tipo_empleado || null,
                            data.salario || null,
                            data.fecha_contratacion || null,
                            data.telefono,
                            data.correo_electronico,
                            data.empresa || null,
                            null, // fecha_baja
                            null  // motivo_baja
                        ];

                        // Insertar en la tabla empleado
                        conn.query(consultaEmpleado, parametrosEmpleado, (err) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send("Error al registrar el empleado");
                            }

                            res.redirect('/renderEmpleados');
                        });
                    });
                }
            });
        });
    }
}

function manEmpleados(req, res) {
    const error = req.session.errorMEmpleado;
    const data = req.session.dataCampos;
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en la conexión con la base de datos");
        }

        // Consulta para obtener los empleados
        conn.query('SELECT e.id_empleado, e.nombre AS nombre_usuario, e.correo_electronico, e.telefono, e.nombre, e.apellidos, u.descripcion AS tipo_empleado, FORMAT(e.salario, 2) AS salario, e.fecha_contratacion, e.empresa FROM empleado e LEFT JOIN tipo_empleado u ON e.tipo_empleado = u.id_tipo_empleado ORDER BY e.id_empleado DESC', (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al recuperar los empleados");
            }

            let consulta;
            if (req.session.tipoUsuario == 2){
                consulta = 'SELECT id_tipo_empleado, descripcion, FORMAT(salario,2) AS salario FROM tipo_empleado WHERE id_tipo_empleado != 1'
            }else{
                consulta = 'SELECT id_tipo_empleado, descripcion, FORMAT(salario,2) AS salario FROM tipo_empleado'
            }
            // Consulta para obtener los tipos de empleado
            conn.query(consulta, (err, tiposEmpleado) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error al recuperar los tipos de empleado");
                }

                const datos = rows.map(row => ({
                    ...row,
                    fecha_contratacion: formatDate(row.fecha_contratacion), // Formatea la fecha
                }));
                res.render('usuarios/administrador/manEmpleado', {
                    name: req.session.name,
                    tipoUsuario: req.session.tipoUsuario,
                    empleados: datos,
                    data: data,
                    error: error,
                    tiposEmpleado: tiposEmpleado // Pasar los tipos de empleado a la vista
                });
            });
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

module.exports = {
    renderEmpleados,
    registrarEmpleado,
    manEmpleados
};