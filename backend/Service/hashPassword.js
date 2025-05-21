const dataSource = require('../Data/MySQLMngr');
const bcrypt = require('bcrypt');

/**
 * This method hashes a given password
 * @param {*} pass the users password
 * @returns encrypted password
 */
async function encryptPassword(pass){
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
async function isValidUser(username,password){
    let query = 'SELECT id, name,username, password, age, hash_password from usuarios where username = ?';
    let params = [username];
    qResult = await dataSource.getDataWithParams(query,params);
    let user = qResult.rows[0];
    if(user){
        let isEqual = await bcrypt.compare(password, user.hash_password);
        if(isEqual)
            return user;
    }
    return null;
}

module.exports = {encryptPassword,isValidUser}