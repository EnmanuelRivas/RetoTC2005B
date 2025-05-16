// middlewares/upload.middleware.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"), // Asegúrate de que esta carpeta exista
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

export default upload;
