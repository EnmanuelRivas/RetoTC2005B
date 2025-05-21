const path = require("path");
const constants = require("../constants");

const frontendPath = path.join(__dirname, "../frontend");

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

module.exports = {
    index,
    loginPage
};
