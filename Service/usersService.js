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
 * @returns query result object with the information of the query execution.
 */
async function insertUser(user){
    let qResult;
    try{
        // note the parameter wildcard ? in the query. This is a placeholder for the parameter that will be passed in the params array.
        let query = 'INSERT INTO usuarios (nombre, apellidos, correo, contraseña, contraseñaHash, numeroTelefono, pais, provincia, ciudad, organizacion, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        user.contraseñaHash = await hashService.encryptPassword(user.contraseña);
        let params = [user.nombre, user.apellidos, user.correo, user.contraseña, user.contraseñaHash, user.numeroTelefono, user.pais, user.provincia, user.ciudad, user.organizacion, user.descripcion]
        qResult = await dataSource.insertData(query,params);
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
async function updateUser(user){
    let qResult;
    try{
        // note the parameter wildcard ? in the query. This is a placeholder for the parameter that will be passed in the params array.
        let query = 'UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, contraseña = ?, contraseñaHash = ?, numeroTelefono = ? WHERE id = ?';
        user.hash_password = await hashService.encryptPassword(user.password);
        let params = [user.name, user.username,user.password, user.age, user.hash_password, user.id]
        qResult = await dataSource.updateData(query,params);
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


module.exports = {
    getUsers,
    findUserById,
    insertUser,
    updateUser,
    deleteUser
}