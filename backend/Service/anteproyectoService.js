const { pool } = require("../Data/MySQLMngr.js");

async function getAnteproyectos() {
  const sql = `SELECT * FROM anteproyecto ORDER BY fecha_creacion DESC`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function postAnteproyecto(data) {
  const { usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado } = data;

  // Verificación de integridad: asegurar que el usuario exista
  const verificarUsuarioSQL = `SELECT id FROM usuarios WHERE id = ?`;

  return new Promise((resolve, reject) => {
    pool.query(verificarUsuarioSQL, [usuario_id], (err, userResult) => {
      if (err) return reject(err);
      if (userResult.length === 0) return reject(new Error(`Usuario con id ${usuario_id} no existe`));

      // Insertar anteproyecto
      const insertSQL = `
        INSERT INTO anteproyecto (usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      pool.query(insertSQL, [usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  });
}

module.exports = {
  getAnteproyectos,
  postAnteproyecto
};