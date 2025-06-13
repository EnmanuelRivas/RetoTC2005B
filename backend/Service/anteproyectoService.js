const { pool } = require("../Data/MySQLMngr.js");

/**
 * Obtiene todos los anteproyectos ordenados por fecha de creación descendente.
 * @returns {Promise<Array>} Lista de anteproyectos
 */
async function getAnteproyectos() {
  const sql = `SELECT * FROM anteproyecto ORDER BY fecha_creacion DESC`;
  // Ejecuta la consulta para obtener todos los anteproyectos
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}


/**
 * Inserta un nuevo anteproyecto en la base de datos.
 * Primero verifica que el usuario exista.
 * @param {Object} data - Datos del anteproyecto a insertar
 * @param {number} data.usuario_id - ID del usuario creador
 * @param {string} data.titulo - Título del anteproyecto
 * @param {string} data.descripcion - Descripción del anteproyecto
 * @param {string} data.estado - Estado del anteproyecto
 * @param {number} data.convocatoria_id - ID de la convocatoria relacionada (NO se usa en la query actual)
 * @returns {Promise<number>} ID generado del nuevo anteproyecto
 */
async function postAnteproyecto(data) {
  const {
    usuario_id,
    titulo,
    descripcion,
    estado,
    convocatoria_id
  } = data;

  // Generar fecha_creacion automáticamente
  const fecha_creacion = new Date();

  const verificarUsuarioSQL = `SELECT id FROM usuarios WHERE id = ?`;

  return new Promise((resolve, reject) => {
    pool.query(verificarUsuarioSQL, [usuario_id], (err, userResult) => {
      if (err) return reject(err);
      if (userResult.length === 0) return reject(new Error(`Usuario con id ${usuario_id} no existe`));

      const insertSQL = `
        INSERT INTO anteproyecto 
        (usuario_id, titulo, descripcion, fecha_creacion, estado)
        VALUES (?, ?, ?, ?, ?)
      `;

      pool.query(
        insertSQL,
        [usuario_id, titulo, descripcion, fecha_creacion, estado, convocatoria_id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  });
}

// Exportamos las funciones para que puedan usarse
module.exports = {
  getAnteproyectos,
  postAnteproyecto
};
