const { pool } = require("../Data/MySQLMngr.js");

/**
 * Inserta múltiples imágenes en la base de datos.
 * @param {Array} archivos - req.files (de multer)
 * @param {String} usuario - Usuario que subió las imágenes
 * @param {Number} idRegistro - ID de registro relacionado
 * @returns {Promise<Array>} - Lista de imágenes guardadas (con id y nombre)
 */
async function insertImages(archivos, usuario, idRegistro) {
  const sql = "INSERT INTO carga_imagenes (idRegistro, nombre_archivo, usuario_carga) VALUES (?, ?, ?)";
  const resultados = [];

  for (const archivo of archivos) {
    const nombreImagen = archivo.filename;
    const [result] = await pool.promise().query(sql, [idRegistro, nombreImagen, usuario]);
    resultados.push({ id: result.insertId, nombreImagen });
  }
  return resultados;
}

module.exports = {
  insertImages
};
