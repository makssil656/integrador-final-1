const mongoose = require('mongoose');

// URL de conexión a la base de datos (asegúrate de ajustarla según tus necesidades)
const mongoURI = 'mongodb+srv://Marco:5ecNpBdpsSMAzI82@cluster0.uzlpnuz.mongodb.net/?retryWrites=true&w=majority';

// Conexión a la base de datos
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
