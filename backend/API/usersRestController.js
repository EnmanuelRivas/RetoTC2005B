/**
 * Users Rest Api File
 * 
 * Define la API REST para la tabla de usuarios.
 * Se recomienda separar la lógica de API de las plantillas HTML.
 * Esto permite que la API sea reutilizable por otras aplicaciones o servicios.
 */
const userService = require('../Service/usersService');
const hashService = require('../Service/hashPassword');
const emailService = require('../Service/emailService');
const profileImageService = require('../Service/profileImageService');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config()

const SECRET = process.env.JWT_SECRET;

// Debug: verificar que JWT_SECRET esté configurado
console.log('🔑 JWT_SECRET configurado:', !!SECRET);
if (!SECRET) {
    console.error('❌ CRÍTICO: JWT_SECRET no está configurado en las variables de entorno');
}


/**
 * Método HTTP que maneja el login de usuario.
 * Valida correo y contraseña, y si son correctos, retorna un token JWT.
 */
async function execLogin(req, res) {
    const { correo, contraseña } = req.body;
    const user = await hashService.isValidUser(correo,contraseña)
    
    // Verifica si las credenciales son válidas
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Crea el token JWT
  const token = jwt.sign(
  { id: user.id, username: user.correo, role_id: user.role_id },
  SECRET,
  { expiresIn: '1h' }
);


    // Devuelve el token al cliente
    res.json({ token });
}

/**
 * Middleware que se ejecuta antes de cada ruta protegida.
 * Verifica la validez del token JWT.
 */
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Bearer <token>
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(401); // No autorizado
  
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Token inválido o expirado
      req.user = user;
      next();
    });
}

/**
 * Registra un nuevo usuario al recibir datos del formulario y guardar opcionalmente una imagen de perfil.
 */
async function publicRegisterUser(req, res) {
  try {
    console.log("Iniciando registro de usuario");
    let userData = req.body;
    console.log("Datos recibidos:", {
      nombre: userData.nombre,
      apellidos: userData.apellidos,
      correo: userData.correo,
      contraseña: userData.contrasena ? "******" : undefined,
      numeroTelefono: userData.numeroTelefono,
      pais: userData.pais,
      provincia: userData.provincia,
      ciudad: userData.ciudad,
      organizacion: userData.organizacion,
      descripcion: userData.descripcion ? "..." : undefined
    });
    
    // Mostrar información detallada del archivo si existe
    if (req.file) {
      console.log("Archivo recibido:", {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });
    } else {
      console.log("No se recibió ningún archivo");
    }
    
    // Validar campos requeridos
    const requiredFields = ['nombre', 'apellidos', 'correo', 'contrasena'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        console.log(`Campo requerido faltante: ${field}`);
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} es requerido.`
        });
      }
    }
    
    // Si el campo viene como contrasena (sin ñ), copiarlo a contraseña (con ñ)
    if (userData.contrasena && !userData.contraseña) {
      userData.contraseña = userData.contrasena;
    }
    
    let profileImagePath = null;
    
    // Procesar la imagen de perfil si está presente
    if (req.file) {
      try {
        profileImagePath = await profileImageService.saveProfileImage(req.file);
        console.log("Imagen de perfil guardada en:", profileImagePath);
      } catch (imageError) {
        console.error("Error al guardar la imagen de perfil:", imageError);
        // Continuamos con el registro aunque falle la imagen
      }
    }
    
    // Insertar usuario con la imagen
    console.log("Intentando insertar usuario en la base de datos");
    console.log("Ruta de imagen a guardar:", profileImagePath);
    const result = await userService.insertUser(userData, profileImagePath);
    console.log("Resultado del insert:", result);

    // Si hay un error en el resultado, devolverlo
    if (result.err) {
      console.log("Error al insertar usuario:", result.err);
      return res.status(400).json({
        status: "error",
        message: result.err
      });
    }

    // Busca por id AUTOINCREMENTADO (gen_id)
    console.log("Buscando usuario recién insertado con ID:", result.gen_id);
    const newUser = await userService.findUserById(result.gen_id);
    console.log("Usuario insertado:", newUser.rows);

    if (!newUser.rows || !newUser.rows[0]) {
      console.log("No se encontró el usuario recién insertado");
      return res.status(500).json({
        status: "error",
        message: "No se encontró el usuario recién insertado."
      });
    }    // Crea el token JWT
    console.log("Generando token JWT");
    const token = jwt.sign(
      {
        id: newUser.rows[0].id,
        correo: newUser.rows[0].correo,
        role_id: newUser.rows[0].role_id // Usando role_id en lugar de isAdmin
      },
      SECRET,
      { expiresIn: '1h' }
    );

    console.log("Registro exitoso, enviando respuesta");
    res.status(201).json({
      status: "success",
      total: result.changes,
      gen_id: result.gen_id,
      token
    });
  } catch (error) {
    console.error("Error en publicRegisterUser:", error);
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
 * Método que devuelve un usuario específico basado en su id.
 */
async function findUser(req,res){
    try{       
        let username = req.body.username;
        let id = req.body.id;
        let result;
        
        if (id) {
            result = await userService.findUserById(id);
        } else if (username) {
            result = await userService.findUserByEmail(username);
        } else {
            return res.status(400).json({
                "status": "error",
                "message": "Se requiere id o username"
            });
        }
        
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
 * Método que inserta un usuario.
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
 * Método que modifica un usuario.
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
 * Método que elimina un usuario.
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
        
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({
                status: "error",
                message: "Por favor ingresa un correo electrónico válido."
            });
        }
        
        // Verificar si el correo existe en la base de datos
        const userResult = await userService.findUserByEmail(correo);
        
        if (!userResult.rows || userResult.rows.length === 0) {
            // Enviar correo informativo aunque el usuario no exista
            try {
                const info = await emailService.enviarEmailNoRegistrado(correo);
                console.log(`Correo informativo enviado a ${correo}: ${info.messageId}`);
            } catch (emailError) {
                console.error('Error al enviar correo informativo:', emailError);
            }
            
            // Por seguridad, siempre devolvemos el mismo mensaje
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
        const emailResult = await emailService.enviarEmailRecuperacion(correo, user.nombre, token);
        
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
 * Método para restablecer la contraseña con un token válido.
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
        
        // Actualizar la contraseña en la base de datos (ahora el servicio se encarga de generar el hash)
        const updateResult = await userService.updatePassword(user.id, nuevaContraseña);
        
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

/**
 * HTTP Method que obtiene estadísticas para administradores
 */
async function getAdminStats(req, res) {
    try {
        // Verificar que el usuario sea administrador (ya verificado por middleware, pero por seguridad)
        if (req.user?.role_id !== 1) {
            return res.status(403).json({
                status: "error", 
                message: "Acceso denegado. Se requieren permisos de administrador."
            });
        }

        const userService = require('../Service/usersService');
        
        // Obtener estadísticas básicas
        const totalUsers = await userService.getAllUsers();
        const adminUsers = totalUsers.rows.filter(user => user.role_id === 1);
        const regularUsers = totalUsers.rows.filter(user => user.role_id === 2);
        
        const stats = {
            total_users: totalUsers.rows.length,
            admin_users: adminUsers.length,
            regular_users: regularUsers.length,
            recent_registrations: totalUsers.rows.filter(user => {
                const registrationDate = new Date(user.fecha_registro || user.created_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return registrationDate > thirtyDaysAgo;
            }).length
        };

        res.status(200).json({
            status: "success",
            data: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de administrador:', error);        res.status(500).json({
            status: "error",
            message: "Error interno al obtener estadísticas."
        });    
    }
}

/**
 * Método que consigue el perfil del usuario autenticado. 
 */
async function getProfile(req, res) {
    try {
        const userId = req.user.id; // Obtenido del token JWT por el middleware
        
        const userResult = await userService.findUserById(userId);
        
        if (!userResult.rows || userResult.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        
        const user = userResult.rows[0];
        
        // Remover la contraseña hash del resultado
        delete user.contraseñaHash;
        
        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            status: "error",
            message: "Error interno al obtener el perfil"
        });
    }
}

/**
 * Método que modifica el perfil del usuario autenticado.
 */
async function updateProfile(req, res) {
    try {
        const userId = req.user.id; // Obtenido del token JWT por el middleware
        let userData = req.body;
        userData.id = userId; // Asegurar que estamos actualizando el usuario correcto
        
        let profileImagePath = null;
        
        // Verificar si el usuario existe
        const userResult = await userService.findUserById(userId);
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
                    userId, 
                    existingUser.imagen_perfil
                );
            } else {
                // Si no tiene imagen, guardar una nueva
                profileImagePath = await profileImageService.saveProfileImage(req.file, userId);
            }
        }
        
        // Actualizar usuario con la nueva imagen (si hay)
        const result = await userService.updateUser(userData, profileImagePath);
          res.status(200).json({
            status: "success",
            message: "Perfil actualizado correctamente"
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            status: "error",
            message: "Error interno al actualizar el perfil"
        });
    }
}

/**
 * Método que modifica la contraseña del usuario autenticado.
 */
async function updatePassword(req, res) {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validaciones
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                status: "error",
                message: "Todos los campos son requeridos"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: "error",
                message: "Las nuevas contraseñas no coinciden"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: "error",
                message: "La nueva contraseña debe tener al menos 6 caracteres"
            });
        }

        // Obtener usuario actual
        const userResult = await userService.findUserById(userId);
        if (!userResult.rows || userResult.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        const user = userResult.rows[0];

        // Verificar contraseña actual
        const isCurrentPasswordValid = await hashService.comparePassword(currentPassword, user.contraseñaHash);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                status: "error",
                message: "La contraseña actual es incorrecta"
            });
        }

        // Hashear nueva contraseña
        const newPasswordHash = await hashService.encryptPassword(newPassword);

        // Actualizar contraseña en la base de datos
        const updateResult = await userService.updateUser({
            id: userId,
            contraseñaHash: newPasswordHash
        });

        res.status(200).json({
            status: "success",
            message: "Contraseña actualizada correctamente"
        });
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({
            status: "error",
            message: "Error interno al actualizar la contraseña"
        });
    }
}

/**
 * Método que modifica y actualiza el rol del usuario autenticado.
 */
async function actualizarRol(req, res) {
  const userId = req.params.id;
  const { role_id } = req.body;

  console.log(`actualizarRol: Intentando actualizar usuario ID ${userId} al rol ${role_id}`);

  if (!role_id || isNaN(role_id)) {
    console.log('actualizarRol: Rol inválido');
    return res.status(400).json({ status: "error", message: "Rol inválido." });
  }

  if (!userId || isNaN(userId)) {
    console.log('actualizarRol: ID de usuario inválido');
    return res.status(400).json({ status: "error", message: "ID de usuario inválido." });
  }

  try {
    // Primero verificar si el usuario existe
    const userExists = await userService.findUserById(userId);
    console.log('actualizarRol: Usuario encontrado:', userExists.rows ? userExists.rows.length : 0);
    
    if (!userExists.rows || userExists.rows.length === 0) {
      console.log(`actualizarRol: Usuario con ID ${userId} no encontrado`);
      return res.status(404).json({ status: "error", message: 'Usuario no encontrado.' });
    }

    const result = await userService.actualizarRol(userId, role_id);
    console.log('actualizarRol: Resultado de la actualización:', result);

    if (result.error) {
      console.log('actualizarRol: Error en el servicio:', result.error);
      return res.status(500).json({ status: "error", message: result.error });
    }

    if (result.changes === 0) {
      console.log('actualizarRol: No se realizaron cambios');
      return res.status(404).json({ status: "error", message: 'No se pudo actualizar el usuario.' });
    }

    console.log(`actualizarRol: Rol actualizado exitosamente para usuario ${userId}`);
    return res.status(200).json({ status: "success", message: "Rol actualizado correctamente." });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    return res.status(500).json({ status: "error", message: "Error interno al actualizar el rol." });
  }
}

// Exporta las funciones y objetos para su uso
module.exports = {
    execLogin,
    authenticateToken,
    getUsers,
    findUser,
    actualizarRol,
    publicRegisterUser,
    insertUser,
    updateUser,
    deleteUser,
    recuperarPassword,
    verificarTokenRecuperacion,
    restablecerPassword,
    getAdminStats,
    getProfile,
    updateProfile,
    updatePassword
}