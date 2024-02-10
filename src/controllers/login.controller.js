const passport = require('passport');

const loginCtrl = {};

loginCtrl.mostrarFormularioLogin = (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login');
};

loginCtrl.iniciarSesion = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
});

loginCtrl.rememberMe = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      return next(err); 
    }

    if (!user) {
      res.locals.errorMessage = 'Nombre de usuario o contraseña incorrectos';
      return res.render('login');  // Renderiza la vista directamente
    }

    if (req.body.flexCheckDefault === "true") {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
    } else {
      req.session.cookie.expires = false;
    }

    req.logIn(user, (err) => {
      if (err) { 
        return next(err); 
      }

      return res.redirect('/');
    });
  })(req, res, next);
};

loginCtrl.authenticateLoginInLogin = (req, res, next) => {
  req.logIn(user, (err) => {
    if (err) { 
      return next(err); 
    }

    return res.redirect('/');
  });
};

loginCtrl.mostrarDashboard = (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }else{
    res.render('index', {
      user: req.user,
      isLoggedIn: req.isAuthenticated(),
    });
  }
};


loginCtrl.requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

// Ruta para cerrar sesión
loginCtrl.logout = (req, res) => {
  req.logout((err) => { // Agrega una función de devolución de llamada aquí
    if (err) {
      console.error(err);
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect('/login');
    });
  });
};


module.exports = loginCtrl;
