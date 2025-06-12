const db = require('../Data/MySQLMngr');

async function obtenerMetricas() {
  const registrosResult = await db.getData('SELECT COUNT(*) AS total FROM registros');
  const anteproyectosResult = await db.getData('SELECT COUNT(*) AS total FROM anteproyecto');
  const usuariosResult = await db.getData('SELECT COUNT(*) AS total FROM usuarios');

  if (!registrosResult.getStatus() || !anteproyectosResult.getStatus() || !usuariosResult.getStatus()) {
    throw new Error('Error al obtener métricas desde la base de datos');
  }

  return {
    registros: registrosResult.getRows()[0].total,
    anteproyectos: anteproyectosResult.getRows()[0].total,
    usuarios: usuariosResult.getRows()[0].total
  };
}

module.exports = {
  obtenerMetricas
};