import { Router } from 'express';
// import { getRegistro,postRegistro, getVariableClimatica, postVariableClimatica } from "../controllers/registrosControllers.js";
import { getUsuarios, postUsuario, postLogin } from "../controllers/registroUsuario.controllers.js"; // Importamos los controladores

const router = Router();

router.get("/getUsuario", getUsuarios);
router.post("/postUsuario", postUsuario); // Ruta para registrar un nuevo usuario
router.post("/postLogin", postLogin); // Ruta para iniciar sesión

// router.gjet("/registro", getRegistro);
// router.post("/registro", postRegistro);
// router.get("/registro/variableclimatica", getVariableClimatica);
// router.post("/registro/variableclimatica", postVariableClimatica);

export default router;
