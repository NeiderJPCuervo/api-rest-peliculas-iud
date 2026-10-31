const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const HttpError = require('../helpers/HttpError');
const { esIdValido, seleccionarCampos, escaparRegex } = require('../helpers/utilidades');

const CAMPOS = [
  'serial', 'titulo', 'sinopsis', 'url', 'imagen', 'anioEstreno',
  'genero', 'director', 'productora', 'tipo',
];

const POBLAR = [
  { path: 'genero', select: 'nombre estado' },
  { path: 'director', select: 'nombres estado' },
  { path: 'productora', select: 'nombre estado' },
  { path: 'tipo', select: 'nombre' },
];

// Referencias de Media y sus reglas: género, director y productora deben estar activos
const REFERENCIAS = {
  genero: { Modelo: Genero, etiqueta: 'El género', soloActivos: true },
  director: { Modelo: Director, etiqueta: 'El director', soloActivos: true },
  productora: { Modelo: Productora, etiqueta: 'La productora', soloActivos: true },
  tipo: { Modelo: Tipo, etiqueta: 'El tipo', soloActivos: false },
};

const validarReferencias = async (datos) => {
  for (const [campo, { Modelo, etiqueta, soloActivos }] of Object.entries(REFERENCIAS)) {
    const id = datos[campo];
    if (id === undefined || id === null || id === '') continue; // lo valida el esquema si es obligatorio

    if (!esIdValido(id)) throw new HttpError(400, `${etiqueta}: el id "${id}" no es válido`);

    const documento = await Modelo.findById(id);
    if (!documento) throw new HttpError(400, `${etiqueta} seleccionado(a) no existe`);
    if (soloActivos && documento.estado !== 'Activo') {
      throw new HttpError(400, `${etiqueta} "${documento.nombre || documento.nombres}" está Inactivo(a); solo se pueden seleccionar registros activos`);
    }
  }
};

const buscarMedia = async (id) => {
  const media = await Media.findById(id).populate(POBLAR);
  if (!media) throw new HttpError(404, 'Producción no encontrada');
  return media;
};

// GET /api/medias?titulo=&anioEstreno=&genero=&director=&productora=&tipo=
const listarMedias = async (req, res) => {
  const filtro = {};
  const { titulo, anioEstreno } = req.query;

  if (titulo) filtro.titulo = { $regex: escaparRegex(titulo), $options: 'i' };
  if (anioEstreno !== undefined) filtro.anioEstreno = Number(anioEstreno);

  for (const campo of Object.keys(REFERENCIAS)) {
    const id = req.query[campo];
    if (id === undefined) continue;
    if (!esIdValido(id)) throw new HttpError(400, `El filtro ${campo} no es un id válido`);
    filtro[campo] = id;
  }

  const medias = await Media.find(filtro).populate(POBLAR).sort({ fechaCreacion: -1 });
  res.json(medias);
};

// GET /api/medias/:id
const obtenerMedia = async (req, res) => {
  res.json(await buscarMedia(req.params.id));
};

// POST /api/medias
const crearMedia = async (req, res) => {
  const datos = seleccionarCampos(req.body, CAMPOS);
  await validarReferencias(datos);
  const media = await Media.create(datos);
  res.status(201).json(await media.populate(POBLAR));
};

// PUT /api/medias/:id
const actualizarMedia = async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw new HttpError(404, 'Producción no encontrada');

  const datos = seleccionarCampos(req.body, CAMPOS);

  // Solo se exige "activo" a las referencias que cambian; si un género se inactiva
  // después, las producciones que ya lo tienen se pueden seguir editando.
  const referenciasNuevas = Object.fromEntries(
    Object.keys(REFERENCIAS)
      .filter((campo) => datos[campo] !== undefined && String(datos[campo]) !== String(media[campo]))
      .map((campo) => [campo, datos[campo]])
  );
  await validarReferencias(referenciasNuevas);

  media.set(datos);
  await media.save();
  res.json(await media.populate(POBLAR));
};

// DELETE /api/medias/:id
const eliminarMedia = async (req, res) => {
  const media = await buscarMedia(req.params.id);
  await media.deleteOne();
  res.json({ mensaje: 'Producción eliminada', media });
};

module.exports = { listarMedias, obtenerMedia, crearMedia, actualizarMedia, eliminarMedia };
