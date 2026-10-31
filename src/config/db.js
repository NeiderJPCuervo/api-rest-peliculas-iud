const mongoose = require('mongoose');

const conectarDB = async (uri) => {
  if (!uri) throw new Error('Falta la variable de entorno MONGO_URI (ver .env.example)');
  await mongoose.connect(uri);
  console.log(`MongoDB conectado: ${mongoose.connection.host}/${mongoose.connection.name}`);
};

module.exports = conectarDB;
