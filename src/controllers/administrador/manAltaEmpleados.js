function renAltaEmpleados(req, res) {
    // Limpiamos otros campos de error y datos
    req.session.errorMPago = "";
    req.session.dataCampos = "";
    try {
        res.redirect('/manEmpleados');
        return;
    } catch {
        manEmpleados(req, res);
    }
}

function registrarEmpleado(req, res) {
    const data = req.body;

    // Validar los datos de entrada
    if (!data.nombre || !data.apellidos || !data.correo_electronico || !data.telefono || !data.direccion || !data.ciudad || !data.estado || !data.codigo_postal || !data.nss || !data.nacionalidad || !data.genero || !data.estado_civil) {
        return res.status(400).send("Faltan campos requeridos.");
    }

    // Crear consulta para insertar en la tabla usuario
    const consultaUsuario = `
        INSERT INTO usuario (nombre, correo_electronico, password, tipo_usuario, status, telefono)
        VALUES (?, ?, ?, ?, ?, ?)`;
    const parametrosUsuario = [
        data.nombre,
        data.correo_electronico,
        data.password , // Asignar null si no se proporciona
        data.tipo_usuario || 4, // Asignar un valor por defecto para tipo_usuario si no se proporciona
        1, // Suponiendo que el estado por defecto es 1 (activo)
        data.telefono
    ];

    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en la conexión con la base de datos");
        }

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
                INSERT INTO empleado (id_usuario, nombre, apellidos, fecha_nacimiento, tipo_empleado, salario, 
                fecha_contratacion, telefono, correo_electronico, direccion, ciudad, estado, 
                codigo_postal, numero_seguridad_social, nacionalidad, genero, estado_civil, 
                fecha_baja, motivo_baja)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const parametrosEmpleado = [
                idUsuario,
                data.nombre,
                data.apellidos,
                data.fecha_nacimiento || null,
                data.tipo_empleado || null,
                data.salario || null,
                data.fecha_contratacion || null,
                data.telefono,
                data.correo_electronico,
                data.direccion || null,
                data.ciudad || null,
                data.estado || null,
                data.codigo_postal || null,
                data.nss || null,
                data.nacionalidad || null,
                data.genero || null,
                data.estado_civil || null,
                null, // fecha_baja
                null  // motivo_baja
            ];

            // Insertar en la tabla empleado
            conn.query(consultaEmpleado, parametrosEmpleado, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error al registrar el empleado");
                }

                res.redirect('/renAltaEmpleados');
            });
        });
    });
}

function manEmpleados(req, res) {
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en la conexión con la base de datos");
        }

        // Consulta para obtener los empleados
        conn.query('SELECT e.nombre AS nombre_usuario, e.correo_electronico, e.telefono, e.nombre, e.apellidos, u.descripcion AS tipo_empleado, e.salario, e.fecha_contratacion, e.direccion, e.ciudad, e.estado, e.codigo_postal, e.numero_seguridad_social, e.nacionalidad, e.genero, e.estado_civil FROM empleado e LEFT JOIN tipo_empleado u ON e.tipo_empleado = u.id_tipo_empleado', (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al recuperar los empleados");
            }

            // Consulta para obtener los tipos de empleado
            conn.query('SELECT id_tipo_empleado, descripcion FROM tipo_empleado', (err, tiposEmpleado) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error al recuperar los tipos de empleado");
                }

                const datos = rows.map(row => ({
                    ...row,
                    fecha_contratacion: formatDate(row.fecha_contratacion), // Formatea la fecha
                }));

                res.render('usuarios/administrador/manAltaEmpleado', {
                    name: req.session.name,
                    tipoUsuario: 2,
                    empleados: datos,
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
    renAltaEmpleados,
    registrarEmpleado,
    manEmpleados
};