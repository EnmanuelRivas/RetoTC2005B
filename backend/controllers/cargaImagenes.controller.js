import { pool } from "../db/db.js";

export const subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ninguna imagen." });
    }

    const nombreImagen = req.file.filename;
    const usuario = req.body.usuario || "anónimo";

    // Usar pool.promise() para poder usar await
    const sql = "INSERT INTO carga_imagenes (name, usuario_carga) VALUES (?, ?)";
    const [result] = await pool.promise().query(sql, [nombreImagen, usuario]);

    res.status(200).json({
      mensaje: "Imagen subida exitosamente",
      nombreImagen,
      id: result.insertId
    });

  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
};
