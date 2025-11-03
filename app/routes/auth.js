import express from "express";


const router = express.Router();
import { register, login } from "../controllers/auth.js";


// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para iniciar sesión
router.post("/login", login);
export default router;