const { Router } = require('express')
const router = Router();

const { requireLogin} = require('../controllers/login.controller');
const { renderInicio } = require('../controllers/inicio.controller');

router.get('/', requireLogin,renderInicio);

module.exports = router;
