const { Router } = require('express')

const router = Router()

const { deleteCita, renderCitaForm, createCita, renderCita, renderEditCita, updateCita, CitaPacienteHora,renderCitaId, cambiarEstadoCita } = require('../controllers/cita.controller')
const {requireLogin} = require('../controllers/login.controller');

//cita nuevo
router.get('/citas/Agregar',requireLogin, renderCitaForm)
router.post('/citas/new-cita',requireLogin, createCita)

//todos los citas
router.get('/citas/listar', requireLogin,renderCita)

//detalle cita
router.get('/citas/detalle/:id', requireLogin,renderCitaId)


// editar cita
router.get('/citas/editar/:id', requireLogin, renderEditCita)
router.put('/citas/editar/:id',requireLogin, updateCita)

//eliminar cita
router.delete('/citas/Eliminar/:id',requireLogin, deleteCita)

//citas para el calendario
router.get('/citas/events', requireLogin, CitaPacienteHora)
router.get('/citas/events/:estado', requireLogin, CitaPacienteHora);

// Ruta
router.post('/citas/CambiarEstado/:id', requireLogin, cambiarEstadoCita);

module.exports = router;
