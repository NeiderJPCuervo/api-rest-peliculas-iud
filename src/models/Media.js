const { Schema, model } = require('mongoose');
const { OPCIONES_ESQUEMA } = require('../helpers/constantes');

const URL_VALIDA = /^https?:\/\/\S+$/i;
const ANIO_MINIMO = 1888; // primera película registrada

const MediaSchema = new Schema(
  {
    serial: {
      type: String,
      required: [true, 'El serial es obligatorio'],
      unique: true,
      trim: true,
    },
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    sinopsis: { type: String, trim: true, default: '' },
    url: {
      type: String,
      required: [true, 'La URL de la película es obligatoria'],
      unique: true,
      trim: true,
      match: [URL_VALIDA, 'La URL de la película no es válida'],
    },
    imagen: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (valor) => valor === '' || URL_VALIDA.test(valor),
        message: 'La URL de la imagen de portada no es válida',
      },
    },
    anioEstreno: {
      type: Number,
      required: [true, 'El año de estreno es obligatorio'],
      min: [ANIO_MINIMO, `El año de estreno no puede ser menor a ${ANIO_MINIMO}`],
      max: [new Date().getFullYear() + 5, 'El año de estreno no es válido'],
      validate: { validator: Number.isInteger, message: 'El año de estreno debe ser un número entero' },
    },
    genero: {
      type: Schema.Types.ObjectId,
      ref: 'Genero',
      required: [true, 'El género principal es obligatorio'],
    },
    director: {
      type: Schema.Types.ObjectId,
      ref: 'Director',
      required: [true, 'El director principal es obligatorio'],
    },
    productora: {
      type: Schema.Types.ObjectId,
      ref: 'Productora',
      required: [true, 'La productora es obligatoria'],
    },
    tipo: {
      type: Schema.Types.ObjectId,
      ref: 'Tipo',
      required: [true, 'El tipo es obligatorio'],
    },
  },
  OPCIONES_ESQUEMA
);

module.exports = model('Media', MediaSchema, 'medias');
