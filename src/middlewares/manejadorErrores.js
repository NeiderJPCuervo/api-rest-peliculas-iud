const HttpError = require('../helpers/HttpError');

const noEncontrado = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Convierte los errores de Express/Mongoose en respuestas JSON con el código HTTP adecuado
// eslint-disable-next-line no-unused-vars
const manejadorErrores = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err.name === 'ValidationError') {
    const detalles = Object.values(err.errors).map((e) =>
      e.name === 'CastError' ? `El campo ${e.path} tiene un valor inválido` : e.message
    );
    return res.status(400).json({ error: 'Datos inválidos', detalles });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: `El campo ${err.path} tiene un valor inválido` });
  }

  if (err.code === 11000) {
    const [campo, valor] = Object.entries(err.keyValue || {})[0] || ['campo', ''];
    return res.status(409).json({ error: `Ya existe un registro con ${campo} "${valor}"` });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = { noEncontrado, manejadorErrores };
