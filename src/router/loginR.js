//modulos
const express = require('express');
const loginController = require('../controllers/login');
const router = express.Router();

//rutas de cada parte del loginController
router.get('/ingreso', loginController.ingreso);
router.post('/identificacion', loginController.identificacion);
router.get('/registro', loginController.registro);
router.post('/alta', loginController.alta);
router.get('/desconectarse', loginController.desconectarse);
router.get('/principal', loginController.principal);
router.get('/pendiente', loginController.pendiente);

module.exports = router;
