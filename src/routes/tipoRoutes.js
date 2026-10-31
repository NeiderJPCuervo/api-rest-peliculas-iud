const { Router } = require('express');
const validarId = require('../middlewares/validarId');
const {
  listarTipos,
  obtenerTipo,
  crearTipo,
  actualizarTipo,
  eliminarTipo,
} = require('../controllers/tipoController');

const router = Router();

router.get('/', listarTipos);
router.get('/:id', validarId, obtenerTipo);
router.post('/', crearTipo);
router.put('/:id', validarId, actualizarTipo);
router.delete('/:id', validarId, eliminarTipo);

module.exports = router;
