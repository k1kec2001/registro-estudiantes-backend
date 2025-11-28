import { Router } from "express";
import { body } from "express-validator";
import { register, login, profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = Router();

// Registro (solo para pruebas; luego podrías limitarlo)
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Nombre requerido"),
    body("email").isEmail().withMessage("Correo inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("role").optional().isIn(["admin", "teacher"]),
  ],
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Correo inválido"),
    body("password").notEmpty().withMessage("Contraseña requerida"),
  ],
  login
);

// Perfil (ruta protegida)
router.get("/profile", authRequired, profile);

export default router;
