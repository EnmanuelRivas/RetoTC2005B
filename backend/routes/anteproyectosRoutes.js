// anteproyectosRoutes.js

const express = require('express');
const router = express.Router();
const anteproyectosController = require('../API/controllers/anteproyectosController');
// const { requireUser } = require('../middleware/auth.middleware'); // agregamos esto

// añadimos , requireUser,
router.get('/', anteproyectosController.getAnteproyectos);

// añadimos , requireUser,
router.post('/',  anteproyectosController.createAnteproyecto);

// Posibles rutas extras:
// router.put('/:id', anteproyectosController.updateAnteproyecto);
// router.delete('/:id', anteproyectosController.deleteAnteproyecto);

module.exports = router;
