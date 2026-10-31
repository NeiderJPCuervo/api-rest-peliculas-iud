const { Schema, model } = require('mongoose');
const { ESTADOS, OPCIONES_ESQUEMA } = require('../helpers/constantes');

const DirectorSchema = new Schema(
  {
    nombres: {
      type: String,
      required: [true, 'Los nombres del director son obligatorios'],
      trim: true,
    },
    estado: {
      type: String,
      enum: { values: ESTADOS, message: 'El estado debe ser Activo o Inactivo' },
      default: 'Activo',
    },
  },
  OPCIONES_ESQUEMA
);

module.exports = model('Director', DirectorSchema, 'directores');
