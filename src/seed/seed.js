// Carga los datos iniciales definidos en el caso de estudio. Se puede ejecutar varias veces.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const conectarDB = require('../config/db');
const Genero = require('../models/Genero');
const Tipo = require('../models/Tipo');
const Productora = require('../models/Productora');
const { COLLATION_ES } = require('../helpers/constantes');

const GENEROS = [
  { nombre: 'Acción', descripcion: 'Películas con escenas de alta intensidad, peleas y persecuciones' },
  { nombre: 'Aventura', descripcion: 'Historias de viajes, exploración y búsqueda' },
  { nombre: 'Ciencia ficción', descripcion: 'Historias basadas en avances científicos o tecnológicos imaginarios' },
  { nombre: 'Drama', descripcion: 'Historias centradas en conflictos emocionales de los personajes' },
  { nombre: 'Terror', descripcion: 'Producciones que buscan provocar miedo o suspenso' },
];

const TIPOS = [
  { nombre: 'Película', descripcion: 'Producción audiovisual de una sola entrega' },
  { nombre: 'Serie', descripcion: 'Producción audiovisual dividida en temporadas y episodios' },
];

const PRODUCTORAS = [
  { nombre: 'Disney', slogan: 'The Happiest Place on Earth', descripcion: 'The Walt Disney Company' },
  { nombre: 'Warner Bros.', slogan: 'The Stuff That Dreams Are Made Of', descripcion: 'Warner Bros. Entertainment' },
  { nombre: 'Paramount', slogan: 'A Viacom Company', descripcion: 'Paramount Pictures' },
  { nombre: 'MGM', slogan: 'Ars Gratia Artis', descripcion: 'Metro-Goldwyn-Mayer' },
];

const insertarSiNoExiste = async (Modelo, registros) => {
  for (const registro of registros) {
    await Modelo.updateOne({ nombre: registro.nombre }, { $setOnInsert: registro }, { upsert: true, collation: COLLATION_ES });
  }
  console.log(`${Modelo.modelName}: ${await Modelo.countDocuments()} registros`);
};

const ejecutar = async () => {
  await conectarDB(process.env.MONGO_URI);
  await Promise.all([Genero.init(), Tipo.init(), Productora.init()]);
  await insertarSiNoExiste(Genero, GENEROS);
  await insertarSiNoExiste(Tipo, TIPOS);
  await insertarSiNoExiste(Productora, PRODUCTORAS);
};

ejecutar()
  .catch((error) => {
    console.error('Error en el seed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
