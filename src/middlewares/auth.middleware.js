import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  try {
    // Leer header Authorization: "Bearer xxxxx"
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({ msg: "No token, autorización denegada" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error en authRequired:", err.message);
    return res.status(401).json({ msg: "Token inválido" });
  }
}
