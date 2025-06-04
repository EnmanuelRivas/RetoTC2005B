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
const imageUploadService = require('./imageUploadService');

/**
 * Method that returns the list of users. Excludes password fields for security.
 *
 * @returns Users list in json format
 */
async function getUsers(){
    let qResult;
    try{
        // Modificamos la consulta para no incluir contraseñas
        let query = 'SELECT id, nombre, apellidos, correo, numeroTelefono, pais, provincia, ciudad, organizacion, descripcion, isAdmin FROM usuarios';
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
        console.log("insertUser: Iniciando inserción de usuario");
        
        // Validate required fields
        if (!user.contraseña) {
            console.log("insertUser: Error - La contraseña es requerida");
            throw new Error('La contraseña es requerida');
        }
        
        console.log("insertUser: Contraseña recibida correctamente");
        
        // Modificamos la consulta para eliminar el campo contraseña
        let query = 'INSERT INTO usuarios (nombre, apellidos, correo, contraseñaHash, numeroTelefono, pais, provincia, ciudad, organizacion, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        console.log("insertUser: Intentando hashear contraseña");
        try {
            user.contraseñaHash = await hashService.encryptPassword(user.contraseña);
            console.log("insertUser: Contraseña hasheada correctamente");
        } catch (hashError) {
            console.error("insertUser: Error al hashear contraseña:", hashError);
            throw hashError;
        }
        
        let params = [
            user.nombre, 
            user.apellidos, 
            user.correo, 
            user.contraseñaHash, 
            user.numeroTelefono, 
            user.pais, 
            user.provincia, 
            user.ciudad, 
            user.organizacion, 
            user.descripcion
        ];
        
        console.log("insertUser: Ejecutando query de inserción");
        qResult = await dataSource.insertData(query,params);
        console.log("insertUser: Resultado de la inserción:", {
            status: qResult.status,
            gen_id: qResult.gen_id,
            changes: qResult.changes,
            err: qResult.err
        });

        // Si la inserción fue exitosa y hay una imagen de perfil, actualizarla
        if (qResult.status && profileImagePath && qResult.gen_id) {
            console.log("insertUser: Actualizando imagen de perfil");
            await imageUploadService.insertProfileImage(profileImagePath, qResult.gen_id);
        }

    }catch(err){
        console.error("insertUser: Error capturado:", err);
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
        console.log("updateUser: Actualizando usuario con ID:", user.id);
        
        // Primero actualizamos los datos básicos del usuario
        let query = `UPDATE usuarios 
                     SET nombre = ?, 
                         apellidos = ?, 
                         numeroTelefono = ?, 
                         pais = ?, 
                         provincia = ?, 
                         ciudad = ?, 
                         organizacion = ?, 
                         descripcion = ?
                     WHERE id = ?`;
        
        let params = [
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
        
        console.log("updateUser: Ejecutando query de actualización");
        qResult = await dataSource.updateData(query, params);
        
        // Si la actualización fue exitosa y hay una nueva imagen, actualizarla
        if (qResult.status && profileImagePath) {
            console.log("updateUser: Actualizando imagen de perfil");
            await imageUploadService.insertProfileImage(profileImagePath, user.id);
        }
        
        console.log("updateUser: Resultado de la actualización:", {
            status: qResult.status,
            changes: qResult.changes,
            err: qResult.err
        });
    }catch(err){
        console.error("updateUser: Error capturado:", err);
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
 * @returns {Promise} - Resultado de la consulta
 */
async function updatePassword(userId, newPassword) {
    let qResult;
    try {
        // Obtener el hash de contraseña actual antes de actualizarlo
        let currentHashQuery = 'SELECT contraseñaHash FROM usuarios WHERE id = ?';
        let currentHashResult = await dataSource.getDataWithParams(currentHashQuery, [userId]);
        const currentHash = currentHashResult.rows[0]?.contraseñaHash || 'No se encontró hash actual';
        
        // Generar el hash de la nueva contraseña
        const newPasswordHash = await hashService.encryptPassword(newPassword);
        
        console.log('=== CAMBIO DE CONTRASEÑA DETECTADO ===');
        console.log(`Usuario ID: ${userId}`);
        console.log(`Hash anterior: ${currentHash}`);
        console.log(`Nuevo hash: ${newPasswordHash}`);
        console.log('=====================================');
        
        // Actualizar solo el hash de la contraseña
        let query = 'UPDATE usuarios SET contraseñaHash = ? WHERE id = ?';
        let params = [newPasswordHash, userId];
        qResult = await dataSource.updateData(query, params);
        
        // Eliminamos el token de recuperación usado
        if (qResult.changes > 0) {
            let deleteQuery = 'DELETE FROM password_reset_tokens WHERE user_id = ?';
            await dataSource.updateData(deleteQuery, [userId]);
            console.log(`Contraseña actualizada exitosamente para usuario ID: ${userId}`);
        }
    } catch (err) {
        console.error('Error al actualizar contraseña:', err.message);
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