const horario = require('../models/horario')
const horarioCtrl = {}
const moment = require('moment');

horarioCtrl.renderHorarioForm = (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    res.render('horarios/Agregar',{isLoggedIn: req.isAuthenticated(),});
  }
}

horarioCtrl.createHorario = async (req, res) => {
  try {
    // Recibe los horarios del cuerpo de la solicitud
    const horarios = req.body;

    // Validate if the dates already have schedules
    const existingDates = await horario.find({ fecha: { $in: horarios.map(h => h.fecha) } });
    console.log(existingDates)
    if (existingDates.length > 0) {
      // If there are existing dates, return an error response
      return res.status(400).json({ message: 'La Fecha tiene horario asignado' });
    }

    // Insert the schedules into the database
    const resultados = await horario.insertMany(horarios);
    res.status(201).json({ message: 'Horarios registrados con éxito', data: resultados });
  } catch (error) {
    console.error('Error al registrar horarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


//renderiza la lista de horarios
horarioCtrl.renderHorario = async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
  res.render('horarios/Lista',{isLoggedIn: req.isAuthenticated(),});
  }
}

//busca los horarios de una fecha
horarioCtrl.horarioFecha= async(req,res)=>{
  const fecha = req.query.fecha;
  try {
    // Buscar los horarios en la base de datos
    const horarios = await horario.find({ fecha: fecha });
    const horariosFormateados = horarios.map(horario => ({
      ...horario._doc,
      horaInicio: moment(horario.horaInicio, 'HH:mm').format('hh:mm A'),
      horaFin: moment(horario.horaFin, 'HH:mm').format('hh:mm A')
    }));

    res.json(horariosFormateados);
  } catch (error) {
    console.error('Error al obtener horarios desde la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener horarios desde la base de datos' });
  }
}

//busca los horarios de una fecha desocupados
horarioCtrl.horarioFechaDes= async(req,res)=>{
  const fecha = req.query.fecha;
  console.log(fecha)
  try {
    // Buscar los horarios en la base de datos
    const horarios = await horario.find({
      fecha: fecha,estado: 'Desocupado'});
    // Convertir el formato de 24 horas a 12 horas
    const horariosFormateados = horarios.map(horario => ({
      ...horario._doc,
      horaInicio: moment(horario.horaInicio, 'HH:mm').format('hh:mm A'),
      horaFin: moment(horario.horaFin, 'HH:mm').format('hh:mm A')
    }));

    res.json(horariosFormateados);
  } catch (error) {
    console.error('Error al obtener horarios desde la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener horarios desde la base de datos' });
  }
}

//cambia el estado de un horario
horarioCtrl.updateHorario = async (req, res) => {
  const id = req.body.id;
  const estadoActual = req.body.estadoActual;

  try {
    // Buscar el horario en la base de datos por el ID
    const horario1 = await horario.findById(id);

    if (!horario1) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    // Cambiar el estado
    horario1.estado = (estadoActual === 'Desocupado') ? 'Inhabilitado' : 'Desocupado';

    // Guardar los cambios en la base de datos
    await horario1.save();

    // Responder con el nuevo estado
    res.json({ nuevoEstado: horario1.estado, fecha: horario1.fecha });
  } catch (error) {
    console.error('Error al cambiar el estado en la base de datos:', error);
    res.status(500).json({ error: 'Error al cambiar el estado en la base de datos' });
  }
}

//elimar horario segun la fecha
horarioCtrl.deleteHorario = async (req, res) => {
  const fecha = req.query.fecha;

  try {
    // Verificar si hay horarios ocupados para la fecha proporcionada
    const horariosOcupados = await horario.find({ fecha: fecha, estado: 'Ocupado' });

    if (horariosOcupados.length > 0) {
      return res.status(400).json({ error: 'No se pueden eliminar los horarios. Hay horarios ocupados para la fecha proporcionada.' });
    }

    // Eliminar los horarios de la base de datos para la fecha proporcionada
    const resultado = await horario.deleteMany({ fecha: fecha });

    res.json({ message: `Se eliminaron ${resultado.deletedCount} horarios para la fecha ${fecha}` });
  } catch (error) {
    console.error('Error al limpiar horarios:', error);
    res.status(500).json({ error: 'Error interno del servidor al limpiar horarios' });
  }
};

module.exports = horarioCtrl;