const { Router } = require('express')

const router = Router()

const {renderHorarioForm, createHorario, renderHorario,horarioFecha,updateHorario,horarioFechaDes,deleteHorario }= require('../controllers/horario.controller')
const horarioCtrl = require('../controllers/horario.controller')
const {requireLogin} = require('../controllers/login.controller');

//horario nuevo nuevo
router.get('/horarios/Agregar',requireLogin, renderHorarioForm )
router.post('/horarios/new-horario', requireLogin, createHorario)

//todos los pacientes
router.get('/horarios/listar',requireLogin,renderHorario)

//mostrar los horarios por fechas
router.get('/obtener_horarios',requireLogin,horarioFecha)
router.get('/obtener_horarios_desocupados',requireLogin,horarioFechaDes)

//actualizar los horarios
router.post('/cambiar_estado',requireLogin,updateHorario)

//eliminar horario
router.delete('/horarios/Eliminar',requireLogin, deleteHorario)

module.exports = router;
