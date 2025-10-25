import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true }, // p.ej. DEV101
    name: { type: String, required: true, trim: true },
    credits: { type: Number, default: 3, min: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
