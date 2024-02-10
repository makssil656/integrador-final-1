const  mongoose = require('mongoose')

// Define el esquema de cita
const citaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente'
  },
  horario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Horario'
  },
  motivo: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Atendida', 'Cancelada'],
    required: true,
  },
  
},{
    timestamps: true
});

// Define el modelo de cita
const Cita = mongoose.model('Cita', citaSchema);

module.exports = Cita;
