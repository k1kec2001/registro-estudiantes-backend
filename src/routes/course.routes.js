import { Router } from "express";
import { body } from "express-validator";
import {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const r = Router();
const createOrUpdateValidators  = [
  body("code").trim().notEmpty(),
  body("name").trim().notEmpty(),
  body("credits").optional().isInt({ min: 0 }),
  body("status").optional().isIn(["active", "inactive"]),
];

// Rutas públicas
r.get("/", listCourses);
r.get("/:id", getCourse);

// Rutas protegidas con JWT
r.post("/", authRequired, createOrUpdateValidators, createCourse);
r.put("/:id", authRequired, createOrUpdateValidators, updateCourse);
r.delete("/:id", authRequired, deleteCourse);

export default r;