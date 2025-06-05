/**
 * Anteproyectos service.
 * Como manejamos los anteproyectos dentro del sistema.
 */

const dataSource = require('../Data/MySQLMngr');

/**
 * Obtiene todos los anteproyectos registrados.
 * @returns Lista de anteproyectos (QueryResult)
 */
async function getAnteproyectos() {
  let qResult;
  try {
    const query = `
      SELECT a.id, a.usuario_id, u.nombre AS nombre_usuario, a.titulo, a.descripcion, a.fecha_creacion, a.fecha_limite, a.estado
      FROM anteproyectos a
      INNER JOIN usuarios u ON a.usuario_id = u.id
    `;
    qResult = await dataSource.getData(query);
  } catch (err) {
    qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
  }
  return qResult;
}

/**
 * Inserta un nuevo anteproyecto.
 * Verifica que el usuario exista antes de insertar (usuario_id es una FK).
 * 
 * @param {Object} data - Datos del anteproyecto
 * @returns QueryResult del resultado de la operación
 */
async function createAnteproyecto(data) {
  let qResult;
  try {
    const {
      usuario_id,
      titulo,
      descripcion,
      fecha_creacion,
      fecha_limite,
      estado
    } = data;

    // Verificación de integridad: asegurar que el usuario exista
    const userExistsQuery = 'SELECT id FROM usuarios WHERE id = ?';
    const userResult = await dataSource.getDataWithParams(userExistsQuery, [usuario_id]);

    if (!userResult.getStatus() || userResult.getRows().length === 0) {
      return new dataSource.QueryResult(false, [], 0, 0, `Usuario con id ${usuario_id} no existe`);
    }

    // Insertar anteproyecto
    const insertQuery = `
      INSERT INTO anteproyectos 
      (usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      usuario_id,
      titulo,
      descripcion,
      fecha_creacion,
      fecha_limite,
      estado
    ];

    qResult = await dataSource.insertData(insertQuery, params);
  } catch (err) {
    qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
  }
  return qResult;
}

module.exports = {
  getAnteproyectos,
  createAnteproyecto
};
