// Valores permitidos para el campo "estado" de Género, Director y Productora
const ESTADOS = ['Activo', 'Inactivo'];

// Opciones comunes de los esquemas: fechas de creación/actualización automáticas
const OPCIONES_ESQUEMA = {
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
  versionKey: false,
};

// Comparación de nombres sin distinguir mayúsculas/minúsculas ("Drama" == "drama")
const COLLATION_ES = { locale: 'es', strength: 2 };

module.exports = { ESTADOS, OPCIONES_ESQUEMA, COLLATION_ES };
