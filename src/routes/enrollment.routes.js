import { Router } from "express";
import { body } from "express-validator";
import {
  createEnrollment,
  listEnrollments,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const r = Router();

const createValidators = [
  body("studentId").notEmpty().withMessage("studentId requerido"),
  body("courseId").notEmpty().withMessage("courseId requerido"),
];

// Rutas públicas para consultar matrículas
r.get("/", listEnrollments);

// Rutas protegidas para crear / eliminar
r.post("/", authRequired, createValidators, createEnrollment);
r.delete("/:id", authRequired, deleteEnrollment);

export default r;
