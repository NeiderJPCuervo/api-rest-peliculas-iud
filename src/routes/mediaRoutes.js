const { Router } = require('express');
const validarId = require('../middlewares/validarId');
const {
  listarMedias,
  obtenerMedia,
  crearMedia,
  actualizarMedia,
  eliminarMedia,
} = require('../controllers/mediaController');

const router = Router();

router.get('/', listarMedias);
router.get('/:id', validarId, obtenerMedia);
router.post('/', crearMedia);
router.put('/:id', validarId, actualizarMedia);
router.delete('/:id', validarId, eliminarMedia);

module.exports = router;
