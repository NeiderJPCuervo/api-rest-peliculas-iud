const { Router } = require('express');
const validarId = require('../middlewares/validarId');
const {
  listarGeneros,
  obtenerGenero,
  crearGenero,
  actualizarGenero,
  eliminarGenero,
} = require('../controllers/generoController');

const router = Router();

router.get('/', listarGeneros);
router.get('/:id', validarId, obtenerGenero);
router.post('/', crearGenero);
router.put('/:id', validarId, actualizarGenero);
router.delete('/:id', validarId, eliminarGenero);

module.exports = router;
