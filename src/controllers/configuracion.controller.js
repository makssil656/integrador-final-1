const usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const configuracionCtrl = {};

configuracionCtrl.renderCuenta = async (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    } else {
        // Accede a los datos del usuario activo utilizando req.user
        const userData = req.user;

        res.render('configuracion/cuenta', {
            user: userData,
            isLoggedIn: req.isAuthenticated(),
        });
    }
}

configuracionCtrl.cambiarContrasena = async (req, res) => {
    const { password, newPassword, confirmNewPassword } = req.body;
    const userId = req.user._id; // Suponiendo que el ID del usuario está disponible en req.user

    try {
        // Validar que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmNewPassword) {
            req.flash('error_msg', 'La nueva contraseña y la confirmación no coinciden');
            return res.redirect('/cuenta');
        }

        // Obtener el usuario de la base de datos
        const user = await usuario.findById(userId);
        if (!user) {
            req.flash('error_msg', 'Usuario no encontrado');
            return res.redirect('/cuenta');
        }

        // Verificar que la contraseña actual sea correcta
        // Verificar que la contraseña actual sea correcta (solo para depuración)
        if (password !== user.password) {
            req.flash('error_msg', 'Contraseña actual incorrecta');
            return res.redirect('/cuenta');
        }


        // Actualizar la contraseña en la base de datos
        await usuario.findByIdAndUpdate(userId, { password: newPassword });

        req.flash('success_msg', 'Contraseña cambiada con éxito');
        res.redirect('/cuenta'); // Redirigir a la página de configuración de cuenta o mostrar un mensaje de éxito
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cambiar la contraseña');
    }
}

configuracionCtrl.renderAyuda = async (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    } else {
        const userData = req.user;

        res.render('configuracion/ayuda', {
            user: userData,
            isLoggedIn: req.isAuthenticated(),
        });
    }
}

module.exports = configuracionCtrl;
