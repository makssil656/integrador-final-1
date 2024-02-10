const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya duplicados en la base de datos
        lowercase: true, // Convierte el correo electrónico a minúsculas antes de almacenarlo
        trim: true, // Elimina espacios en blanco al principio y al final del correo electrónico
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Por favor, introduce una dirección de correo electrónico válida.']
    },
}, {
    timestamps: true
});

const Usuario = model('Usuario', usuarioSchema);

module.exports = Usuario;
