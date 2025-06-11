const express = require("express");
const cors = require("cors");
const { join } = require("path");
const { createServer: _createServer } = require("http");

const { port, indexURL, apiURL, contextURL } = require("./constants.js");
const router = require("./routes/router.js");
/**
 * Configura middleware de seguridad (a futuro).
 * @param {Object} app
 */
function configureSecurity(app) {
    console.log("🛡️ Security not configured yet.");
}

/**
 * Sirve archivos estáticos y configura rutas.
 * @param {Object} app
 */
function configStaticFilesAndViews(app) {
    const frontendPath = join(__dirname, "../frontend");

    app.use('/uploads', express.static(join(__dirname, '../uploads')));
    
    app.use(express.static(frontendPath));
    
    // Rutas adicionales del backend (API)
    app.use(router);

    // Ruta base que sirve login.html
    app.get("/", (req, res) => {
        res.sendFile(join(frontendPath, "pages/login.html"));
    });

    // Manejo de rutas de awaq
    app.get("/awaq", (req, res) => {
        // Simplemente redirigimos a login por ahora
        res.sendFile(join(frontendPath, "pages/login.html"));
    });

    // Manejador de rutas dinámicas para las páginas
    app.get("/awaq/:pageName", (req, res, next) => {
        const pageName = req.params.pageName;
        const pageFile = join(frontendPath, "pages", pageName + ".html");
        const fs = require('fs');
        
        // Verificar si la página existe
        if (fs.existsSync(pageFile)) {
            res.sendFile(pageFile);
        } else {
            // Si la página no existe, redirigir a login
            res.redirect(contextURL);
        }
    });
}

/**
 * Configura middlewares del servidor.
 * @param {Object} app
 */
function configureServer(app) {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const anteproyectosRoutes = require('./API/anteproyectosRestController');
}

/**
 * Crea y retorna el servidor Express+HTTP.
 * @returns {Object} HTTP Server
 */
function createServer() {
    const app = express();
    configureServer(app);
    configStaticFilesAndViews(app);
    configureSecurity(app);

    return _createServer(app);
}

/**
 * Inicializa el proyecto web y levanta el servidor.
 */
function initWebProject() {
    const server = createServer();

    server.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}${indexURL}`);
        console.log(`📡 API available at http://localhost:${port}${apiURL}`);
        console.log(`🌐 Context available at http://localhost:${port}${contextURL}`);
    });
}

module.exports = initWebProject;