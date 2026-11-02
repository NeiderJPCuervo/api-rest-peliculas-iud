require('dotenv').config({ quiet: true });
const app = require('./app');
const conectarDB = require('./config/db');

const PORT = process.env.PORT || 4000;

conectarDB(process.env.MONGO_URI)
  .then(() => {
    // Express 5 entrega al callback el error de arranque (por ejemplo, puerto ocupado)
    app.listen(PORT, (error) => {
      if (error) {
        console.error(error.code === 'EADDRINUSE'
          ? `El puerto ${PORT} ya está en uso: cierre el otro servidor o cambie PORT en .env`
          : `No fue posible iniciar el servidor: ${error.message}`);
        process.exit(1);
      }
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No fue posible conectar a la base de datos:', error.message);
    process.exit(1);
  });
