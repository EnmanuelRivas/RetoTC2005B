/**
 * Servicio para la gestión de imágenes de perfil de usuarios
 */
const fs = require('fs');
const path = require('path');

/**
 * Guarda una imagen de perfil en el sistema de archivos
 * @param {Object} imageFile - Objeto de archivo subido por multer
 * @param {Number} userId - ID del usuario (opcional, si es usuario nuevo será null)
 * @returns {string} Ruta relativa a la imagen guardada
 */
async function saveProfileImage(imageFile, userId = null) {
  try {
    if (!imageFile) return null;

    // Definir directorio para imágenes de perfil
    const profileImagesDir = path.join(__dirname, '../uploads/profiles');
    
    // Crear directorio si no existe
    if (!fs.existsSync(profileImagesDir)) {
      fs.mkdirSync(profileImagesDir, { recursive: true });
    }
    
    // Generar nombre único para la imagen
    const fileExtension = path.extname(imageFile.originalname);
    const fileName = `profile_${userId || Date.now()}${fileExtension}`;
    const filePath = path.join(profileImagesDir, fileName);
    
    // Mover la imagen desde el directorio temporal al directorio de perfiles
    fs.renameSync(imageFile.path, filePath);
    
    // Devolver la ruta relativa para guardar en la base de datos
    return `/uploads/profiles/${fileName}`;
  } catch (error) {
    console.error('Error al guardar imagen de perfil:', error);
    throw error;
  }
}

/**
 * Actualiza la imagen de perfil de un usuario
 * @param {Object} imageFile - Objeto de archivo subido por multer
 * @param {Number} userId - ID del usuario
 * @param {String} oldImagePath - Ruta a la imagen anterior (si existe)
 * @returns {string} Ruta relativa a la nueva imagen
 */
async function updateProfileImage(imageFile, userId, oldImagePath) {
  try {
    // Eliminar imagen anterior si existe
    if (oldImagePath) {
      const fullOldPath = path.join(__dirname, '..', oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
      }
    }
    
    // Guardar nueva imagen
    return await saveProfileImage(imageFile, userId);
  } catch (error) {
    console.error('Error al actualizar imagen de perfil:', error);
    throw error;
  }
}

/**
 * Elimina una imagen de perfil
 * @param {String} imagePath - Ruta relativa a la imagen
 */
async function deleteProfileImage(imagePath) {
  try {
    if (!imagePath) return;
    
    const fullPath = path.join(__dirname, '..', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Error al eliminar imagen de perfil:', error);
    throw error;
  }
}

module.exports = {
  saveProfileImage,
  updateProfileImage,
  deleteProfileImage
}; 