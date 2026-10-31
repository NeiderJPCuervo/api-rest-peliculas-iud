const { Router } = require('express');
const validarId = require('../middlewares/validarId');
const {
  listarProductoras,
  obtenerProductora,
  crearProductora,
  actualizarProductora,
  eliminarProductora,
} = require('../controllers/productoraController');

const router = Router();

router.get('/', listarProductoras);
router.get('/:id', validarId, obtenerProductora);
router.post('/', crearProductora);
router.put('/:id', validarId, actualizarProductora);
router.delete('/:id', validarId, eliminarProductora);

module.exports = router;
