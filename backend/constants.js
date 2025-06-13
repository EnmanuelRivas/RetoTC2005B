require('dotenv').config();

// Validar variables críticas para producción
function validateEnvironmentVariables() {
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'SECRET', 'JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Variables de entorno críticas faltantes: ${missingVars.join(', ')}`);
        } else {
            console.warn('⚠️  Ejecutando en modo desarrollo con variables faltantes');
        }
    } else {
        console.log('✅ Todas las variables de entorno están configuradas');
    }
}

// Ejecutar validación

// Constantes globales para el servidor
const port = process.env.PORT || 5000;
const indexURL = '/';
const apiURL = '/api';
const contextURL = '/awaq';

// Exporta las constantes para que estén disponibles en otros módulos
module.exports = {
  port,
  indexURL,
  apiURL,
  contextURL
};
