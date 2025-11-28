import { validationResult } from "express-validator";
import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";

export const createEnrollment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { studentId, courseId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: "Estudiante no encontrado" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Curso no encontrado" });

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    const populated = await enrollment.populate("student course");

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ msg: "El estudiante ya está matriculado en este curso" });
    }
    console.error("Error creando matrícula:", err);
    res.status(500).json({ msg: "Error creando matrícula" });
  }
};

export const listEnrollments = async (req, res) => {
  const { studentId, courseId } = req.query;

  const filter = {};
  if (studentId) filter.student = studentId;
  if (courseId) filter.course = courseId;

  try {
    const enrollments = await Enrollment.find(filter)
      .populate("student")
      .populate("course")
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (err) {
    console.error("Error listando matrículas:", err);
    res.status(500).json({ msg: "Error listando matrículas" });
  }
};

export const deleteEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment) {
      return res.status(404).json({ msg: "Matrícula no encontrada" });
    }
    res.json({ msg: "Matrícula eliminada correctamente" });
  } catch (err) {
    console.error("Error eliminando matrícula:", err);
    res.status(500).json({ msg: "Error eliminando matrícula" });
  }
};
