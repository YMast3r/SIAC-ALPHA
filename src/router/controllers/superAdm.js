function superAdmAdministra(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE tipo_usuario=2', (err, results) => {
            if(err){
                console.log('Error', err);
                alert("Error en la consulta");
            }else{
                res.render('usuarios/super-adm/administra', { usuarios: results });
            }
        });
    });
}

function altaAdm(req, res){
    req.session.usuario = "Adm";
    res.render('admiciones/registro', {usuario: req.usuario});
    console.log("req: ", req.session.usuario)
}

module.exports = {
    superAdmAdministra,
    altaAdm,
};