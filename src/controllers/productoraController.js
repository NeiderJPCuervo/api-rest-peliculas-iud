const Productora = require('../models/Productora');
const Media = require('../models/Media');
const HttpError = require('../helpers/HttpError');
const { seleccionarCampos, filtroEstado } = require('../helpers/utilidades');

const CAMPOS = ['nombre', 'estado', 'slogan', 'descripcion'];

const buscarProductora = async (id) => {
  const productora = await Productora.findById(id);
  if (!productora) throw new HttpError(404, 'Productora no encontrada');
  return productora;
};

// GET /api/productoras?estado=Activo
const listarProductoras = async (req, res) => {
  const productoras = await Productora.find(filtroEstado(req.query)).sort({ nombre: 1 });
  res.json(productoras);
};

// GET /api/productoras/:id
const obtenerProductora = async (req, res) => {
  res.json(await buscarProductora(req.params.id));
};

// POST /api/productoras
const crearProductora = async (req, res) => {
  const productora = await Productora.create(seleccionarCampos(req.body, CAMPOS));
  res.status(201).json(productora);
};

// PUT /api/productoras/:id
const actualizarProductora = async (req, res) => {
  const productora = await buscarProductora(req.params.id);
  productora.set(seleccionarCampos(req.body, CAMPOS));
  await productora.save();
  res.json(productora);
};

// DELETE /api/productoras/:id
const eliminarProductora = async (req, res) => {
  const productora = await buscarProductora(req.params.id);
  if (await Media.exists({ productora: productora._id })) {
    throw new HttpError(409, 'No se puede eliminar: la productora está asignada a una o más producciones. Puede cambiar su estado a Inactivo');
  }
  await productora.deleteOne();
  res.json({ mensaje: 'Productora eliminada', productora });
};

module.exports = { listarProductoras, obtenerProductora, crearProductora, actualizarProductora, eliminarProductora };
