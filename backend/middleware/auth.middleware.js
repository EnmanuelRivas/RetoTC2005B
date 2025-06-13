const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'asecretpassword'; // asegurar que haga match con el que esta en .env

/**
 * Middleware que verifica token y autentica al usuario
 * Compatible con headers Authorization y cookies
  * @param {Request} req - Objeto de solicitud HTTP
 * @param {Response} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.cookies?.token;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  console.log('Token recibido:', token);

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado o malformado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware que verifica si el usuario está autenticado
 */
function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Acceso denegado. Inicie sesión para continuar.' });
  }
  next();
}

/**
 * Middleware que verifica si el usuario es administrador
 * Verifica que el role_id sea exactamente 1 (administrador)
 */
function requireAdmin(req, res, next) {
  if (req.user?.role_id === 1) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
}


/**
 * Middleware para verificar autenticación en páginas
 * Redirige a login en caso de no estar autenticado
 */
function requireAuthForPage(req, res, next) {
    const authHeader = req.headers['authorization'] || req.cookies?.token; 
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.redirect('/awaq/login');
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/awaq/login');
    }
}

/**
 * Middleware para verificar si el usuario es administrador en páginas
 * Este middleware permite que la página cargue y la verificación se hace en el cliente
 */
function requireAdminForPage(req, res, next) {
    // Para páginas HTML, permitimos que cargue y verificamos en el cliente
    // La verificación real se hace con JavaScript en el frontend
    next();
}

// Exporta los middlewares para uso en rutas protegidas
module.exports = {
    authenticateToken,
    requireUser,
    requireAdmin,
    requireAuthForPage,
    requireAdminForPage
};