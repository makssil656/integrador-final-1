const paciente = require('../models/paciente')
const moment = require('moment-timezone');
const pacienteCtrl = {}


pacienteCtrl.renderPacienteForm = (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    res.render('pacientes/Agregar',{isLoggedIn: req.isAuthenticated(),});
  }
}

const validarDNI = (dni) => {
  const exRegularDNI = /^\d{8}(?:[-\s]\d{4})?$/;

  if (exRegularDNI.test(dni)) {
      return true;  // DNI válido
  } else {
      return false;  // DNI no válido
  }
};

function validarNumeroTelefonoPeruano(numero) {
  // Expresión regular para validar números de teléfono peruanos
  const regex = /^9\d{8}$/;

  // Verificar si el número cumple con el patrón
  return regex.test(numero);
}


const calcularEdad = (fechaNacimiento) => {
  const fechaActual = moment();
  const fechaNacimientoMoment = moment(fechaNacimiento, 'YYYY-MM-DD', true);

  if (
      fechaNacimientoMoment.isValid() &&
      fechaNacimientoMoment.isSameOrBefore(fechaActual, 'day') &&
      fechaNacimientoMoment.isSameOrAfter('1920-01-01', 'day') &&
      fechaNacimientoMoment.isSameOrBefore('2023-12-31', 'day')
  ) {
      return fechaActual.diff(fechaNacimientoMoment, 'years');
  }

  return null; // Retorna null si la fecha de nacimiento no es válida
};


pacienteCtrl.createPaciente = async (req, res) => {
  const { apellidos, nombres, DNI, Sexo, orientacion_sex, Celular, Fecha_naci, Direccion } = req.body;

  // Validar formato del DNI
  if (!validarDNI(DNI)) {
      const errorMessage = 'El formato del DNI no es válido';
      return res.render('pacientes/Agregar', {
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  }

  // Validar rango de fechas de nacimiento
  const fechaNacimientoMoment = moment(Fecha_naci, 'YYYY-MM-DD', true);
  if (!fechaNacimientoMoment.isValid() || fechaNacimientoMoment.isBefore('1920-01-01') || fechaNacimientoMoment.isAfter('2023-12-31')) {
      const errorMessage = 'La fecha de nacimiento no es válida';
      return res.render('pacientes/Agregar', {
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  }

  // Verificar si el DNI ya está registrado
  const pacienteExistente = await paciente.findOne({ DNI });
  const numeroTelefonoRegistrado = await paciente.findOne({ Celular });

  if (pacienteExistente) {
      const errorMessage = 'Este DNI ya está registrado';
      return res.render('pacientes/Agregar', {
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  } else if (numeroTelefonoRegistrado) {
      const errorMessage = 'Este número de teléfono ya está registrado a nombre de otro paciente';
      return res.render('pacientes/Agregar', {
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  } else if(!validarNumeroTelefonoPeruano(Celular)){
      const errorMessage = 'Este número de teléfono no es válido';
      return res.render('pacientes/Agregar', {
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  } else{
      // Calcular la edad basada en la fecha de nacimiento
      const edad = calcularEdad(Fecha_naci);

      if (edad === null) {
          const errorMessage = 'La fecha de nacimiento no es válida';
          return res.render('pacientes/Agregar', {
              isLoggedIn: req.isAuthenticated(),
              error_msg: errorMessage,
          });
      } else {
          // Si todo está correcto, guardar la información en la base de datos
          const new_paciente = new paciente({
              apellidos,
              nombres,
              DNI,
              Edad: edad,
              Sexo,
              orientacion_sex,
              Celular,
              Fecha_naci,
              Direccion,
          });

          await new_paciente.save();
          req.flash('success_msg', 'Paciente Agregado');
          return res.redirect('/pacientes/listar');
      }
  }
};

pacienteCtrl.renderPaciente = async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    const pacientes = await paciente.find();
    res.render('pacientes/Lista', { pacientes, isLoggedIn: req.isAuthenticated(),});
  }
}

pacienteCtrl.renderEditPaciente = async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    const pacienteEditar = await paciente.findById(req.params.id)
    res.render('pacientes/editar',{pacienteEditar, isLoggedIn: req.isAuthenticated(),});
  }
}

pacienteCtrl.updatePaciente = async (req, res) => {
  const { apellidos, nombres, DNI, Sexo, orientacion_sex, Celular, Fecha_naci, Direccion } = req.body;

  // Validar formato del DNI
  if (!validarDNI(DNI)) {
      const errorMessage = 'El formato del DNI no es válido';
      return res.render('pacientes/editar', {
          pacienteEditar: { _id: req.params.id, apellidos, nombres, DNI, Sexo, orientacion_sex, Celular, Fecha_naci, Direccion },
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  }

  // Validar rango de fechas de nacimiento
  const fechaNacimientoMoment = moment(Fecha_naci, 'YYYY-MM-DD', true);
  if (!fechaNacimientoMoment.isValid() || fechaNacimientoMoment.isBefore('1920-01-01') || fechaNacimientoMoment.isAfter('2023-12-31')) {
      const errorMessage = 'La fecha de nacimiento no es válida';
      return res.render('pacientes/editar', {
          pacienteEditar: { _id: req.params.id, apellidos, nombres, DNI, Sexo, orientacion_sex, Celular, Fecha_naci, Direccion },
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  }

  // Verificar si el DNI ya está registrado para otro paciente
  const pacienteExistente = await paciente.findOne({ DNI, _id: { $ne: req.params.id } });
  if (pacienteExistente) {
      const errorMessage = 'Este DNI ya está registrado para otro paciente';
      return res.render('pacientes/editar', {
          pacienteEditar: { _id: req.params.id, apellidos, nombres, DNI, Sexo, orientacion_sex, Celular, Fecha_naci, Direccion },
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  } else if (!validarNumeroTelefonoPeruano(Celular)) {
      const errorMessage = 'Este número de teléfono no es válido';
      return res.render('pacientes/editar', {
          pacienteEditar: { _id: req.params.id, apellidos, nombres, DNI, Sexo, orientacion_sex, Celular, Fecha_naci, Direccion },
          isLoggedIn: req.isAuthenticated(),
          error_msg: errorMessage,
      });
  } else {
      // Calcular la edad basada en la fecha de nacimiento
      const edad = calcularEdad(Fecha_naci);

      if (edad === null) {
          const errorMessage = 'La fecha de nacimiento no es válida';
          return res.render('pacientes/editar', {
              pacienteEditar: { _id: req.params.id, apellidos, nombres, DNI, Sexo, orientacion_sex, Celular, Fecha_naci, Direccion },
              isLoggedIn: req.isAuthenticated(),
              error_msg: errorMessage,
          });
      } else {
          // Si todo está correcto, actualizar la información en la base de datos
          await paciente.findByIdAndUpdate(req.params.id, {
              apellidos,
              nombres,
              DNI,
              Edad: edad,
              Sexo,
              orientacion_sex,
              Celular,
              Fecha_naci,
              Direccion,
          });

          req.flash('success_msg', 'Paciente Actualizado: ' + apellidos + ' ' + nombres);
          return res.redirect('/pacientes/listar');
      }
  }
};


pacienteCtrl.deletePaciente = async (req, res) => {
    await paciente.findByIdAndDelete(req.params.id)
    req.flash('success_msg','Paciente Eliminado')
    res.redirect('/pacientes/listar')
}

pacienteCtrl.pacienteDNI = async (req, res) => {
    const dni = req.params.dni;
    try {
      // Buscar al paciente por DNI en la base de datos
      const paciente1 = await paciente.findOne({ DNI: dni });
  
      if (paciente1) {
        // Enviar datos del paciente como respuesta
        res.json({
          nombres: paciente1.nombres,
          apellidos: paciente1.apellidos,
          Sexo: paciente1.Sexo,
          Edad: paciente1.Edad,
          _id:paciente1._id
        });
      } else {
        // Enviar una respuesta indicando que el paciente no fue encontrado
        res.status(404).json({ mensaje: 'Paciente no encontrado' });
      }
    } catch (error) {
      // Enviar una respuesta en caso de error
      console.error('Error al obtener datos del paciente:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };


module.exports = pacienteCtrl;