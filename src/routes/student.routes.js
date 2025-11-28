import { Router } from "express";
import { body } from "express-validator";
import {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const r = Router();

const createOrUpdateValidators = [
  body("firstName").trim().notEmpty().withMessage("firstName requerido"),
  body("lastName").trim().notEmpty().withMessage("lastName requerido"),
  body("email").isEmail().withMessage("email inválido"),
  body("documentId").trim().notEmpty().withMessage("documentId requerido"),
  body("status").optional().isIn(["active", "inactive"]),
];

// Rutas públicas
r.get("/", listStudents);
r.get("/:id", getStudent);

// Rutas protegidas (requieren JWT)
r.post("/", authRequired, createOrUpdateValidators, createStudent);
r.put("/:id", authRequired, createOrUpdateValidators, updateStudent);
r.delete("/:id", authRequired, deleteStudent);

export default r;
