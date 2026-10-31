const { Schema, model } = require('mongoose');
const { OPCIONES_ESQUEMA, COLLATION_ES } = require('../helpers/constantes');

const TipoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del tipo es obligatorio'],
      trim: true,
    },
    descripcion: { type: String, trim: true, default: '' },
  },
  OPCIONES_ESQUEMA
);

TipoSchema.index({ nombre: 1 }, { unique: true, collation: COLLATION_ES });

module.exports = model('Tipo', TipoSchema);
