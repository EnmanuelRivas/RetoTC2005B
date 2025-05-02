import { Router } from 'express';
// import { getRegistro,postRegistro, getVariableClimatica, postVariableClimatica } from "../controllers/registrosControllers.js";
import { getUsuarios, postUsuario } from "../controllers/registroUsuario.controllers.js"; // Importamos los controladores

const router = Router();

router.get("/getUsuarios", getUsuarios);
router.post("/postUsuario", postUsuario); // Ruta para registrar un nuevo usuario


// router.gjet("/registro", getRegistro);
// router.post("/registro", postRegistro);
// router.get("/registro/variableclimatica", getVariableClimatica);
// router.post("/registro/variableclimatica", postVariableClimatica);

export default router;
