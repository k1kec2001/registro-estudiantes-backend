import { Router } from "express";
import { body } from "express-validator";
import { createCourse, listCourses, getCourse, updateCourse, deleteCourse } from "../controllers/course.controller.js";

const r = Router();
const validators = [
  body("code").trim().notEmpty(),
  body("name").trim().notEmpty(),
  body("credits").optional().isInt({ min: 0 }),
  body("status").optional().isIn(["active", "inactive"])
];

r.get("/", listCourses);
r.get("/:id", getCourse);
r.post("/", validators, createCourse);
r.put("/:id", validators, updateCourse);
r.delete("/:id", deleteCourse);

export default r;

