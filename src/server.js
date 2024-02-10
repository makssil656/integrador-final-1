const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const morgan = require('morgan')
const methodOverride = require('method-override')
const moment = require('moment-timezone');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('./models/usuario');
const helmet = require('helmet');

const bodyParser = require('body-parser');
require('./database.js')
//Inicializaciones

const app = express();

//Settings
app.set("port", process.env.PORT || 3000);
app.set('views', path.join(__dirname, "views"));
app.engine('.hbs', exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
      moment: function (date, format) {
        return moment.utc(date).format(format);
      }
    },
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");


//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // Configuración específica de tu entorno
    maxAge: 3600000, // Tiempo de vida de la cookie en milisegundos (aquí, 1 hora)
    httpOnly: true,
  },
}));

app.use(flash());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


// Configuración de Passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const usuario = await Usuario.findOne({ username: username, password: password }).exec();

      if (!usuario) {
        return done(null, false, { message: 'Credenciales incorrectas' });
      }

      return done(null, usuario);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


  
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findById(id).exec();
    if (!usuario) {
      return done(null, false); // Usuario no encontrado
    }
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

// Middleware de seguridad



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Global variables
app.use((req,res,next)=>{
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg')
  next()
})

//Routes
app.use(require('./routes/login.routes'));
app.use(require('./routes/inicio.routes'));
app.use(require('./routes/pacientes.routes'));
app.use(require('./routes/citas.routes'));
app.use(require('./routes/historias.routes'));
app.use(require('./routes/horarios.routes'));
app.use(require('./routes/configuracion.routes'));

//Static files
app.use(express.static(path.join(__dirname, "public")));



module.exports = app;
