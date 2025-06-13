// Importa e inicializa el proyecto web desde el archivo principal del servidor
const initWebProject = require('./webserver.js');

/**
 * Llama a la función que configura y levanta el servidor.
 */
try {
    initWebProject();
} catch (error) {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    process.exit(1);
}
