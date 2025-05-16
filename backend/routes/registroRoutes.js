// routes/registro.routes.js
import { Router } from "express";
import { getRegistro, postRegistro, getVariableClimatica, postVariableClimatica } from "../controllers/registros.controllers.js";
import { getUsuarios, postUsuario, postLogin } from "../controllers/registroUsuario.controllers.js";
import upload from "../middlewares/upload.middleware.js";
import { subirImagen } from "../controllers/cargaImagenes.controller.js";

const router = Router();

router.get("/getUsuario", getUsuarios);
router.post("/postUsuario", postUsuario);
router.post("/postLogin", postLogin);

router.get("/registro", getRegistro);
router.post("/subirRegistro", postRegistro);
router.get("/registro/variableClimatica", getVariableClimatica);
router.post("/registro/subirVariableClimatica", postVariableClimatica);

router.post("/registro/subirImagen", upload.array("imagen", 5), subirImagen);


export default router;
