const Genero = require('../models/Genero');
const Media = require('../models/Media');
const HttpError = require('../helpers/HttpError');
const { seleccionarCampos, filtroEstado } = require('../helpers/utilidades');

const CAMPOS = ['nombre', 'estado', 'descripcion'];

const buscarGenero = async (id) => {
  const genero = await Genero.findById(id);
  if (!genero) throw new HttpError(404, 'Género no encontrado');
  return genero;
};

// GET /api/generos?estado=Activo
const listarGeneros = async (req, res) => {
  const generos = await Genero.find(filtroEstado(req.query)).sort({ nombre: 1 });
  res.json(generos);
};

// GET /api/generos/:id
const obtenerGenero = async (req, res) => {
  res.json(await buscarGenero(req.params.id));
};

// POST /api/generos
const crearGenero = async (req, res) => {
  const genero = await Genero.create(seleccionarCampos(req.body, CAMPOS));
  res.status(201).json(genero);
};

// PUT /api/generos/:id
const actualizarGenero = async (req, res) => {
  const genero = await buscarGenero(req.params.id);
  genero.set(seleccionarCampos(req.body, CAMPOS));
  await genero.save();
  res.json(genero);
};

// DELETE /api/generos/:id
const eliminarGenero = async (req, res) => {
  const genero = await buscarGenero(req.params.id);
  if (await Media.exists({ genero: genero._id })) {
    throw new HttpError(409, 'No se puede eliminar: el género está asignado a una o más producciones. Puede cambiar su estado a Inactivo');
  }
  await genero.deleteOne();
  res.json({ mensaje: 'Género eliminado', genero });
};

module.exports = { listarGeneros, obtenerGenero, crearGenero, actualizarGenero, eliminarGenero };
