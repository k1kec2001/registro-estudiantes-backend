import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config.js";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/student.routes.js";
import courseRoutes from "./routes/course.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) =>
  res.json({ ok: true, msg: "API Registro Estudiantes" })
);

// Rutas
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`));
});
