import { pool } from '../db/db.js';  // Importamos el pool de conexión a la base de datos

// Ruta GET para obtener todos los registros
export const getRegistro = (req, res) => {
    const query = 'SELECT * FROM registros';  // Consulta para obtener todos los registros
  
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener registros:', err.message);
        return res.status(500).json({ message: 'Error al obtener registros' });
      }
      res.status(200).json(results);  // Devuelve los registros 
    });
  };
  
  // Ruta POST para insertar un nuevo registro en la tabla
  export const postRegistro = (req, res) => {
    const { estadoTiempo, estacion, tipoRegistro } = req.body;  // Datos capturados
  
    // Query para insertar un nuevo registro
    const query = 'INSERT INTO registros (estadoTiempo, estacion, tipoRegistro) VALUES (?, ?, ?)';
  
    pool.query(query, [estadoTiempo, estacion, tipoRegistro], (err, result) => {
      if (err) {
        console.error('Error al insertar datos:', err.message);
        return res.status(500).json({ message: 'Error al insertar datos en la base de datos' });
      }
      // Respuesta que indica que el registro fue recibido
      res.status(201).json({ message: 'Registro creado exitosamente', id: result.insertId });
    });
  };
  
  // GET DE VARIABLE CLIMATICA
  export const getVariableClimatica = (req, res) => {
    const query = 'SELECT * FROM variables_climaticas';  // Consulta para obtener todos los registros
  
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener registros:', err.message);
        return res.status(500).json({ message: 'Error al obtener registros' });
      }
      res.status(200).json(results);  // Devuelve los registros 
    });
  };

  // POST DE VARIABLE CLIMATICA
    // Ruta POST para insertar un nuevo registro en la tabla
  export const postVariableClimatica = (req, res) => {
    const { estadoTiempo, estacion, tipoRegistro,zona, pluviosidadMm, temperaturaMaxima, humedadMaxima, temperaturaMinima, nivelQuebradaMt } = req.body;  // Datos capturados
  
    // Query para insertar un nuevo registro
    const queryRegistro = 'INSERT INTO registros (estadoTiempo, estacion, tipoRegistro) VALUES (?, ?, ?)';
    pool.query(queryRegistro, [estadoTiempo, estacion, tipoRegistro], (err, result) => {
      if (err) {
        console.error('Error al insertar en registros:', err.message);
        return res.status(500).json({ message: 'Error al insertar en registros' });
      }

      const idRegistro = result.insertId;

      const queryClimatica = `INSERT INTO variables_climaticas (idRegistro, zona, pluviosidadMm, temperaturaMaxima, humedadMaxima, temperaturaMinima, nivelQuebradaMt)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

      pool.query(queryClimatica, [idRegistro, zona, pluviosidadMm, temperaturaMaxima, humedadMaxima, temperaturaMinima, nivelQuebradaMt], (err2) => {
        if (err2) {
          console.error('Error al insertar en variables_climaticas:', err2.message);
          return res.status(500).json({ message: 'Error al insertar en variables climáticas' });
        }
    
        res.status(201).json({ message: 'Registro climático creado exitosamente', idRegistro });
    });
  });
};

const subirImagen = (req, res) => {
  const idRegistro = req.body.idRegistro;
  const usuario = req.body.usuario || "desconocido";
  const archivos = req.files;

  if (!archivos || archivos.length === 0) {
    return res.status(400).send("No se subieron imágenes.");
  }

  const sql = `
    INSERT INTO carga_imagenes (idRegistro, nombre_archivo, usuario_carga)
    VALUES (?, ?, ?)
  `;

  const resultados = [];

  archivos.forEach((archivo) => {
    const filename = archivo.filename;

    connection.query(sql, [idRegistro, filename, usuario], (err, result) => {
      if (err) {
        console.error("Error al insertar imagen en la base de datos:", err);
        return res.status(500).send("Error al guardar imágenes.");
      }

      resultados.push({ mensaje: "Imagen subida", archivo: filename });

      // Enviar respuesta solo cuando se hayan procesado todas
      if (resultados.length === archivos.length) {
        res.status(200).json({ mensaje: "Imágenes subidas correctamente", resultados });
      }
    });
  });
};

