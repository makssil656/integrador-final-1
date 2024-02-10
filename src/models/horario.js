const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
  },
  horaInicio: {
    type: String, // Puedes ajustar el tipo de dato según tus necesidades
    required: true,
  },
  horaFin: {
    type: String, // Puedes ajustar el tipo de dato según tus necesidades
    required: true,
  },
  tiempo: {
    type: String, // Puedes ajustar el tipo de dato según tus necesidades
    required: true,
  },
  estado: {
    type: String,
    enum: ['Ocupado', 'Desocupado', 'Inhabilitado'], // Asegura que el estado sea 'O' (ocupado) o 'D' (desocupado)
    required: true,
  },
});

const Horario = mongoose.model('Horario', horarioSchema);

module.exports = Horario;