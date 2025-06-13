/**
 * Anteproyectos Rest Api File
 * 
 * Defines the rest api for the anteproyectos table.
 * It is a good practice to separate the api from the templates.
 * This way, the api can be used by other applications or services.
 */
const anteproyectoService = require('../Service/anteproyectoService.js');

/**
 * HTTP Method that handles getting all anteproyectos
 */
async function getAnteproyectos(req, res) {
  try {
    const anteproyectos = await anteproyectoService.getAnteproyectos();
    res.status(200).json(anteproyectos);
  } catch (error) {
    console.error('Error al obtener anteproyectos:', error);
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
}

/**
 * HTTP Method that handles creating a new anteproyecto
 */
async function postAnteproyecto(req, res) {
  try {
    const usuario_id = req.user.id;
    const data = { ...req.body, usuario_id };
    const insertId = await anteproyectoService.postAnteproyecto(data);
    res.status(201).json({ message: 'Anteproyecto creado exitosamente', id: insertId });
  } catch (error) {
    console.error('Error al crear anteproyecto:', error);
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
}

module.exports = {
  getAnteproyectos,
  postAnteproyecto
};