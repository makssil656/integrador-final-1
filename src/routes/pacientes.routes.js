const { Router } = require('express')

const router = Router()

const { deletePaciente, renderPacienteForm, createPaciente, renderPaciente, renderEditPaciente, updatePaciente,pacienteDNI } = require('../controllers/paciente.controller')
const {requireLogin} = require('../controllers/login.controller');

//paciente nuevo
router.get('/pacientes/Agregar',requireLogin, renderPacienteForm)
router.post('/pacientes/new-paciente',requireLogin, createPaciente)

//todos los pacientes
router.get('/pacientes/listar',requireLogin, renderPaciente)

// editar paciente
router.get('/pacientes/editar/:id',requireLogin, renderEditPaciente)
router.put('/pacientes/editar/:id',requireLogin, updatePaciente)

//eliminar paciente
router.delete('/pacientes/Eliminar/:id', requireLogin,deletePaciente)

//paciente con dni
router.get('/paciente/:dni',requireLogin,pacienteDNI)

module.exports = router;
