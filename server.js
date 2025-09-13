import express from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";

import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import fundsRoutes from "./routes/funds.js";
import startCron from "./cron/updateNavCron.js";

const app = express();
app.use(express.json());

// Rate limiting
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/funds", fundsRoutes);

app.get("/", (req, res) => res.json({ success: true, message: "Mutual Fund API Running" }));

// Start server + DB
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("✅ MongoDB connected");
    startCron();
    app.listen(config.port, () => console.log(`🚀 Server running on ${config.port}`));
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });
