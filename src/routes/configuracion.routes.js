const { Router } = require('express')

const router = Router()

const {renderCuenta, renderAyuda, cambiarContrasena} = require('../controllers/configuracion.controller')
const {requireLogin} = require('../controllers/login.controller');

router.get('/cuenta',requireLogin, renderCuenta)
router.post('/cuenta', requireLogin,cambiarContrasena)

router.get('/ayuda', renderAyuda)

module.exports = router;