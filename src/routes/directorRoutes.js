const { Router } = require('express');
const validarId = require('../middlewares/validarId');
const {
  listarDirectores,
  obtenerDirector,
  crearDirector,
  actualizarDirector,
  eliminarDirector,
} = require('../controllers/directorController');

const router = Router();

router.get('/', listarDirectores);
router.get('/:id', validarId, obtenerDirector);
router.post('/', crearDirector);
router.put('/:id', validarId, actualizarDirector);
router.delete('/:id', validarId, eliminarDirector);

module.exports = router;
