require('dotenv').config({ quiet: true });
const app = require('./app');
const conectarDB = require('./config/db');

const PORT = process.env.PORT || 4000;

conectarDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('No fue posible conectar a la base de datos:', error.message);
    process.exit(1);
  });
