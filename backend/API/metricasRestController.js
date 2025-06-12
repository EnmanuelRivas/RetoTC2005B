const metricasService = require('../Service/metricasService');

async function obtenerMetricas(req, res) {
  try {
    const metricas = await metricasService.obtenerMetricas();
    res.status(200).json(metricas);
  } catch (error) {
    console.error('Error inesperado al obtener métricas:', error);
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
}

module.exports = {
  obtenerMetricas
};