const express = require("express");
const constants = require("../constants");

const usersRest = require("../API/usersRestController");
const formsRest = require("../API/formsRestController");
const imageRest = require("../API/imageRestController");
const templates = require("../Templates/templates");
const upload = require("../middleware/upload.middleware");
const anteproyectosRest = require("../API/anteproyectosRestController");
const convocatoriasRest = require('../API/convocatoriasRestController');

const { requireAdmin, requireUser } = require("../middleware/auth.middleware");

const router = express.Router();

/* ------------------------ TEMPLATES ROUTES ------------------------ */
router.get(constants.indexURL, templates.index);
router.get(constants.contextURL, templates.loginPage);

/* Rutas públicas (accesibles sin autenticación) */
router.get(`${constants.contextURL}/registro`, templates.registroPage);
router.get(`${constants.contextURL}/recuperar`, templates.recuperarPage);
router.get(`${constants.contextURL}/changepwd`, templates.cambiarPasswordPage);
router.get(`${constants.contextURL}/confirmacion`, templates.confirmacionPage);
router.get(`${constants.contextURL}/preReg`, templates.preRegPage);

/* Rutas para usuarios autenticados */
router.get(`${constants.contextURL}/home`, templates.homePage);
router.get(`${constants.contextURL}/perfil`, templates.perfilPage);
router.get(`${constants.contextURL}/AsistenteBiomo`, templates.asistenteBiomoPage);
router.get(`${constants.contextURL}/AsistenteConvocatorias`, templates.asistenteConvocatoriasPage);
router.get(`${constants.contextURL}/AsistenteExplorador`, templates.asistenteExploradorPage);
router.get(`${constants.contextURL}/AsistenteProyectos`, templates.asistenteProyectosPage);
router.get(`${constants.contextURL}/convocatorias`, templates.convocatoriasPage);
router.get(`${constants.contextURL}/chatbot`, templates.chatbotPage);

/* Rutas para administradores */
router.get(`${constants.contextURL}/dashboard`, requireAdmin, templates.dashboardPage);
router.get(`${constants.contextURL}/gestion_usuario`, requireAdmin, templates.gestionUsuarioPage);
router.get(`${constants.contextURL}/gestion_ap`, requireAdmin, templates.gestionAPPage);
router.get(`${constants.contextURL}/metricas`, requireAdmin, templates.metricasPage);
router.get(`${constants.contextURL}/numAP`, requireAdmin, templates.numAPPage);
router.get(`${constants.contextURL}/numBiomos`, requireAdmin, templates.numBiomosPage);
router.get(`${constants.contextURL}/crearEcoRanger`, requireAdmin, templates.crearEcoRangerPage);
router.get(`${constants.contextURL}/editarEcoRanger`, requireAdmin, templates.editarEcoRangerPage);
router.get(`${constants.contextURL}/viewEcoRanger`, requireAdmin, templates.viewEcoRangerPage);

/* ------------------------ USUARIOS API ------------------------ */
router.post(`${constants.contextURL}${constants.apiURL}/login`, usersRest.execLogin);

router.post(
  `${constants.contextURL}${constants.apiURL}/register`, 
  upload.single('profileImg'), // Middleware para subir una única imagen
  usersRest.publicRegisterUser
);


router.post(`${constants.contextURL}${constants.apiURL}/recuperar`, usersRest.recuperarPassword);
router.post(`${constants.contextURL}${constants.apiURL}/verificar-token`, usersRest.verificarTokenRecuperacion);
router.post(`${constants.contextURL}${constants.apiURL}/restablecer-password`, usersRest.restablecerPassword);

router.get(
  `${constants.contextURL}${constants.apiURL}/getUsers`,
  usersRest.authenticateToken,
  requireAdmin,
  usersRest.getUsers
);

router.post(
  `${constants.contextURL}${constants.apiURL}/findUser`,
  usersRest.authenticateToken,
  requireUser,
  usersRest.findUser
);

router.post(
  `${constants.contextURL}${constants.apiURL}/insertUser`,
  usersRest.authenticateToken,
  requireAdmin,
  usersRest.insertUser
);

router.put(
  `${constants.contextURL}${constants.apiURL}/updateUser`,
  usersRest.authenticateToken,
  requireUser,
  upload.single('profileImg'), // Middleware para subir una única imagen
  usersRest.updateUser
);
router.delete(
  `${constants.contextURL}${constants.apiURL}/deleteUser`,
  usersRest.authenticateToken,
  requireAdmin,
  usersRest.deleteUser
);


/* ------------------------ ANTEPROYECTOS API ------------------------ */
router.use(`${constants.contextURL}${constants.apiURL}`, anteproyectosRest);

/* ------------------------ REGISTROS GENERALES Y FORMULARIOS BIOMONITOR ------------------------ */

// Generales
router.get("/registro", formsRest.getRegistros);
router.post("/subirRegistro", usersRest.authenticateToken, requireUser, formsRest.postRegistros);

// Variables Climáticas
router.get("/registro/getVariableClimatica", formsRest.getVariablesClimatica);
router.post("/registro/subirVariableClimatica", formsRest.postVariablesClimatica);

// Parcela Vegetación
router.get("/registro/ParcelaVegetacion", formsRest.getParcelaVegetacion);
router.post("/registro/subirParcelaVegetacion", formsRest.postParcelaVegetacion);

// Cámaras Trampa
router.get("/registro/CamarasTrampa", formsRest.getCamarasTrampa);
router.post("/registro/subirCamarasTrampa", formsRest.postCamarasTrampa);

// Validación Cobertura
router.get("/registro/ValidacionCobertura", formsRest.getValidacionCobertura);
router.post("/registro/subirValidacionCobertura", formsRest.postValidacionCobertura);

// Fauna Transecto
router.get("/registro/FaunaTransecto", formsRest.getFaunaTransecto);
router.post("/registro/subirFaunaTransecto", formsRest.postFaunaTransecto);

// Fauna Punto de Conteo
router.get("/registro/FaunaPuntoConteo", formsRest.getFaunaPuntoConteo);
router.post("/registro/subirFaunaPuntoConteo", formsRest.postFaunaPuntoConteo);

// Fauna Búsqueda Libre
router.get("/registro/FaunaBusquedaLibre", formsRest.getBusquedaLibre);
router.post("/registro/subirFaunaBusquedaLibre", formsRest.postBusquedaLibre);

/* ------------------------ SUBIDA DE IMÁGENES ------------------------ */
router.post(
  "/registro/subirImagen",
  usersRest.authenticateToken,
  requireUser,
  upload.array("imagen", 5),
  imageRest.subirImagen 
);

/* ------------------------ CONVOCATORIAS ------------------------ */
// router.use('/awaq/api', convocatoriasRest);
router.use(`${constants.contextURL}${constants.apiURL}`, convocatoriasRest);


// Exporta el router para usarlo en el servidor principal
module.exports = router;