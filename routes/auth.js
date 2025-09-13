import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../config.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHash: hash });

    const token = jwt.sign({ id: u._id, email: u.email, role: u.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({ success: true, message: "User registered", token, user: { id: u._id, name: u.name, email: u.email } });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ success: false, message: "Invalid creds" });

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(400).json({ success: false, message: "Invalid creds" });

    const token = jwt.sign({ id: u._id, email: u.email, role: u.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({ success: true, message: "Login successful", token, user: { id: u._id, name: u.name, email: u.email } });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
