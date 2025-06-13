const { pool } = require("../Data/MySQLMngr.js");


/**
 * Crea una nueva convocatoria en la base de datos.
 * Inserta un registro con los datos proporcionados.
 * @param {Object} data - Datos de la convocatoria a crear
 * @param {number} data.usuario_id - ID del usuario que crea la convocatoria
 * @param {string} data.nombre_anteproyecto - Nombre del anteproyecto
 * @param {string} data.fecha_cierre - Fecha límite de cierre (formato YYYY-MM-DD o compatible)
 * @param {string} data.sitioweb - URL del sitio web relacionado
 * @param {string} data.region - Región geográfica
 * @param {string} data.organizacion - Nombre de la organización
 * @param {string} data.pais - País
 * @param {string} data.descripcion - Descripción de la convocatoria
 * @returns {Promise<number>} - Promise que resuelve con el ID insertado de la convocatoria
 */
async function crearConvocatoria(data) {
  const {
    usuario_id,
    nombre_anteproyecto,
    fecha_cierre,
    sitioweb,
    region,
    organizacion,
    pais,
    descripcion,
  } = data;

  // Consulta SQL para insertar una nueva convocatoria
  const sql = `
    INSERT INTO convocatoria 
    (usuario_id, nombre_anteproyecto, fecha_cierre, sitioweb, region, organizacion, pais, descripcion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    pool.query(
      sql,
      [usuario_id, nombre_anteproyecto, fecha_cierre, sitioweb, region, organizacion, pais, descripcion],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
}

/**
 * Obtiene todas las convocatorias almacenadas en la base de datos.
 * Ordena las convocatorias por fecha de cierre de forma descendente (más recientes primero).
 * @returns {Promise<Array>} - Promise que resuelve con un array de objetos convocatoria
 */
async function obtenerConvocatorias() {
  // Consulta SQL para seleccionar todas las convocatorias
  const sql = `SELECT * FROM convocatoria ORDER BY fecha_cierre DESC`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Exportamos las funciones para que puedan usarse
module.exports = {
  crearConvocatoria,
  obtenerConvocatorias,
};
