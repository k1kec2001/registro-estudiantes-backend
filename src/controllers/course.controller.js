import Course from "../models/Course.js";
import { validationResult } from "express-validator";

export const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const c = await Course.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ msg: "code ya existe" });
    res.status(500).json({ msg: "Error creando curso" });
  }
};

export const listCourses = async (req, res) => {
  const { q = "", page = 1, limit = 10, status } = req.query;
  const filter = { $or: [{ code: { $regex: q, $options: "i" } }, { name: { $regex: q, $options: "i" } }] };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Course.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getCourse = async (req, res) => {
  const c = await Course.findById(req.params.id);
  if (!c) return res.status(404).json({ msg: "No encontrado" });
  res.json(c);
};

export const updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const c = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!c) return res.status(404).json({ msg: "No encontrado" });
  res.json(c);
};

export const deleteCourse = async (req, res) => {
  const c = await Course.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ msg: "No encontrado" });
  res.json({ msg: "Eliminado" });
};
