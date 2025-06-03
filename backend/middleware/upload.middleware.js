// middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Asegurarse de que el directorio de uploads exista
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  console.log("Creando directorio de uploads:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("Nombre de archivo generado:", uniqueName);
    cb(null, uniqueName);
  }
});

// Agregar filtro para aceptar solo imágenes
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

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});

module.exports = upload;
