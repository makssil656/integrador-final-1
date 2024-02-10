const mongoose = require('mongoose');

const MedicoSchema = new mongoose.Schema({
  nombres   : {
    type: String,
    required: true,
    trim: true,
  },
  apellidos: {
    type: String,
    required: true,
    trim: true,
  },
  DNI: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  especialidad: {
    type: String,
    required: true,
    trim: true,
  },
  informacionContacto: {
    direccion: String,
    telefono: String,
    email: String
  },
  direccion: String,
  telefono: String,
  email: String,
   
});

const Medico = mongoose.model('Medico',MedicoSchema);

module.exports = Medico;