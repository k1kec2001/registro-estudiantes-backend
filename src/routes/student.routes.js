import { Router } from "express";
import { body } from "express-validator";
import {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

const r = Router();

const createOrUpdateValidators = [
  body("firstName").trim().notEmpty().withMessage("firstName requerido"),
  body("lastName").trim().notEmpty().withMessage("lastName requerido"),
  body("email").isEmail().withMessage("email inválido"),
  body("documentId").trim().notEmpty().withMessage("documentId requerido"),
  body("status").optional().isIn(["active", "inactive"]),
];

r.get("/", listStudents);
r.get("/:id", getStudent);
r.post("/", createOrUpdateValidators, createStudent);
r.put("/:id", createOrUpdateValidators, updateStudent);
r.delete("/:id", deleteStudent);

export default r;
