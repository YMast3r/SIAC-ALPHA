function renHistorial(req, res) {
    res.render('usuarios/administrador/manHistorial', {
        name: req.session.name,
        tipoUsuario: 2,
    });
}

module.exports = { 
    renHistorial 
};