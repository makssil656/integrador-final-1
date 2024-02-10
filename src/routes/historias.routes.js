const {Router} = require('express')
const router = Router();

const {renderHistoriaForm,createHistoria,renderHistorias, renderEditHistoria, updateHistoria, deleteHistoria,  renderHistorias1} = require('../controllers/historia.controller')
const {requireLogin} = require('../controllers/login.controller');

//historia nuevo
router.get('/historias/Agregar/:id/:id1',requireLogin, renderHistoriaForm)
router.post('/historias/new-historia', requireLogin,createHistoria)

//historias listar
router.get('/historias/historias',requireLogin, renderHistorias1)
router.get('/historias/listar/:id',requireLogin, renderHistorias)

// editar historia
router.get('/historias/editar/:id',requireLogin, renderEditHistoria)
router.put('/historias/editar/:id', requireLogin,updateHistoria)

//eliminar historia
router.delete('/historias/Eliminar/:id',requireLogin, deleteHistoria)

module.exports = router;