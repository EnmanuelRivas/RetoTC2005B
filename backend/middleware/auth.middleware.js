/**
 * Middleware que verifica si el usuario es administrador
 */
function requireAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
}

/**
 * Middleware que verifica si el usuario está autenticado
 */
function requireUser(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Acceso denegado. Inicie sesión para continuar.' });
    }
}

/**
 * Middleware para verificar autenticación en páginas
 * Redirige a login en caso de no estar autenticado
 */
function requireAuthForPage(req, res, next) {
    const authHeader = req.headers['authorization'] || req.cookies?.token; 
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.redirect('/awaq/login');
    }
    
    try {
        const jwt = require('jsonwebtoken');
        const SECRET = process.env.SECRET;
        
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.redirect('/awaq/login');
            }
            
            req.user = user;
            next();
        });
    } catch (error) {
        return res.redirect('/awaq/login');
    }
}

module.exports = {
    requireAdmin,
    requireUser,
    requireAuthForPage
};