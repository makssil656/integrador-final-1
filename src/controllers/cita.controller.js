const cita = require('../models/cita')
const horario = require('../models/horario')
const Historia = require("../models/historia");
const citaCtrl = {}
const moment = require('moment');

citaCtrl.renderCitaForm = (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    res.render('citas/Agregar',{
      isLoggedIn: req.isAuthenticated(),
      // Otras variables que necesites pasar
    });
  }
}

citaCtrl.createCita = async (req, res) => {
    console.log(req.body);
    const { estado, motivo, idPaciente, horaCita } = req.body;

    // Create a new cita
    const newCita = new cita({
        paciente: idPaciente,
        horario: horaCita,
        estado: estado,
        motivo: motivo,
    });

    // Save the new cita
    await newCita.save();

    // Update the corresponding horario document
    try {
        await horario.findByIdAndUpdate(horaCita, { estado: 'Ocupado' });
        req.flash('success_msg', 'Cita Agregada');
        res.redirect('/citas/listar');
    } catch (error) {
        console.error('Error updating horario:', error);
        req.flash('error_msg', 'Error updating horario');
        res.redirect('/citas/listar'); // Handle the error as needed
    }
};

citaCtrl.renderCita = async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    res.render('citas/Lista',{
      isLoggedIn: req.isAuthenticated(),
      // Otras variables que necesites pasar
    });
  }
}

citaCtrl.renderEditCita = async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    const citaEditar = await cita.findById(req.params.id)
    res.render('citas/editar',{citaEditar});
  }
}

citaCtrl.updateCita = async (req, res) => {
    const { DNI_paciente, DNI_medico, id_cita, estado, motivo, observaciones, tiempo, Fecha_cita, Hora_cita } = req.body;
    await cita.findByIdAndUpdate(req.params.id,{ DNI_paciente, DNI_medico, id_cita, estado, motivo, observaciones, tiempo, Fecha_cita, Hora_cita })
    req.flash('success_msg','Cita Actualizado: '+DNI_paciente+' '+DNI_medico)
    res.redirect('/citas/listar')
}

citaCtrl.deleteCita = async (req, res) => {
  try {
    
    // Encuentra la cita por su ID
    const citaEliminar = await cita.findById(req.params.id);

    // Verifica si la cita existe
    if (!citaEliminar) {
      req.flash('error_msg', 'Cita no encontrada');
      return res.redirect('/citas/listar');
    }

    // Cambia el estado de la cita a "Cancelada"
    citaEliminar.estado = 'Cancelada';

    // Guarda la cita actualizada
    await citaEliminar.save();

    req.flash('success_msg', 'Cita Cancelada');
    res.redirect('/citas/listar');
  } catch (error) {
    console.error('Error al cancelar la cita:', error);
    req.flash('error_msg', 'Error al cancelar la cita');
    res.redirect('/citas/listar');
  }
}

citaCtrl.CitaPacienteHora = async (req, res) => {
  try {
      let filter = {};
      if (req.params.estado) {
        filter = { estado: req.params.estado };
      }
      const citas = await cita.find(filter).populate('paciente', 'nombres apellidos').populate('horario');
      const events = citas.map(c => {
      const startDate = new Date(`${c.horario.fecha.toISOString().split('T')[0]}T${c.horario.horaInicio}`);
      const endDate = new Date(`${c.horario.fecha.toISOString().split('T')[0]}T${c.horario.horaFin}`);
      let color = ' ';
      if (c.estado === 'Pendiente') {
        color = "#0F2BF5";
      } else if (c.estado === 'Atendida') {
        color = "#16F50F";
      } else if (c.estado === 'Cancelada') {
        color = "#F5210F";
      }
      return {
        title: `${c.paciente.nombres} ${c.paciente.apellidos}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        pacienteId: c.paciente._id,
        citaId: c._id,
        status: c.estado,
        color: color
      };
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

citaCtrl.renderCitaId = async (req, res) => {
  try {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }else{
      const citaId = req.params.id;
      const cita1 = await cita.findById(citaId).populate('paciente', 'nombres apellidos').populate('horario');

      if (!cita1) {
        return res.status(404).send('Cita no encontrada');
      }

      // Convertir el formato de 24 horas a 12 horas
      const horaInicioFormateada = moment(cita1.horario.horaInicio, 'HH:mm').format('hh:mm A');
      const horaFinFormateada = moment(cita1.horario.horaFin, 'HH:mm').format('hh:mm A');

      // Formatear la fecha a "dd-mm-aaaa"
      const fechaFormateada = moment(cita1.horario.fecha).format('DD-MM-YYYY');
      // Supongamos que tienes una variable cita con el estado

       // Obtener la fecha y hora actuales
       const fechaActual = moment();
      
       // Verificar si la cita está en el pasado (ya ha pasado)
       const citaEnElPasado = moment(cita1.horario.fecha).isBefore(fechaActual) || moment().isSame(fechaActual, 'day') && moment(cita1.horario.horaFin, 'HH:mm').isBefore(moment());
       
       // Verificar si la cita está siendo atendida actualmente o ya fue atendida
       const disableCancelBtn = cita1.estado === 'Cancelada' || cita1.estado === 'Atendida'
       //verificar si la cita esta un su fecha y hora, si esta atendida o cancelada
      const disableatendlBtn = cita1.estado === 'Cancelada' || cita1.estado === 'Atendida'|| citaEnElPasado;
      // Renderizar la vista "Detalle" con la información de la cita y las horas formateadas
      res.render('citas/Detalle', { cita1, horaInicioFormateada, horaFinFormateada,fechaFormateada,disableCancelBtn,disableatendlBtn, isLoggedIn: req.isAuthenticated(), });
    }
  } catch (error) {
    console.error('Error al obtener la cita:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Controlador
citaCtrl.cambiarEstadoCita = async (req, res) => {
  try {
    const citaModificar = await cita.findById(req.params.id);

    if (!citaModificar) {
      req.flash('error_msg', 'Cita no encontrada');
      return res.redirect('/citas/listar');
    }

    citaModificar.estado = 'Cancelada';
    await citaModificar.save();

    req.flash('success_msg', 'Cita Cancelada');
    res.redirect('/citas/listar');
  } catch (error) {
    console.error('Error al cambiar el estado de la cita:', error);
    req.flash('error_msg', 'Error al cambiar el estado de la cita');
    res.redirect('/citas/listar');
  }
};

module.exports = citaCtrl;