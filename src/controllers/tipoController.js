const Tipo = require('../models/Tipo');
const Media = require('../models/Media');
const HttpError = require('../helpers/HttpError');
const { seleccionarCampos } = require('../helpers/utilidades');

const CAMPOS = ['nombre', 'descripcion'];

const buscarTipo = async (id) => {
  const tipo = await Tipo.findById(id);
  if (!tipo) throw new HttpError(404, 'Tipo no encontrado');
  return tipo;
};

// GET /api/tipos
const listarTipos = async (req, res) => {
  const tipos = await Tipo.find().sort({ nombre: 1 });
  res.json(tipos);
};

// GET /api/tipos/:id
const obtenerTipo = async (req, res) => {
  res.json(await buscarTipo(req.params.id));
};

// POST /api/tipos
const crearTipo = async (req, res) => {
  const tipo = await Tipo.create(seleccionarCampos(req.body, CAMPOS));
  res.status(201).json(tipo);
};

// PUT /api/tipos/:id
const actualizarTipo = async (req, res) => {
  const tipo = await buscarTipo(req.params.id);
  tipo.set(seleccionarCampos(req.body, CAMPOS));
  await tipo.save();
  res.json(tipo);
};

// DELETE /api/tipos/:id
const eliminarTipo = async (req, res) => {
  const tipo = await buscarTipo(req.params.id);
  if (await Media.exists({ tipo: tipo._id })) {
    throw new HttpError(409, 'No se puede eliminar: el tipo está asignado a una o más producciones');
  }
  await tipo.deleteOne();
  res.json({ mensaje: 'Tipo eliminado', tipo });
};

module.exports = { listarTipos, obtenerTipo, crearTipo, actualizarTipo, eliminarTipo };
