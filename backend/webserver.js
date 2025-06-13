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
    
    // Middleware para manejar archivos .gz de Unity con headers correctos
    app.use('/game/Build', express.static(join(__dirname, '../frontend/game/Build'), {
    setHeaders: function (res, path) {
        console.log('Serving file:', path); // Debug log
        
        // Handle all .gz files with appropriate Content-Encoding
        if (path.endsWith('.gz')) {
            res.setHeader('Content-Encoding', 'gzip');
            
            // Set appropriate Content-Type based on the original file type
            if (path.includes('.wasm.gz')) {
                res.setHeader('Content-Type', 'application/wasm');
            } else if (path.includes('.js.gz')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (path.includes('.data.gz')) {
                res.setHeader('Content-Type', 'application/octet-stream');
            } else {
                // Fallback for other .gz files
                res.setHeader('Content-Type', 'application/octet-stream');
            }
        }
    }
}));
    
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
    const server = createServer();    // Configurar puerto para diferentes plataformas
    const finalPort = process.env.PORT || port;
    
    // En Render siempre necesitamos escuchar en un puerto
    if (process.env.RENDER || process.env.NODE_ENV === 'production' || !process.env.VERCEL) {
        server.listen(finalPort, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${finalPort}`);
            console.log(`📡 API available at ${apiURL}`);
            console.log(`🌐 Context available at ${contextURL}`);
        });
    }
    
    return server;
}

/**
 * Crea solo la app de Express (para Vercel)
 */
function createExpressApp() {
    const app = express();
    configureServer(app);
    configStaticFilesAndViews(app);
    configureSecurity(app);
    
    return app;
}

module.exports = initWebProject;

// Exportar también la app para Vercel
if (process.env.VERCEL) {
    module.exports = createExpressApp();
}