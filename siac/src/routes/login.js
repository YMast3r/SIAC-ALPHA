const express = require('express');
const LoginController = require('../controllers/LoginController');
const router = express.Router();


router.get('/home', LoginController.home);
router.get('/login', LoginController.index);
router.post('/register', LoginController.storeUser);
router.post('/login', LoginController.auth);
router.get('/register', LoginController.register);
router.get('/logout', LoginController.logout);
router.get('/pendiente', LoginController.pendiente);

module.exports = router;
