const Historia = require("../models/historia");
const historiaCtrl = {};
const paciente = require('../models/paciente')
const cita = require('../models/cita')

historiaCtrl.renderHistoriaForm = async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
  const pacienteId = req.params.id;
  // Buscar el paciente en la base de datos
  const citaId = req.params.id1;
  console.log(citaId)
  const pacienteInfo = await paciente.findById(pacienteId);
  const nombreCompleto = `${pacienteInfo.nombres} ${pacienteInfo.apellidos}`;
  console.log(pacienteId);
  res.render("historias/Agregar", { pacienteId,nombreCompleto, citaId, isLoggedIn: req.isAuthenticated(),});
  }
};

historiaCtrl.createHistoria = async (req, res) => {
  try {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }else{
      const {
        paciente1,
        cita1,
        fecha,
        antecedentesPersonales,
        antecedentesFamiliares,
        antecedentesQuirurgicos,
        anamnesis,
        examenFisico,
        diagnostico,
        tratamiento,
        procedimientos,
        proxControl,
        precioConsulta,
      } = req.body;
      console.log(paciente1)
      // Obtén la cita de la base de datos usando await
      const cita2 = await cita.findById(cita1);
      // Verifica si la cita2 existe y es válida
      if (!cita2) {
        return res.status(404).send('Cita no encontrada');
      }
      // Modifica el estado de la cita
      cita2.estado = 'Atendida';
      // Guarda la cita modificada en la base de datos
      await cita2.save();
      // Crea la nueva historia y guárdala en la base de datos
      const nuevaHistoria = new Historia({
        paciente: paciente1,
        fecha: fecha,
        antecedentes: {
          personales: antecedentesPersonales,
          familiares: antecedentesFamiliares,
          quirurgicos: antecedentesQuirurgicos,
        },
        anamnesis: anamnesis,
        examen_fisico: examenFisico,
        diagnostico: diagnostico,
        tratamiento: tratamiento,
        procedimientos: procedimientos,
        prox_control: proxControl,
        precio_consul: precioConsulta,
      });
      await nuevaHistoria.save();

      res.render("/historias/historias", {isLoggedIn: req.isAuthenticated(),});
    }
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).send('Error interno del servidor');
  }
};

historiaCtrl.renderHistorias = async (req, res) => {
  try {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }else{
      const pacienteId = req.params.id; // Obtener el ID del paciente desde los parámetros de la URL

      // Obtener todas las historias asociadas al paciente con el ID dado
      const historiasConDetalles = await Historia.find({ paciente: pacienteId });

      res.render('historias/Listar', {historiasConDetalles, isLoggedIn: req.isAuthenticated(), });
    }
  } catch (error) {
    console.error('Error al renderizar historias:', error);
    res.status(500).send('Error interno del servidor');
  }
};

historiaCtrl.renderEditHistoria = async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    const historiaEditar = await Historia.findById(req.params.id).populate('paciente');
    const nombreCompletoPaciente = `${historiaEditar.paciente.nombres} ${historiaEditar.paciente.apellidos}`;
    res.render('historias/editar',{historiaEditar, nombreCompletoPaciente,isLoggedIn: req.isAuthenticated()});
  }
}

historiaCtrl.updateHistoria = async (req, res) => {
  try {
    const { antecedentes, anamnesis, examen_fisico, diagnostico, tratamiento, procedimientos, prox_control, precio_consul } = req.body;

    // Actualizar la historia con los campos proporcionados
    await Historia.findByIdAndUpdate(req.params.id, {
      antecedentes,
      anamnesis,
      examen_fisico,
      diagnostico,
      tratamiento,
      procedimientos,
      prox_control,
      precio_consul
    });

    // Obtener la información actualizada de la historia
    const historiaActualizada = await Historia.findById(req.params.id).populate('paciente');

    req.flash('success_msg', `Historia Actualizada de Paciente`);
    res.redirect('/historias/listar',{isLoggedIn: req.isAuthenticated()});
  } catch (error) {
    console.error('Error al actualizar la historia:', error);
    req.flash('error_msg', 'Error al actualizar la historia');
    res.redirect('/historias/listar',{isLoggedIn: req.isAuthenticated()});
  }
};

historiaCtrl.deleteHistoria = async (req, res) => {
  await Historia.findByIdAndDelete(req.params.id)
  req.flash('success_msg','Historia Eliminado')
  res.redirect('/historias/listar')
}

historiaCtrl.renderHistorias1= async (req, res) => {

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    const pacientes = await paciente.find();
    res.render('historias/historias', { pacientes, isLoggedIn: req.isAuthenticated(),});
  }
}

module.exports = historiaCtrl;
