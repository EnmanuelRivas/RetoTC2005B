/**
 * Servicio para la gestión de imágenes de perfil de usuarios
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Guarda una imagen de perfil en el sistema de archivos
 * @param {Object} imageFile - Objeto de archivo subido por multer o buffer
 * @param {Number} userId - ID del usuario (opcional, si es usuario nuevo será null)
 * @returns {string} Ruta relativa a la imagen guardada
 */
async function saveProfileImage(imageFile, userId = null) {
  try {
    if (!imageFile) {
      console.log('saveProfileImage: No se recibió imagen');
      return null;
    }

    console.log('saveProfileImage: Procesando imagen:', imageFile.originalname || 'desde buffer');

    // Definir directorio para imágenes
    const uploadsDir = path.join(__dirname, '../uploads');
    console.log('saveProfileImage: Directorio destino:', uploadsDir);
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadsDir)) {
      console.log('saveProfileImage: Creando directorio de uploads');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generar nombre único para la imagen
    const fileExtension = '.jpg'; // Siempre guardamos como JPG
    const fileName = `profile_${userId || Date.now()}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    
    console.log('saveProfileImage: Destino final en:', filePath);
    
    try {
      // Procesar la imagen con sharp
      let sharpInstance = sharp();
      
      // Si la imagen viene de multer (archivo temporal)
      if (imageFile.path) {
        sharpInstance = sharp(imageFile.path);
      } 
      // Si la imagen viene como buffer (base64)
      else if (imageFile.buffer) {
        sharpInstance = sharp(imageFile.buffer);
      }
      // Si la imagen viene como ruta
      else if (typeof imageFile === 'string') {
        sharpInstance = sharp(imageFile);
      }
      
      // Procesar y guardar la imagen
      await sharpInstance
        .resize({
          width: 300,
          height: 300,
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(filePath);
      
      console.log('saveProfileImage: Imagen procesada y guardada correctamente');
      
      // Si la imagen venía de multer, eliminar el archivo temporal
      if (imageFile.path && fs.existsSync(imageFile.path)) {
        try {
          fs.unlinkSync(imageFile.path);
          console.log('saveProfileImage: Archivo temporal eliminado');
        } catch (unlinkError) {
          console.warn('saveProfileImage: No se pudo eliminar el archivo temporal:', unlinkError.message);
        }
      }
    } catch (sharpError) {
      console.error('saveProfileImage: Error al procesar la imagen con sharp:', sharpError);
      throw sharpError;
    }
    
    // Devolver la ruta relativa para guardar en la base de datos
    const dbPath = `/uploads/${fileName}`;
    console.log('saveProfileImage: Ruta para la base de datos:', dbPath);
    return dbPath;
  } catch (error) {
    console.error('Error al guardar imagen de perfil:', error);
    throw error;
  }
}

/**
 * Actualiza la imagen de perfil de un usuario
 * @param {Object} imageFile - Objeto de archivo subido por multer o buffer
 * @param {Number} userId - ID del usuario
 * @param {String} oldImagePath - Ruta a la imagen anterior (si existe)
 * @returns {string} Ruta relativa a la nueva imagen
 */
async function updateProfileImage(imageFile, userId, oldImagePath) {
  try {
    console.log('updateProfileImage: Actualizando imagen para usuario ID:', userId);
    
    // Eliminar imagen anterior si existe
    if (oldImagePath) {
      console.log('updateProfileImage: Eliminando imagen anterior:', oldImagePath);
      const fullOldPath = path.join(__dirname, '..', oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
        console.log('updateProfileImage: Imagen anterior eliminada');
      } else {
        console.log('updateProfileImage: La imagen anterior no existe en el sistema de archivos');
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
    
    console.log('deleteProfileImage: Eliminando imagen:', imagePath);
    const fullPath = path.join(__dirname, '..', imagePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('deleteProfileImage: Imagen eliminada correctamente');
    } else {
      console.log('deleteProfileImage: La imagen no existe en el sistema de archivos');
    }
  } catch (error) {
    console.error('Error al eliminar imagen de perfil:', error);
    throw error;
  }
}

/**
 * Obtiene la URL completa de una imagen de perfil
 * @param {String} imagePath - Ruta relativa a la imagen
 * @param {Object} req - Objeto de solicitud HTTP
 * @returns {String} URL completa de la imagen
 */
function getProfileImageUrl(imagePath, req) {
  if (!imagePath) return null;
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}${imagePath}`;
}

// Exportar funciones del módulo
module.exports = {
  saveProfileImage,
  updateProfileImage,
  deleteProfileImage,
  getProfileImageUrl
}; 