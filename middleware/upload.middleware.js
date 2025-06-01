// middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");

// Para obtener __dirname en CommonJS, no necesitas extra utilidades
// __dirname ya está disponible

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"), // Asegúrate de que esta carpeta exista
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
