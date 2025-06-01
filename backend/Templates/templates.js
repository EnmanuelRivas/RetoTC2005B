const path = require("path");
const constants = require("../constants");

const frontendPath = path.join(__dirname, "../../frontend");

/**
 * Redirige al contexto base del proyecto (por ejemplo: /CSoftware).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function index(req, res) {
    res.redirect(constants.contextURL);
}

/**
 * Muestra la página de inicio de sesión (login.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function loginPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "login.html"));
}

/**
 * Muestra la página de registro (registro.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function registroPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "registro.html"));
}

/**
 * Muestra la página del dashboard (dashboard.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function dashboardPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "dashboard.html"));
}

/**
 * Muestra la página de inicio (home.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function homePage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "home.html"));
}

/**
 * Muestra la página de perfil (perfil.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function perfilPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "perfil.html"));
}

/**
 * Muestra la página de Asistente de Mi Biomo (AsistenteBiomo.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function asistenteBiomoPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "AsistenteBiomo.html"));
}

/**
 * Muestra la página de Asistente de Convocatorias (AsistenteConvocatorias.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function asistenteConvocatoriasPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "AsistenteConvocatorias.html"));
}

/**
 * Muestra la página de Asistente de Proyectos (AsistenteProyectos.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function asistenteProyectosPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "AsistenteProyectos.html"));
}

/**
 * Muestra la página de Asistente Explorador (AsistenteExplorador.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function asistenteExploradorPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "AsistenteExplorador.html"));
}

module.exports = {
    index,
    loginPage,
    registroPage,
    dashboardPage,
    homePage,
    perfilPage,
    asistenteBiomoPage,
    asistenteConvocatoriasPage,
    asistenteExploradorPage,
    asistenteProyectosPage
};
