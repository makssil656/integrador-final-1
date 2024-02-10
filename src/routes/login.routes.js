const {Router} = require('express')
const router = Router();
const passport = require('passport');
const { iniciarSesion, rememberMe, mostrarFormularioLogin, requireLogin, logout} = require('../controllers/login.controller');

// Rutas relacionadas con el usuario
router.get('/login', mostrarFormularioLogin );
router.post('/login',rememberMe);

// LOGOUT
router.get('/logout', requireLogin,logout);



module.exports = router;
