/**
 * Users Rest Api File
 * 
 * Defines the rest api for the users table.
 * It is a good practice to separate the api from the templates.
 * This way, the api can be used by other applications or services.
 * 
 * In the same way, is a good practice to separate the db tables on specific files.
 * On this way, tables can be managed independently and the code is more readable.
 */
const userService = require('../Service/usersService');
const hashService = require('../Service/hashPassword');
const emailService = require('../Service/emailService');
const profileImageService = require('../Service/profileImageService');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config()

const SECRET = process.env.SECRET;

/**
 * HTTP Method that handles authentication
 */
async function execLogin(req, res) {
    const { correo, contraseña } = req.body;
    const user = await hashService.isValidUser(correo,contraseña)
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    //CREATES the token
    const token = jwt.sign(
      { id: user.id, username: user.correo, isAdmin: user.isAdmin },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token }); // client stores this token
}

/**
 * Middleware that will execute before each protected URL
 * @param {*} req the original request
 * @param {*} res the users response
 * @param {*} next the method that will be executed next to this
 * @returns in case of unauthorized access
 */
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Bearer <token>
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(401); // Unauthorized
  
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden
      req.user = user;
      next();
    });
}

async function publicRegisterUser(req, res) {
  try {
    let userData = req.body;
    
    // Validar campos requeridos
    const requiredFields = ['nombre', 'apellidos', 'correo', 'contraseña'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} es requerido.`
        });
      }
    }
    
    let profileImagePath = null;
    
    // Procesar la imagen de perfil si está presente
    if (req.file) {
      profileImagePath = await profileImageService.saveProfileImage(req.file);
    }
    
    // Insertar usuario con la imagen
    const result = await userService.insertUser(userData, profileImagePath);
    console.log("Resultado del insert:", result);

    // Si hay un error en el resultado, devolverlo
    if (result.err) {
      return res.status(400).json({
        status: "error",
        message: result.err
      });
    }

    // Busca por id AUTOINCREMENTADO (gen_id)
    const newUser = await userService.findUserById(result.gen_id);
    console.log("Usuario insertado:", newUser.rows);

    if (!newUser.rows || !newUser.rows[0]) {
      return res.status(500).json({
        status: "error",
        message: "No se encontró el usuario recién insertado."
      });
    }

    // Crea el token JWT
    const token = jwt.sign(
      {
        id: newUser.rows[0].id,
        correo: newUser.rows[0].correo,
        isAdmin: newUser.rows[0].isAdmin // Si tu tabla tiene ese campo
      },
      SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      status: "success",
      total: result.changes,
      gen_id: result.gen_id,
      token
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
}


/**
 * Method that returns the list of users
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function getUsers(req,res){
    try{       
        const result = await userService.getUsers();
        res.status(200);
        res.json({
            "status"  : "success",
            "total"   : result.rows.length,
            "records" : result.rows
        });
    }catch(error){
        let jsonError = {
            "status"  : "error",
            "message" : error.message
        };
        console.log(error);
        res.status(500);
        res.send(jsonError);
    }
}


/**
 * Method that returns a specific user based on its id.
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function findUser(req,res){
    try{       
        let username = req.body.username;
        const result = await userService.findUser(username);
        res.status(200);
        res.json({
            "status"  : "success",
            "total"   : result.rows.length,
            "records" : result.rows
        });
    }catch(error){
        let jsonError = {
            "status"  : "error",
            "message" : error.message
        };
        console.log(error);
        res.status(500);
        res.send(jsonError);
    }   
}


/**
 * Method that inserts a user.
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function insertUser(req,res){
    try{       
        let user = req.body;
        const result = await userService.insertUser(user);
        res.status(200);
        res.json({
            "status"  : "success",
            "total"   : result.changes,
            "gen_id" : result.gen_id
        });
    }catch(error){
        let jsonError = {
            "status"  : "error",
            "message" : error.message
        };
        console.log(error);
        res.status(500);
        res.send(jsonError);
    }
}


/**
 * Method that updates a user.
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function updateUser(req,res){
    try{       
        let userData = req.body;
        let profileImagePath = null;
        
        // Verificar si el usuario existe
        const userResult = await userService.findUserById(userData.id);
        if (!userResult.rows || userResult.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        
        const existingUser = userResult.rows[0];
        
        // Procesar la imagen de perfil si está presente
        if (req.file) {
            // Si el usuario ya tiene una imagen, actualizarla
            if (existingUser.imagen_perfil) {
                profileImagePath = await profileImageService.updateProfileImage(
                    req.file, 
                    userData.id, 
                    existingUser.imagen_perfil
                );
            } else {
                // Si no tiene imagen, guardar una nueva
                profileImagePath = await profileImageService.saveProfileImage(req.file, userData.id);
            }
        }
        
        // Actualizar usuario con la nueva imagen (si hay)
        const result = await userService.updateUser(userData, profileImagePath);
        
        res.status(200).json({
            "status": "success",
            "total": result.changes
        });
    } catch(error) {
        let jsonError = {
            "status": "error",
            "message": error.message
        };
        console.log(error);
        res.status(500).json(jsonError);
    }
}

/**
 * Method that deletes a user.
 * 
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
async function deleteUser(req,res){
    try{       
        let user_id = req.body.user_id;
        const result = await userService.deleteUser(user_id);
        res.status(200);
        res.json({
            "status"  : "success",
            "total"   : result.changes
        });
    }catch(error){
        let jsonError = {
            "status"  : "error",
            "message" : error.message
        };
        console.log(error);
        res.status(500);
        res.send(jsonError);
    }
}

/**
 * Método para manejar la solicitud de recuperación de contraseña
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
async function recuperarPassword(req, res) {
    try {
        const { correo } = req.body;
        
        // Verificar si el correo existe en la base de datos
        const userResult = await userService.findUserByEmail(correo);
        
        if (!userResult.rows || userResult.rows.length === 0) {
            // Por seguridad, no revelamos si el correo existe o no
            return res.status(200).json({
                status: "success",
                message: "Si el correo existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña."
            });
        }
        
        const user = userResult.rows[0];
        
        // Generar token único
        const token = crypto.randomBytes(32).toString('hex');
        
        // Establecer fecha de expiración (1 hora)
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        
        // Guardar token en la base de datos
        await userService.savePasswordResetToken(user.id, token, expiry);
        
        // Enviar correo con el enlace de recuperación
        const emailResult = await emailService.enviarCorreoRecuperacion(correo, token);
        
        if (!emailResult.success) {
            return res.status(500).json({
                status: "error",
                message: "Error al enviar el correo electrónico."
            });
        }
        
        res.status(200).json({
            status: "success",
            message: "Se ha enviado un enlace de recuperación a tu correo electrónico."
        });
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({
            status: "error",
            message: "Error al procesar la solicitud de recuperación de contraseña."
        });
    }
}

/**
 * Método para verificar un token de recuperación de contraseña
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
async function verificarTokenRecuperacion(req, res) {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                status: "error",
                message: "Token no proporcionado."
            });
        }
        
        // Verificar si el token es válido y no ha expirado
        const result = await userService.verifyPasswordResetToken(token);
        
        if (!result.rows || result.rows.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Token inválido o expirado."
            });
        }
        
        res.status(200).json({
            status: "success",
            message: "Token válido."
        });
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(500).json({
            status: "error",
            message: "Error al verificar el token de recuperación."
        });
    }
}

/**
 * Método para restablecer la contraseña con un token válido
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
async function restablecerPassword(req, res) {
    try {
        const { token, nuevaContraseña } = req.body;
        
        if (!token || !nuevaContraseña) {
            return res.status(400).json({
                status: "error",
                message: "Token y nueva contraseña son requeridos."
            });
        }
        
        // Verificar si el token es válido y obtener el usuario asociado
        const result = await userService.verifyPasswordResetToken(token);
        
        if (!result.rows || result.rows.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Token inválido o expirado."
            });
        }
        
        const user = result.rows[0];
        
        // Generar hash de la nueva contraseña
        const nuevaContraseñaHash = await hashService.encryptPassword(nuevaContraseña);
        
        // Actualizar la contraseña en la base de datos
        const updateResult = await userService.updatePassword(user.id, nuevaContraseña, nuevaContraseñaHash);
        
        if (updateResult.changes === 0) {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar la contraseña."
            });
        }
        
        res.status(200).json({
            status: "success",
            message: "Contraseña actualizada correctamente."
        });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({
            status: "error",
            message: "Error al restablecer la contraseña."
        });
    }
}

module.exports = {
    execLogin,authenticateToken,getUsers,findUser,insertUser,updateUser,deleteUser,publicRegisterUser,recuperarPassword,verificarTokenRecuperacion,restablecerPassword
}