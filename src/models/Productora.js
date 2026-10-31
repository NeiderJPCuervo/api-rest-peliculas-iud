const { Schema, model } = require('mongoose');
const { ESTADOS, OPCIONES_ESQUEMA, COLLATION_ES } = require('../helpers/constantes');

const ProductoraSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la productora es obligatorio'],
      trim: true,
    },
    estado: {
      type: String,
      enum: { values: ESTADOS, message: 'El estado debe ser Activo o Inactivo' },
      default: 'Activo',
    },
    slogan: { type: String, trim: true, default: '' },
    descripcion: { type: String, trim: true, default: '' },
  },
  OPCIONES_ESQUEMA
);

ProductoraSchema.index({ nombre: 1 }, { unique: true, collation: COLLATION_ES });

module.exports = model('Productora', ProductoraSchema, 'productoras');
