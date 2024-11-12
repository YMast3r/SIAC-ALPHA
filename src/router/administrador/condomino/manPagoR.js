//modulos
const express = require('express');
const pagoController = require('../../../controllers/administrador/condomino/manPago');
const router = express.Router();

router.get('/renderPago', pagoController.renderPago);
router.get('/manPago-:id', pagoController.manPago);
router.post('/altaPago', pagoController.altaPago);
router.post('/altaPagoPlazo', pagoController.altaPagoPlazo);
router.get('/recuperarPropiedadPago-:id', pagoController.recuperarPropiedadPago);
router.get('/renderRecuperarPropiedadPago', pagoController.renderRecuperarPropiedadPago);

router.get('/manActivoCancelado-:idFC', (req, res) => {
    const idFC = req.params.idFC;
    const idP = req.session.idPropiedad;
    req.getConnection((err, conn) => {
        conn.query("UPDATE pago SET `C_A`='C' WHERE folio = ?", [idFC], (err, rows) => {
            res.redirect(`/manPago-${idP}`);
        });
    });
});

module.exports = router;