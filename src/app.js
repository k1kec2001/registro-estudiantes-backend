import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config.js";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/student.routes.js";
import courseRoutes from "./routes/course.routes.js";
import authRoutes from "./routes/auth.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";

import path from "path";
import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_req, res) =>
  res.json({ ok: true, msg: "API Registro Estudiantes" })
);

// Rutas

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`));
});
