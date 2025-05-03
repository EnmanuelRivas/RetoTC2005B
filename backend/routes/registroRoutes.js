import { Router } from 'express';
import { getRegistro, postRegistro, getVariableClimatica, postVariableClimatica } from "../controllers/registros.controllers.js";
import { getUsuarios, postUsuario, postLogin } from "../controllers/registroUsuario.controllers.js"; // Importamos los controladores

const router = Router();

router.get("/getUsuario", getUsuarios);
router.post("/postUsuario", postUsuario); // Ruta para registrar un nuevo usuario
router.post("/postLogin", postLogin); // Ruta para iniciar sesión

router.get("/registro", getRegistro);
router.post("/subirRegistro", postRegistro);
router.get("/registro/variableClimatica", getVariableClimatica);
router.post("/registro/subirVariableClimatica", postVariableClimatica);

export default router;
