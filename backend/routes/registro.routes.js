import { Router } from 'express';
import { getRegistro,postRegistro, getVariableClimatica, postVariableClimatica } from "../controllers/registrosControllers.js";

const router = Router();

router.get("/registro", getRegistro);
router.post("/registro", postRegistro);
router.get("/registro/variableclimatica", getVariableClimatica);
router.post("/registro/variableclimatica", postVariableClimatica);

export default router;
