const express = require("express");
const constants = require("../constants");

const usersRest = require("../API/usersRestController");
const formsRest = require("../API/formsRestController");
const imageRest = require("../API/imageRestController");
const templates = require("../Templates/templates");
const upload = require("../middleware/upload.middleware");

const { requireAdmin, requireUser } = require("../middleware/auth.middleware");

const router = express.Router();

/* ------------------------ TEMPLATES ROUTES ------------------------ */
router.get(constants.indexURL, templates.index);
router.get(constants.contextURL, templates.loginPage);

/* Rutas de la página */
router.get(`${constants.contextURL}/registro`, templates.registroPage);
router.get(`${constants.contextURL}/dashboard`, templates.dashboardPage);
router.get(`${constants.contextURL}/home`, templates.homePage);
router.get(`${constants.contextURL}/perfil`, templates.perfilPage);
router.get(`${constants.contextURL}/AsistenteBiomo`, templates.asistenteBiomoPage);
router.get(`${constants.contextURL}/AsistenteConvocatorias`, templates.asistenteConvocatoriasPage);
router.get(`${constants.contextURL}/AsistenteExplorador`, templates.asistenteExploradorPage);
router.get(`${constants.contextURL}/AsistenteProyectos`, templates.asistenteProyectosPage);

/* ------------------------ USUARIOS API ------------------------ */
router.post(`${constants.contextURL}${constants.apiURL}/login`, usersRest.execLogin);
router.post(`${constants.contextURL}${constants.apiURL}/register`, usersRest.publicRegisterUser);

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
  usersRest.updateUser
);
router.delete(
  `${constants.contextURL}${constants.apiURL}/deleteUser`,
  usersRest.authenticateToken,
  requireAdmin,
  usersRest.deleteUser
);

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

// Exporta el router para usarlo en el servidor principal
module.exports = router;
