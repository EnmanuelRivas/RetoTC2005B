const dataSource = require('../Data/MySQLMngr');
const bcrypt = require('bcrypt');

/**
 * This method hashes a given password
 * @param {*} pass the users password
 * @returns encrypted password
 */
async function encryptPassword(pass){
    if (!pass) {
        throw new Error('La contraseña no puede estar vacía');
    }
    let password = await bcrypt.hash(pass,8);
    return password;
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
    let query = 'SELECT * FROM usuarios WHERE correo = ?';
    let params = [correo];
    let qResult = await dataSource.getDataWithParams(query, params);
    let user = qResult.rows[0];
    if (user) {
        // Usa el nombre real de la columna:
        
        if (!user.contraseñaHash) {
            console.error("El campo de contraseña hasheada no existe en el usuario:", user);
            return null;
        }
        let isEqual = await bcrypt.compare(contraseña, user.contraseñaHash);
        if (isEqual)
            return user;
    }
    return null;
}

module.exports = {encryptPassword,isValidUser}