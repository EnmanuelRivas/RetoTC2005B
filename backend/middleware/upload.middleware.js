/**
 * Middleware para gestión de subida de archivos usando multer.
 * Configura almacenamiento, filtro y límites para aceptar solo imágenes.
 */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Asegurarse de que el directorio de uploads exista
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  console.log("Creando directorio de uploads:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configura el almacenamiento y guarda archivos en el directorio uploadDir.
 * Los archivos se renombran con un timestamp para evitar colisiones.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegurarse de que el directorio exista al momento de guardar el archivo
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log("Guardando archivo en:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Genera un nombre único basado en el timestamp y el nombre original
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("Nombre de archivo generado:", uniqueName);
    cb(null, uniqueName);
  }
});

/**
 * Filtro para aceptar solo imágenes.
 * @param {Object} req - Objeto de petición HTTP
 * @param {Object} file - Objeto del archivo subido
 * @param {function} cb - Callback para continuar o rechazar archivo
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log("Archivo aceptado:", file.originalname, file.mimetype);
    cb(null, true);
  } else {
    console.log("Tipo de archivo rechazado:", file.mimetype);
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF)'), false);
  }
};

/**
 * Configuración final del middleware multer.
 */
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});

// Exporta la configuración para usarla como middleware en rutas
module.exports = upload;
