/**
 * Controlador REST para las métricas.
 * 
 * Define los endpoints relacionados con estadísticas generales y tablas analíticas.
 * Utiliza el servicio `metricasService` para acceder a los datos.
 */

const metricasService = require('../Service/metricasService');

/**
 * Obtiene métricas generales del sistema.
 * Llama al servicio correspondiente y responde con JSON.
 * 
 * @param {*} req Objeto de solicitud HTTP
 * @param {*} res Objeto de respuesta HTTP
 */
async function obtenerMetricas(req, res) {
  try {
    const metricas = await metricasService.obtenerMetricas();
    res.status(200).json(metricas);
  } catch (error) {
    console.error('Error inesperado al obtener métricas:', error);
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
}

/**
 * Obtiene los registros para la tabla de biomos.
 * Llama al servicio y devuelve los datos en formato JSON.
 */
async function obtenerTablaBiomos(req, res) {
  try {
    const registros = await metricasService.obtenerTablaBiomos();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al obtener tabla biomos:', error);
    res.status(500).json({ error: 'Error al obtener tabla biomos', detalle: error.message });
  }
}


// Exporta los métodos para su uso en las rutas
module.exports = {
  obtenerMetricas,
  obtenerTablaBiomos
};