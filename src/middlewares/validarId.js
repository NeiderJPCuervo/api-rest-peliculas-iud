const { esIdValido } = require('../helpers/utilidades');

const validarId = (req, res, next) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({ error: `El id "${req.params.id}" no es válido` });
  }
  next();
};

module.exports = validarId;
