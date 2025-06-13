const { pool } = require("../Data/MySQLMngr.js");

/**
 * Inserta múltiples imágenes en la base de datos. Esto es para insertar las imagenes en el formulario de registros de 
 * proyectos.
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
    // Ejecutar inserción por cada imagen
    const [result] = await pool.promise().query(sql, [idRegistro, nombreImagen, usuario]);
    resultados.push({ id: result.insertId, nombreImagen });
  }
  return resultados;
}

/**
 * Inserta una imagen de perfil en la base de datos.
 * @param {String} imagePath - Ruta de la imagen de perfil
 * @param {Number} userId - ID del usuario
 * @returns {Promise<Object>} - Resultado de la inserción
 */
async function insertProfileImage(imagePath, userId) {
  try {
    const sql = "UPDATE usuarios SET imagen_perfil = ? WHERE id = ?";
    const [result] = await pool.promise().query(sql, [imagePath, userId]);
    
    return {
      success: result.affectedRows > 0,
      userId: userId,
      imagePath: imagePath
    };
  } catch (error) {
    console.error('Error al insertar imagen de perfil:', error);
    throw error;
  }
}

/**
 * Obtiene la imagen de perfil de un usuario.
 * @param {Number} userId - ID del usuario
 * @returns {Promise<Object>} - Datos de la imagen de perfil
 */
async function getProfileImage(userId) {
  try {
    const sql = "SELECT imagen_perfil FROM usuarios WHERE id = ?";
    const [rows] = await pool.promise().query(sql, [userId]);
    
    return rows[0] || null;
  } catch (error) {
    console.error('Error al obtener imagen de perfil:', error);
    throw error;
  }
}

/**
 * Elimina la imagen de perfil de un usuario.
 * @param {Number} userId - ID del usuario
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
async function deleteProfileImage(userId) {
  try {
    const sql = "UPDATE usuarios SET imagen_perfil = NULL WHERE id = ?";
    const [result] = await pool.promise().query(sql, [userId]);
    
    return {
      success: result.affectedRows > 0,
      userId: userId
    };
  } catch (error) {
    console.error('Error al eliminar imagen de perfil:', error);
    throw error;
  }
}

// Exportar todas las funciones para su uso
module.exports = {
  insertImages,
  insertProfileImage,
  getProfileImage,
  deleteProfileImage
};
