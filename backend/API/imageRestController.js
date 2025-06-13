const imageService = require('../Service/imageUploadService.js');

/**
 * Controlador que procesa la subida de imágenes
 */
async function subirImagen(req, res) {
  const idRegistro = req.body.idRegistro;
  const usuario = req.body.usuario || "desconocido";
  const archivos = req.files;

  if (!archivos || archivos.length === 0) {
    return res.status(400).json({ mensaje: "No se subieron imágenes." });
  }

  try {
    // Llama al servicio para guardar todas las imágenes
    const resultados = await imageService.insertImages(archivos, usuario, idRegistro);

    res.status(200).json({
      mensaje: "Imágenes subidas correctamente",
      resultados
    });
  } catch (err) {
    console.error("Error al guardar imágenes:", err);
    res.status(500).json({ mensaje: "Error al guardar imágenes.", error: err.message });
  }
}


// Exporta los métodos para su uso en las rutas
module.exports = {
  subirImagen
};
