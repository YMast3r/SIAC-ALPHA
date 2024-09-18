//modulos
const express = require('express');
const superAdmCotroller = require('../controllers/superAdm');
const router = express.Router();

// funciones para el super administrador
router.get('/renderAdm', superAdmCotroller.renderAdm);
router.get('/manAdm', superAdmCotroller.manAdm);
router.post('/manipulaAdm', superAdmCotroller.manipulaAdm);
router.get('/ediAdm:id', superAdmCotroller.ediAdm);

module.exports = router;
