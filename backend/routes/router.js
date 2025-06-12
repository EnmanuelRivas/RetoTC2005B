const express = require("express");
const fs = require("fs");
const path = require("path");
const constants = require("../constants");

const usersRest = require("../API/usersRestController");
const formsRest = require("../API/formsRestController");
const imageRest = require("../API/imageRestController");
const templates = require("../Templates/templates");
const upload = require("../middleware/upload.middleware");
const anteproyectosRest = require("../API/anteproyectosRestController");
const convocatoriasRest = require('../API/convocatoriasRestController');
const supportRest = require('../API/supportRestController');
const metricasRest = require('../API/metricasRestController');

const { requireAdmin, requireUser, requireAdminForPage, authenticateToken } = require("../middleware/auth.middleware");

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
router.get(`${constants.contextURL}/juego`, templates.juegoPage);

/* Rutas para administradores */
router.get(`${constants.contextURL}/dashboard`, requireAdminForPage, templates.dashboardPage);
router.get(`${constants.contextURL}/gestion_usuario`, requireAdminForPage, templates.gestionUsuarioPage);
router.get(`${constants.contextURL}/gestion_ap`, requireAdminForPage, templates.gestionAPPage);
router.get(`${constants.contextURL}/gestion_soporte`, requireAdminForPage, templates.gestionSoportePage);
router.get(`${constants.contextURL}/metricas`, requireAdminForPage, templates.metricasPage);
router.get(`${constants.contextURL}/numAP`, requireAdminForPage, templates.numAPPage);
router.get(`${constants.contextURL}/numBiomos`, requireAdminForPage, templates.numBiomosPage);
router.get(`${constants.contextURL}/crearEcoRanger`, requireAdminForPage, templates.crearEcoRangerPage);
router.get(`${constants.contextURL}/editarEcoRanger`, requireAdminForPage, templates.editarEcoRangerPage);
router.get(`${constants.contextURL}/viewEcoRanger`, requireAdminForPage, templates.viewEcoRangerPage);

/* ------------------------ USUARIOS API ------------------------ */
router.post(`${constants.contextURL}${constants.apiURL}/login`, usersRest.execLogin);

router.post(
  `${constants.contextURL}${constants.apiURL}/register`, 
  upload.single('profileImg'), // Middleware para subir una única imagen
  usersRest.publicRegisterUser
);

router.post(
  `${constants.contextURL}${constants.apiURL}/usuarios/:id/rol`,
  authenticateToken,
  requireAdmin,
  usersRest.actualizarRol
);


router.post(`${constants.contextURL}${constants.apiURL}/recuperar`, usersRest.recuperarPassword);
router.post(`${constants.contextURL}${constants.apiURL}/verificar-token`, usersRest.verificarTokenRecuperacion);
router.post(`${constants.contextURL}${constants.apiURL}/restablecer-password`, usersRest.restablecerPassword);

router.get(
  `${constants.contextURL}${constants.apiURL}/getUsers`,
  authenticateToken,
  requireAdmin,
  usersRest.getUsers
);

router.post(
  `${constants.contextURL}${constants.apiURL}/findUser`,
  authenticateToken,
  requireUser,
  usersRest.findUser
);

router.post(
  `${constants.contextURL}${constants.apiURL}/insertUser`,
  authenticateToken,
  requireAdmin,
  usersRest.insertUser
);

router.put(
  `${constants.contextURL}${constants.apiURL}/updateUser`,
  authenticateToken,
  requireUser,
  upload.single('profileImg'), // Middleware para subir una única imagen
  usersRest.updateUser
);

router.delete(
  `${constants.contextURL}${constants.apiURL}/deleteUser`,
  authenticateToken,
  requireAdmin,
  usersRest.deleteUser
);

router.get(
  `${constants.contextURL}${constants.apiURL}/admin/stats`,
  authenticateToken,
  requireAdmin,
  usersRest.getAdminStats
);

// Profile routes
router.get(
  `${constants.contextURL}${constants.apiURL}/profile`,
  authenticateToken,
  requireUser,
  usersRest.getProfile
);

router.put(
  `${constants.contextURL}${constants.apiURL}/profile`,
  authenticateToken,
  requireUser,
  upload.single('profileImg'),
  usersRest.updateProfile
);

// Password update route
router.put(
  `${constants.contextURL}${constants.apiURL}/profile/password`,
  authenticateToken,
  requireUser,
  usersRest.updatePassword
);

// Serve profile images
router.get(
  `${constants.contextURL}/uploads/:imageName`,
  (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '../uploads', imageName);
    
    // Check if file exists
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  }
);

/* ------------------------ ANTEPROYECTOS API ------------------------ */
router.get(
  `${constants.contextURL}${constants.apiURL}/getAnteproyectos`,
  authenticateToken,
  requireUser,
  anteproyectosRest.getAnteproyectos
);

router.post(
  `${constants.contextURL}${constants.apiURL}/postAnteproyecto`,
  authenticateToken,
  requireUser,
  anteproyectosRest.postAnteproyecto
);

/* ------------------------ REGISTROS GENERALES Y FORMULARIOS BIOMONITOR ------------------------ */

// Generales
router.get("/registro", formsRest.getRegistros);
router.post("/subirRegistro", authenticateToken, requireUser, formsRest.postRegistros);

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
  authenticateToken,
  requireUser,
  upload.array("imagen", 5),
  imageRest.subirImagen 
);

/* ------------------------ CONVOCATORIAS API ------------------------ */
router.get(
  `${constants.contextURL}${constants.apiURL}/getConvocatorias`,
  authenticateToken,
  requireUser,
  convocatoriasRest.getConvocatorias
);

router.post(
  `${constants.contextURL}${constants.apiURL}/postConvocatoria`,
  authenticateToken,
  requireUser,
  convocatoriasRest.postConvocatoria
);

/* ------------------------ SOPORTE API ------------------------ */
// Crear nueva solicitud de soporte (público - no requiere autenticación)
router.post(
  `${constants.contextURL}${constants.apiURL}/support/ticket`,
  supportRest.createSupportTicket
);

// Obtener todos los tickets (solo admin)
router.get(
  `${constants.contextURL}${constants.apiURL}/support/tickets`,
  authenticateToken,
  requireAdmin,
  supportRest.getSupportTickets
);

// Obtener ticket específico (admin o propietario)
router.get(
  `${constants.contextURL}${constants.apiURL}/support/ticket/:id`,
  authenticateToken,
  requireUser,
  supportRest.getSupportTicket
);

// Responder a un ticket (solo admin)
router.put(
  `${constants.contextURL}${constants.apiURL}/support/ticket/:id/response`,
  authenticateToken,
  requireAdmin,
  supportRest.respondToTicket
);

/* ------------------------ Metricas API ------------------------ */
router.get(
  `${constants.contextURL}${constants.apiURL}/getMetricas`,
  authenticateToken,
  requireUser,
  metricasRest.obtenerMetricas
);

// Exporta el router para usarlo en el servidor principal
module.exports = router;