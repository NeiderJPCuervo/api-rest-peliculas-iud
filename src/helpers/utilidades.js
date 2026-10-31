const HttpError = require('./HttpError');
const { ESTADOS } = require('./constantes');

const esIdValido = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

// Toma del body solo los campos permitidos (evita que se envíen _id, fechas, etc.)
const seleccionarCampos = (body = {}, campos) =>
  Object.fromEntries(campos.filter((campo) => body[campo] !== undefined).map((campo) => [campo, body[campo]]));

// Filtro opcional ?estado=Activo|Inactivo para los listados
const filtroEstado = (query) => {
  if (query.estado === undefined) return {};
  if (!ESTADOS.includes(query.estado)) {
    throw new HttpError(400, 'El filtro estado debe ser Activo o Inactivo');
  }
  return { estado: query.estado };
};

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { esIdValido, seleccionarCampos, filtroEstado, escaparRegex };
