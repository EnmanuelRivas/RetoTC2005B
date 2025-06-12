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

/**
 * Muestra la página de gestión de usuarios (gestion_usuario.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function gestionUsuarioPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "gestion_usuario.html"));
}

/**
 * Muestra la página de gestión de áreas protegidas (gestion_ap.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function gestionAPPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "gestion_ap.html"));
}

/**
 * Muestra la página de recuperación de contraseña (recuperar.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function recuperarPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "recuperar.html"));
}

/**
 * Muestra la página de cambio de contraseña (changepwd.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function cambiarPasswordPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "changepwd.html"));
}

/**
 * Muestra la página de confirmación (confirmacion.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function confirmacionPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "confirmacion.html"));
}

/**
 * Muestra la página de chatbot (chatbot.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function chatbotPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "chatbot.html"));
}

/**
 * Muestra la página de métricas (metricas.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function metricasPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "metricas.html"));
}

/**
 * Muestra la página de número de áreas protegidas (numAP.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function numAPPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "numAP.html"));
}

/**
 * Muestra la página de número de biomos (numBiomos.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function numBiomosPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "numBiomos.html"));
}

/**
 * Muestra la página de convocatorias (convocatorias.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function convocatoriasPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "convocatorias.html"));
}

/**
 * Muestra la página de pre-registro (preReg.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function preRegPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "preReg.html"));
}

/**
 * Muestra la página de creación de EcoRanger (crearEcoRanger.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function crearEcoRangerPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "crearEcoRanger.html"));
}

/**
 * Muestra la página de edición de EcoRanger (editarEcoRanger.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function editarEcoRangerPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "editarEcoRanger.html"));
}

/**
 * Muestra la página de visualización de EcoRanger (viewEcoRanger.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function viewEcoRangerPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "viewEcoRanger.html"));
}

/**
 * Muestra la página del videojuego AWAQ (juego.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function juegoPage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "juego.html"));
}

/**
 * Muestra la página de gestión de soporte (gestion_soporte.html).
 * @param {Object} req Client request
 * @param {Object} res Server response
 */
async function gestionSoportePage(req, res) {
    res.sendFile(path.join(frontendPath, "pages", "gestion_soporte.html"));
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
    asistenteProyectosPage,    gestionUsuarioPage,
    gestionAPPage,
    gestionSoportePage,
    recuperarPage,
    cambiarPasswordPage,
    confirmacionPage,
    chatbotPage,
    metricasPage,
    numAPPage,
    numBiomosPage,
    convocatoriasPage,
    preRegPage,
    crearEcoRangerPage,
    editarEcoRangerPage,
    viewEcoRangerPage,
    juegoPage
};
