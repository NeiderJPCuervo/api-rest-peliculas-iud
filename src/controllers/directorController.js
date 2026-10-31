const Director = require('../models/Director');
const Media = require('../models/Media');
const HttpError = require('../helpers/HttpError');
const { seleccionarCampos, filtroEstado } = require('../helpers/utilidades');

const CAMPOS = ['nombres', 'estado'];

const buscarDirector = async (id) => {
  const director = await Director.findById(id);
  if (!director) throw new HttpError(404, 'Director no encontrado');
  return director;
};

// GET /api/directores?estado=Activo
const listarDirectores = async (req, res) => {
  const directores = await Director.find(filtroEstado(req.query)).sort({ nombres: 1 });
  res.json(directores);
};

// GET /api/directores/:id
const obtenerDirector = async (req, res) => {
  res.json(await buscarDirector(req.params.id));
};

// POST /api/directores
const crearDirector = async (req, res) => {
  const director = await Director.create(seleccionarCampos(req.body, CAMPOS));
  res.status(201).json(director);
};

// PUT /api/directores/:id
const actualizarDirector = async (req, res) => {
  const director = await buscarDirector(req.params.id);
  director.set(seleccionarCampos(req.body, CAMPOS));
  await director.save();
  res.json(director);
};

// DELETE /api/directores/:id
const eliminarDirector = async (req, res) => {
  const director = await buscarDirector(req.params.id);
  if (await Media.exists({ director: director._id })) {
    throw new HttpError(409, 'No se puede eliminar: el director está asignado a una o más producciones. Puede cambiar su estado a Inactivo');
  }
  await director.deleteOne();
  res.json({ mensaje: 'Director eliminado', director });
};

module.exports = { listarDirectores, obtenerDirector, crearDirector, actualizarDirector, eliminarDirector };
