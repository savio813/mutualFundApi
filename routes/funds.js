import express from "express";
import axios from "axios";
import { config } from "../config.js";

const router = express.Router();

// List/search funds
router.get("/", async (req, res) => {
  const q = req.query.search || "";
  const resp = await axios.get(`${config.mfapiBase}/mf`);
  let funds = resp.data || [];
  if (q) funds = funds.filter(f => f.scheme.toLowerCase().includes(q.toLowerCase()));
  res.json({ success: true, data: funds.slice(0, 20) });
});

// NAV history
router.get("/:schemeCode/nav", async (req, res) => {
  const sc = req.params.schemeCode;
  const resp = await axios.get(`${config.mfapiBase}/mf/${sc}`);
  res.json({ success: true, data: resp.data });
});

export default router;
