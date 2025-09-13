import jwt from "jsonwebtoken";
import { config } from "../config.js";

export default function auth(req, res, next) {
  const h = req.header("Authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Auth required" });

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
