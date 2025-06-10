const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET || 'asecretpassword'; // asegurar que haga match con el que esta en .env

/**
 * Middleware que verifica token y para el req.user
 function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.cookies?.token;
  const token = authHeader?.split(' ')[1];

  console.log('Token recibido:', token); // 👈

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado o malformado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token decodificado:', decoded); // 👈
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

}*/
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o malformado.' });
  }

  const token = authHeader.split(' ')[1];

  console.log('Token recibido:', token);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }

    req.user = user;

    console.log('Usuario autenticado:', req.user);

    next();
  });
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
 * Redirige a home si no es administrador
 */
function requireAdminForPage(req, res, next) {
    const authHeader = req.headers['authorization'] || req.cookies?.token; 
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.redirect('/awaq/login');
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        
        if (decoded.role_id === 1) {
            next();
        } else {
            return res.redirect('/awaq/home');
        }
    } catch (error) {
        return res.redirect('/awaq/login');
    }
}

module.exports = {
    authenticateToken,
    requireUser,
    requireAdmin,
    requireAuthForPage,
    requireAdminForPage
};