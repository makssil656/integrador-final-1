const mongoose = require('mongoose');

const HistoriaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente'
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  antecedentes: {
    personales: String,
    familiares: String,
    quirurgicos: String
  },
  anemnesis: String,
  examen_fisico: String,
  diagnostico: String,
  tratamiento: String,
  procedimientos: String,
  prox_control:{
    type: Date,
  },
  precio_consul:{
    type: Number
  }
  
});

const Historia = mongoose.model('Consulta',HistoriaSchema);

module.exports = Historia;