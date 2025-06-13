const dataSource = require('../Data/MySQLMngr');
const bcrypt = require('bcrypt');

/**
 * This method hashes a given password
 * @param {*} pass the users password
 * @returns encrypted password
 */
async function encryptPassword(pass){
    console.log("encryptPassword: Inicio de función con contraseña:", pass ? "Recibida" : "No recibida");
    
    if (!pass) {
        console.log("encryptPassword: Error - Contraseña vacía");
        throw new Error('La contraseña no puede estar vacía');
    }
    
    try {
        console.log("encryptPassword: Intentando hashear con bcrypt");
        let password = await bcrypt.hash(pass, 8);
        console.log("encryptPassword: Hash generado correctamente");
        return password;
    } catch (error) {
        console.error("encryptPassword: Error en bcrypt.hash:", error);
        throw error;
    }
}

/**
 * this method determines whether the user has given correct credentials.
 * RECAL that is more secure to use bcrypt.compare to determine if both passwords are the same.
 * 
 * @param {*} username the username of the given user
 * @param {*} password the password that he/she has provided
 * @returns the user.
 */
async function isValidUser(correo, contraseña) {
    console.log('🔐 isValidUser - Iniciando validación');
    console.log('📧 Email recibido:', correo);
    console.log('🔑 Contraseña recibida:', contraseña ? '***' : 'NO RECIBIDA');

    let query = 'SELECT * FROM usuarios WHERE correo = ?';
    let params = [correo];
    
    try {
        let qResult = await dataSource.getDataWithParams(query, params);
        console.log('📊 Resultado de query:', qResult.rows.length, 'usuarios encontrados');
        
        let user = qResult.rows[0];
        if (user) {
            console.log('👤 Usuario encontrado ID:', user.id);
            console.log('📧 Email en BD:', user.correo);
            console.log('🔑 ¿Tiene contraseñaHash?:', !!user.contraseñaHash);
            
            if (!user.contraseñaHash) {
                console.error("❌ El campo de contraseña hasheada no existe en el usuario:", user);
                return null;
            }
            
            let isEqual = await bcrypt.compare(contraseña, user.contraseñaHash);
            console.log('🔐 Comparación de contraseñas:', isEqual ? '✅ MATCH' : '❌ NO MATCH');
            
            if (isEqual)
                return user;
        } else {
            console.log('❌ No se encontró usuario con ese email');
        }
    } catch (error) {
        console.error('❌ Error en isValidUser:', error);
    }
    
    return null;
}

/**
 * Compares a plain password with a hashed password
 * @param {string} plainPassword - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {boolean} - True if passwords match, false otherwise
 */
async function comparePassword(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
}

// Exportar todas las funciones para su uso
module.exports = {encryptPassword, isValidUser, comparePassword}