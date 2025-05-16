// controllers/cargaImagenes.controller.js
import { pool } from "../db/db.js";

export const subirImagen = async (req, res) => {
  try {
    const archivos = req.files;
    const usuario = req.body.usuario || "anónimo";

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: "No se recibió ninguna imagen." });
    }

    const sql = "INSERT INTO carga_imagenes (name, usuario_carga) VALUES (?, ?)";

    const resultados = [];

    for (const archivo of archivos) {
      const nombreImagen = archivo.filename;
      const [result] = await pool.promise().query(sql, [nombreImagen, usuario]);
      resultados.push({ id: result.insertId, nombreImagen });
    }

    res.status(200).json({
      mensaje: "Imágenes subidas exitosamente",
      resultados
    });

  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    res.status(500).json({ error: "Error al subir las imágenes" });
  }
};
