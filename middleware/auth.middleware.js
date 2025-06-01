
function requireAdmin(req, res, next) {
  // El usuario debe estar autenticado y ser admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado: solo administradores"
    });
  }
  next();
}

function requireUser(req, res, next) {
  // El usuario debe estar autenticado (admin o usuario normal)
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Debes estar autenticado"
    });
  }
  next();
}

module.exports = { requireAdmin, requireUser };