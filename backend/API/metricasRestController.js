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

async function obtenerTablaBiomos(req, res) {
  try {
    const registros = await metricasService.obtenerTablaBiomos();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al obtener tabla biomos:', error);
    res.status(500).json({ error: 'Error al obtener tabla biomos', detalle: error.message });
  }
}

module.exports = {
  obtenerMetricas,
  obtenerTablaBiomos
};