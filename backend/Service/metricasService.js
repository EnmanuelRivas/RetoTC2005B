/**
 * Servicio para obtener métricas y datos de la tabla "registros"
 */
const db = require('../Data/MySQLMngr');


/**
 * Obtiene métricas globales del sistema: totald e registros, anteproyectos y usuarios registrados. 
 * 
 * @returns {Object} Objeto con los totales: { registros, anteproyectos, usuarios }
 * @throws {Error} Si alguna de las consultas falla
 */
async function obtenerMetricas() {
  // Consultar número total de registros en cada tabla
  const registrosResult = await db.getData('SELECT COUNT(*) AS total FROM registros');
  const anteproyectosResult = await db.getData('SELECT COUNT(*) AS total FROM anteproyecto');
  const usuariosResult = await db.getData('SELECT COUNT(*) AS total FROM usuarios');

  // Validar que todas las consultas hayan sido exitosas
  if (!registrosResult.getStatus() || !anteproyectosResult.getStatus() || !usuariosResult.getStatus()) {
    throw new Error('Error al obtener métricas desde la base de datos');
  }

  // Retornar los resultados como objeto con nombre de clave correspondiente
  return {
    registros: registrosResult.getRows()[0].total,
    anteproyectos: anteproyectosResult.getRows()[0].total,
    usuarios: usuariosResult.getRows()[0].total
  };
}

/**
 * Obtiene una tabla de registros con estado del tiempo, estación, tipo de registro y el ID del usuario.
 * 
 * @returns {Array} Arreglo de objetos con datos de cada registro
 * @throws {Error} Si ocurre un error al consultar la base de datos
 */
async function obtenerTablaBiomos() {
  const result = await db.getData(`
    SELECT id, estadoTiempo, estacion, tipoRegistro, usuario_id 
    FROM registros
  `);

  // Verificar si la consulta fue exitosa
  if (!result.getStatus()) {
    throw new Error('Error al obtener registros de biomos desde la base de datos');
  }

  // Devolver los datos como un arreglo de objetos
  return result.getRows(); 
}


// Exportar funciones para uso
module.exports = {
  obtenerMetricas,
  obtenerTablaBiomos
};