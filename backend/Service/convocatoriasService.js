const { pool } = require("../Data/MySQLMngr.js");

async function crearConvocatoria(data) {
  const {
    usuario_id,
    nombre_anteproyecto,
    fecha_cierre,
    sitioweb,
    region,
    organizacion,
    pais,
    descripcion,
  } = data;

  const sql = `
    INSERT INTO convocatoria 
    (usuario_id, nombre_anteproyecto, fecha_cierre, sitioweb, region, organizacion, pais, descripcion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    pool.query(
      sql,
      [usuario_id, nombre_anteproyecto, fecha_cierre, sitioweb, region, organizacion, pais, descripcion],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
}

async function obtenerConvocatorias() {
  const sql = `SELECT * FROM convocatoria ORDER BY fecha_cierre DESC`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

module.exports = {
  crearConvocatoria,
  obtenerConvocatorias,
};
