const express = require('express');
const router = express.Router();
const anteproyectoService = require('../Service/anteproyectoService.js');
const { authenticateToken, requireUser } = require('../middleware/auth.middleware.js'); // agregamos esto

// Obtener todos los anteproyectos  requireUser,
router.get('/getAnteproyectos', authenticateToken, requireUser, async (req, res) => {
  try {
    const anteproyectos = await anteproyectoService.getAnteproyectos();
    res.status(200).json(anteproyectos);
    /*
    const query = "SELECT * FROM anteproyecto";

    const result = await getData(query);

    if (!result.getStatus()) {
      return res.status(500).json({ error: 'Error al obtener anteproyectos', detalle: result.getErr() });
    }
    res.status(200).json(result.getRows());*/
  } catch (error) {
    console.error('Error al obtener anteproyectos:', error); //  acabo de añadir este
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});

// Crear un nuevo anteproyecto
router.post('/postAnteproyecto', authenticateToken, requireUser, async (req, res) => {
  try {
    const usuario_id = req.user.id;
    /*
    const { titulo, descripcion, fecha_creacion, fecha_limite, estado } = req.body;

    const query = `INSERT INTO anteproyecto
      (usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    const params = [usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado];

    const result = await insertData(query, params);

    if (!result.getStatus()) {
      // Aquí podrías verificar si el error es por foreign key y devolver mensaje más claro
      if (result.getErr().includes('foreign key')) {
        return res.status(400).json({ error: 'El usuario_id no existe en la tabla Usuarios' });
      }
      return res.status(500).json({ error: 'Error al guardar anteproyecto', detalle: result.getErr() });
    }

    res.status(201).json({
      mensaje: 'Anteproyecto creado',
      id: result.getGenId(),
      data: { ...req.body, usuario_id }
    });*/
    const data = { ...req.body, usuario_id };
    const insertId = await anteproyectoService.postAnteproyecto(data);
    res.status(201).json({ message: 'Anteproyecto creado exitosamente', id: insertId });
  } catch (error) {
    console.error('Error al crear anteproyecto:', error);
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});

module.exports = router;