const medico = require("../models/medico");
const paciente = require("../models/paciente");
const historia = require("../models/historia");
const cita = require("../models/cita");

const passport = require('passport');
const inicioCtrl = {};

// Render with cards
inicioCtrl.renderInicio = async (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }else{
        try {
            const numeroMedicos = await medico.countDocuments();
            const numeroPacientes = await paciente.countDocuments();
            const numeroHistoria = await historia.countDocuments();
            const numeroCitasPendientes = await cita.countDocuments({ estado: 'Pendiente' });
        
            res.render('index', {
              numeroMedicos,
              numeroPacientes,
              numeroHistoria,
              numeroCitasPendientes,
              user: req.user,
              isLoggedIn: req.isAuthenticated()
            });
        
            console.log('Estadísticas:', {
              numeroMedicos,
              numeroPacientes,
              numeroHistoria,
              numeroCitasPendientes
            });
          } catch (error) {
            console.error(error);
            console.log('error');
            res.status(500).json({ mensaje: 'Error al obtener las estadísticas' });
          }
    }
  
};

module.exports = inicioCtrl;
