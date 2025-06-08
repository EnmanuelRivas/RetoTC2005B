const express = require('express');
const router = express.Router();
const convocatoriaService = require('../Service/convocatoriasService.js');
const { authenticateToken, requireUser } = require('../middleware/auth.middleware.js'); // agregamos esto

// añadimos authenticateToken, requireUser,
router.get('/getConvocatorias', authenticateToken, requireUser, async (req, res) => {
  try {
    const convocatorias = await convocatoriaService.obtenerConvocatorias();
    res.status(200).json(convocatorias);
  } catch (err) {
    console.error('Error al obtener convocatorias:', err);
    res.status(500).json({ error: 'Error interno al obtener convocatorias' });
  }
});

// añadimos authenticateToken, requireUser,
router.post('/postConvocatoria', authenticateToken, requireUser, async (req, res) => {
  try {
    const usuario_id = req.user.id; 
    const data = { ...req.body, usuario_id };

    const insertId = await convocatoriaService.crearConvocatoria(data);
    res.status(201).json({ message: 'Convocatoria creada exitosamente', id: insertId });
  } catch (err) {
    console.error('Error al crear convocatoria:', err);
    res.status(500).json({ error: 'Error interno al crear la convocatoria' });
  }
});

module.exports = router;
