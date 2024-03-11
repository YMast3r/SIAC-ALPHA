const express = require('express');
const loginController = require('./controllers/login');
const superAdmCotroller = require('./controllers/superAdm');
const router = express.Router();

router.get('/ingreso', loginController.ingreso);
router.post('/identificacion', loginController.identificacion);
router.get('/registro', loginController.registro);
router.post('/alta', loginController.alta);
router.get('/desconectarse', loginController.desconectarse);
router.get('/principal', loginController.principal);
router.get('/pendiente', loginController.pendiente);
router.get('/catalogos', loginController.catalogosAdm);

// funciones para el super administrador
router.get('/administra', superAdmCotroller.superAdmAdministra);
router.get('/altaAdm', superAdmCotroller.altaAdm);

module.exports = router;
