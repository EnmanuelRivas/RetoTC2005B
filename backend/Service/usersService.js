/**
 * Users service.
 * Contains all the required logic to manage users on the APP.
 * 
 * It is a good practice to separate the service from the controller, in order to have a better separation of concerns
 * and a better code organization.
 * 
 * Examples of why this is a good practice:
 * 1. The service can be used by other controllers or services. (e.g. a web socket service or a cron job).
 * 2. The service can modify the datasource without the need of a controller.
 * 3. The service can be used by other services.
 * 
 */
const dataSource = require('../Data/MySQLMngr');
const hashService = require('./hashPassword');

/**
 * Method that returns the list of users. NOTE that the method returns also the passwords of the users.
 * This is a security issue that should be fixed in the future.
 *
 * @returns Users list in json format
 */
async function getUsers(){
    let qResult;
    try{
        let query = 'SELECT nombre, apellidos, correo, telefono, password FROM usuarios';
        qResult = await dataSource.getData(query);   
    }catch(err){
        qResult = new dataSource.QueryResult(false,[],0,0,err.message);
    }
    return qResult;
}


/**
 * Busca un usuario por su correo.
 * @param {String} correo del usuario.
 * @returns el user object (array de rows).
 */
// Busca un usuario por id
async function findUserById(id) {
  let qResult;
  try {
    let query = 'SELECT * FROM usuarios WHERE id = ?';
    let params = [id];
    qResult = await dataSource.getDataWithParams(query, params);
  } catch (err) {
    qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
  }
  return qResult;
}

/**
 * Method that inserts a user into the database.
 * @param {*} user the json object that contains the user data.
 * @param {string} profileImagePath - Ruta a la imagen de perfil (opcional)
 * @returns query result object with the information of the query execution.
 */
async function insertUser(user, profileImagePath = null){
    let qResult;
    try{
        // Validate required fields
        if (!user.contraseña) {
            throw new Error('La contraseña es requerida');
        }
        
        // note the parameter wildcard ? in the query. This is a placeholder for the parameter that will be passed in the params array.
        let query = 'INSERT INTO usuarios (nombre, apellidos, correo, contraseña, contraseñaHash, numeroTelefono, pais, provincia, ciudad, organizacion, descripcion, imagen_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        user.contraseñaHash = await hashService.encryptPassword(user.contraseña);
        let params = [
            user.nombre, 
            user.apellidos, 
            user.correo, 
            user.contraseña, 
            user.contraseñaHash, 
            user.numeroTelefono, 
            user.pais, 
            user.provincia, 
            user.ciudad, 
            user.organizacion, 
            user.descripcion,
            profileImagePath
        ];
        qResult = await dataSource.insertData(query,params);
    }catch(err){
        qResult = new dataSource.QueryResult(false,[],0,0,err.message);
    }
    return qResult;
}


/**
 * Method that updates a user into the database.
 * @param {*} user - Datos del usuario a actualizar
 * @param {string} profileImagePath - Ruta a la nueva imagen de perfil (opcional)
 * @returns {Object} Resultado de la actualización
 */
async function updateUser(user, profileImagePath = null){
    let qResult;
    try{
        let query, params;
        
        if (profileImagePath) {
            // Si hay una nueva imagen, incluirla en la actualización
            query = `UPDATE usuarios 
                     SET nombre = ?, 
                         apellidos = ?, 
                         numeroTelefono = ?, 
                         pais = ?, 
                         provincia = ?, 
                         ciudad = ?, 
                         organizacion = ?, 
                         descripcion = ?,
                         imagen_perfil = ? 
                     WHERE id = ?`;
            
            params = [
                user.nombre, 
                user.apellidos, 
                user.numeroTelefono, 
                user.pais, 
                user.provincia, 
                user.ciudad, 
                user.organizacion, 
                user.descripcion,
                profileImagePath,
                user.id
            ];
        } else {
            // Sin nueva imagen, mantener la actual
            query = `UPDATE usuarios 
                     SET nombre = ?, 
                         apellidos = ?, 
                         numeroTelefono = ?, 
                         pais = ?, 
                         provincia = ?, 
                         ciudad = ?, 
                         organizacion = ?, 
                         descripcion = ?
                     WHERE id = ?`;
            
            params = [
                user.nombre, 
                user.apellidos, 
                user.numeroTelefono, 
                user.pais, 
                user.provincia, 
                user.ciudad, 
                user.organizacion, 
                user.descripcion,
                user.id
            ];
        }
        
        qResult = await dataSource.updateData(query, params);
    }catch(err){
        qResult = new dataSource.QueryResult(false,[],0,0,err.message);
    }
    return qResult;
}

/**
 * Method that updates a user into the database.
 * @param {*} user 
 * @returns 
 */
async function deleteUser(user_id){
    let qResult;
    try{
        // note the parameter wildcard ? in the query. This is a placeholder for the parameter that will be passed in the params array.
        let query = 'DELETE FROM usuarios WHERE id = ?';
        let params = [user_id]
        qResult = await dataSource.updateData(query,params);
    }catch(err){
        qResult = new dataSource.QueryResult(false,[],0,0,err.message);
    }
    return qResult;
}

/**
 * Busca un usuario por su correo electrónico
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise} - Resultado de la consulta
 */
async function findUserByEmail(email) {
    let qResult;
    try {
        let query = 'SELECT * FROM usuarios WHERE correo = ?';
        let params = [email];
        qResult = await dataSource.getDataWithParams(query, params);
    } catch (err) {
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}

/**
 * Guarda un token de recuperación de contraseña para un usuario
 * @param {number} userId - ID del usuario
 * @param {string} token - Token de recuperación
 * @param {Date} expiry - Fecha de expiración del token
 * @returns {Promise} - Resultado de la consulta
 */
async function savePasswordResetToken(userId, token, expiry) {
    let qResult;
    try {
        // Primero eliminamos cualquier token existente para este usuario
        let deleteQuery = 'DELETE FROM password_reset_tokens WHERE user_id = ?';
        await dataSource.updateData(deleteQuery, [userId]);
        
        // Luego insertamos el nuevo token
        let query = 'INSERT INTO password_reset_tokens (user_id, token, expiry) VALUES (?, ?, ?)';
        let params = [userId, token, expiry];
        qResult = await dataSource.insertData(query, params);
    } catch (err) {
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}

/**
 * Verifica si un token de recuperación es válido
 * @param {string} token - Token a verificar
 * @returns {Promise} - Resultado de la consulta con el usuario asociado si es válido
 */
async function verifyPasswordResetToken(token) {
    let qResult;
    try {
        let query = `
            SELECT u.* FROM password_reset_tokens t
            JOIN usuarios u ON t.user_id = u.id
            WHERE t.token = ? AND t.expiry > NOW()
        `;
        let params = [token];
        qResult = await dataSource.getDataWithParams(query, params);
    } catch (err) {
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}

/**
 * Actualiza la contraseña de un usuario
 * @param {number} userId - ID del usuario
 * @param {string} newPassword - Nueva contraseña (sin hash)
 * @param {string} newPasswordHash - Hash de la nueva contraseña
 * @returns {Promise} - Resultado de la consulta
 */
async function updatePassword(userId, newPassword, newPasswordHash) {
    let qResult;
    try {
        let query = 'UPDATE usuarios SET contraseña = ?, contraseñaHash = ? WHERE id = ?';
        let params = [newPassword, newPasswordHash, userId];
        qResult = await dataSource.updateData(query, params);
        
        // Eliminamos el token de recuperación usado
        if (qResult.changes > 0) {
            let deleteQuery = 'DELETE FROM password_reset_tokens WHERE user_id = ?';
            await dataSource.updateData(deleteQuery, [userId]);
        }
    } catch (err) {
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}

module.exports = {
    getUsers,
    findUserById,
    insertUser,
    updateUser,
    deleteUser,
    findUserByEmail,
    savePasswordResetToken,
    verifyPasswordResetToken,
    updatePassword
}