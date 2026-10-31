const { Schema, model } = require('mongoose');
const { ESTADOS, OPCIONES_ESQUEMA, COLLATION_ES } = require('../helpers/constantes');

const GeneroSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del género es obligatorio'],
      trim: true,
    },
    estado: {
      type: String,
      enum: { values: ESTADOS, message: 'El estado debe ser Activo o Inactivo' },
      default: 'Activo',
    },
    descripcion: { type: String, trim: true, default: '' },
  },
  OPCIONES_ESQUEMA
);

GeneroSchema.index({ nombre: 1 }, { unique: true, collation: COLLATION_ES });

module.exports = model('Genero', GeneroSchema);
