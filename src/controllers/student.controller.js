import Student from "../models/Student.js";
import { validationResult } from "express-validator";

export const createStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ msg: "email o documentId ya existen" });
    res.status(500).json({ msg: "Error creando estudiante" });
  }
};

export const listStudents = async (req, res) => {
  const { q = "", page = 1, limit = 10, status } = req.query;
  const filter = {
    $or: [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { documentId: { $regex: q, $options: "i" } },
    ]
  };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Student.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getStudent = async (req, res) => {
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({ msg: "No encontrado" });
  res.json(s);
};

export const updateStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!s) return res.status(404).json({ msg: "No encontrado" });
  res.json(s);
};

export const deleteStudent = async (req, res) => {
  const s = await Student.findByIdAndDelete(req.params.id);
  if (!s) return res.status(404).json({ msg: "No encontrado" });
  res.json({ msg: "Eliminado" });
};
