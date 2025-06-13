/**
 * Convocatorias Rest Api File
 * 
 * Defines the rest api for the convocatorias table.
 * It is a good practice to separate the api from the templates.
 * This way, the api can be used by other applications or services.
 */
const convocatoriaService = require('../Service/convocatoriasService.js');

/**
 * HTTP Method that handles getting all convocatorias
 */
async function getConvocatorias(req, res) {
  try {
    const convocatorias = await convocatoriaService.obtenerConvocatorias();
    res.status(200).json(convocatorias);
  } catch (err) {
    console.error('Error al obtener convocatorias:', err);
    res.status(500).json({ error: 'Error interno al obtener convocatorias' });
  }
}

/**
 * HTTP Method that handles creating a new convocatoria
 */
async function postConvocatoria(req, res) {
  try {
    const usuario_id = req.user.id; 
    const data = { ...req.body, usuario_id };

    const insertId = await convocatoriaService.crearConvocatoria(data);
    res.status(201).json({ message: 'Convocatoria creada exitosamente', id: insertId });
  } catch (err) {
    console.error('Error al crear convocatoria:', err);
    res.status(500).json({ error: 'Error interno al crear la convocatoria' });
  }
}

module.exports = {
  getConvocatorias,
  postConvocatoria
};
