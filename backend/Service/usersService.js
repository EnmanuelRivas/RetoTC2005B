/**
 * Servicio de gestión de usuarios.
 * Contiene la lógica relacionada con la creación, edición, eliminación,
 * autenticación y recuperación de usuarios dentro de la aplicación. 
 */
const dataSource = require('../Data/MySQLMngr');
const hashService = require('./hashPassword');
const imageUploadService = require('./imageUploadService');

/**
 * Obtiene todos los usuarios registrados, omitiendo contraseñas.
 * @returns {Promise<QueryResult>} Lista de usuarios
 */
async function getUsers(){
    let qResult;
    try{
        // Modificamos la consulta para no incluir contraseñas
        let query = 'SELECT id, nombre, apellidos, correo, role_id, numeroTelefono, pais, provincia, ciudad, organizacion, descripcion, role_id FROM usuarios';
        qResult = await dataSource.getData(query);   
        console.log("Usuarios encontrados:", qResult.rows); // 👈 DEBUG
    }catch(err){
        console.error("Error al obtener usuarios:", err);  // 👈 DEBUG error
        qResult = new dataSource.QueryResult(false,[],0,0,err.message);
    }
    return qResult;
}


/**
 * Busca un usuario por su ID.
 * @param {number} id - ID del usuario
 * @returns {Promise<QueryResult>} Usuario encontrado o error
 */
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
 * Inserta un nuevo usuario en la base de datos, con opción a imagen de perfil.
 * @param {Object} user - Datos del usuario
 * @param {string|null} profileImagePath - Ruta a la imagen de perfil
 * @returns {Promise<QueryResult>} Resultado de la inserción
 */
async function insertUser(user, profileImagePath = null){
    let qResult;
    try{
        console.log("insertUser: Iniciando inserción de usuario");
        
        // Valida campos requeridos
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
 * Actualiza los datos de un usuario existente.
 * Solo se actualizan los campos proporcionados.
 * @param {Object} user - Datos actualizados
 * @param {string|null} profileImagePath - Ruta a nueva imagen de perfil
 * @returns {Promise<QueryResult>} Resultado de la actualización
 */
async function updateUser(user, profileImagePath = null){
    let qResult;
    try{
        console.log("updateUser: Actualizando usuario con ID:", user.id);
        
        // Construir la query dinámicamente basada en los campos proporcionados
        let updateFields = [];
        let params = [];
        
        // Verificar qué campos se van a actualizar
        if (user.nombre !== undefined) {
            updateFields.push("nombre = ?");
            params.push(user.nombre);
        }
        if (user.apellidos !== undefined) {
            updateFields.push("apellidos = ?");
            params.push(user.apellidos);
        }
        if (user.numeroTelefono !== undefined) {
            updateFields.push("numeroTelefono = ?");
            params.push(user.numeroTelefono);
        }
        if (user.pais !== undefined) {
            updateFields.push("pais = ?");
            params.push(user.pais);
        }
        if (user.provincia !== undefined) {
            updateFields.push("provincia = ?");
            params.push(user.provincia);
        }
        if (user.ciudad !== undefined) {
            updateFields.push("ciudad = ?");
            params.push(user.ciudad);
        }
        if (user.organizacion !== undefined) {
            updateFields.push("organizacion = ?");
            params.push(user.organizacion);
        }
        if (user.descripcion !== undefined) {
            updateFields.push("descripcion = ?");
            params.push(user.descripcion);
        }
        if (user.contraseñaHash !== undefined) {
            updateFields.push("contraseñaHash = ?");
            params.push(user.contraseñaHash);
        }        // Si hay imagen de perfil para actualizar, agregarla a los campos
        if (profileImagePath) {
            updateFields.push("imagen_perfil = ?");
            params.push(profileImagePath);
        }
        
        // Solo proceder si hay campos para actualizar
        if (updateFields.length === 0) {
            console.log("updateUser: No hay campos para actualizar");
            return new dataSource.QueryResult(true, [], 0, 0, null);
        }
        
        // Agregar el ID al final
        params.push(user.id);
        
        let query = `UPDATE usuarios SET ${updateFields.join(", ")} WHERE id = ?`;
        
        console.log("updateUser: Ejecutando query de actualización");
        qResult = await dataSource.updateData(query, params);
        
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
 * Elimina un usuario por ID.
 * @param {number} user_id - ID del usuario
 * @returns {Promise<QueryResult>} Resultado de la eliminación
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
 * Busca un usuario por su correo electrónico.
 * @param {string} email - Correo del usuario
 * @returns {Promise<QueryResult>} Resultado de la consulta
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
 * Guarda un token de recuperación de contraseña en la base de datos.
 * Elimina tokens previos del usuario antes de insertar uno nuevo.
 * @param {number} userId
 * @param {string} token
 * @param {Date} expiry
 * @returns {Promise<QueryResult>}
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
 * Verifica si un token de recuperación es válido (no expirado).
 * @param {string} token - Token a verificar
 * @returns {Promise<QueryResult>} Usuario asociado al token
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
 * Actualiza la contraseña de un usuario y elimina el token de recuperación utilizado.
 * @param {number} userId - ID del usuario
 * @param {string} newPassword - Nueva contraseña en texto plano
 * @returns {Promise<QueryResult>}
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

/**
 * Actualiza el rol de un usuario.
 * @param {number} userId - ID del usuario
 * @param {number} role_id - Nuevo ID de rol
 * @returns {Promise<QueryResult|{error: string}>}
 */
async function actualizarRol(userId, role_id) {
  try {
    const query = `UPDATE usuarios SET role_id = ? WHERE id = ?`;
    const result = await dataSource.updateData(query, [role_id, userId]);
    return result;
  } catch (error) {
    return { error: error.message };
  }
}



// Exporta todos los métodos para usarlos en otros módulos
module.exports = {
    getUsers,
    findUserById,
    actualizarRol,
    insertUser,
    updateUser,
    deleteUser,
    findUserByEmail,
    savePasswordResetToken,
    verifyPasswordResetToken,
    updatePassword
}