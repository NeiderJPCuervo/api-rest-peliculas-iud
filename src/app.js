const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const generoRoutes = require('./routes/generoRoutes');
const directorRoutes = require('./routes/directorRoutes');
const productoraRoutes = require('./routes/productoraRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const { noEncontrado, manejadorErrores } = require('./middlewares/manejadorErrores');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    nombre: 'API REST Películas y Series - IU Digital de Antioquia',
    endpoints: ['/api/generos', '/api/directores', '/api/productoras', '/api/tipos', '/api/medias'],
  });
});

app.use('/api/generos', generoRoutes);
app.use('/api/directores', directorRoutes);
app.use('/api/productoras', productoraRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/medias', mediaRoutes);

app.use(noEncontrado);
app.use(manejadorErrores);

module.exports = app;
