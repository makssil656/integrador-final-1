const {Schema, model} = require('mongoose')

// Define el esquema de paciente
const pacienteSchema = new Schema({
  apellidos: {
    type: String,
    required: true,
    trim: true,
  },
  nombres: {
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
  Sexo: {
    type: String,
    required: true,
    enum: ['Masculino', 'Femenino'],
  },
  Fecha_naci: {
    type: Date,
    required: true,
  },
  Edad: {
    type: Number,
    required: true,
  },
  Celular: {
    type: String,
    required: true,
    trim: true,
  },
  Direccion: {
    type: String,
    trim: true,
  },
  orientacion_sex: {
    type: String,
    trim: true,
  },
},{
    timestamps: true
});

// Define el modelo de paciente
const Paciente = model('Paciente', pacienteSchema);

module.exports = Paciente;
