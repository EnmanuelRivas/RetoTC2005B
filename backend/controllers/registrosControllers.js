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
