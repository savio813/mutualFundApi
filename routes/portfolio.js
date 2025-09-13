import express from "express";
import auth from "../middleware/auth.js";
import Portfolio from "../models/Portfolio.js";
import FundLatestNav from "../models/FundLatestNav.js";
import Fund from "../models/Fund.js";

const router = express.Router();

// Add
router.post("/add", auth, async (req, res) => {
  const { schemeCode, units } = req.body;
  if (!schemeCode || !units || units <= 0)
    return res.status(400).json({ success: false, message: "Invalid input" });

  const p = await Portfolio.create({ userId: req.user.id, schemeCode, units });
  const fund = await Fund.findOne({ schemeCode });
  res.json({ success: true, message: "Added", portfolio: { id: p._id, schemeCode, units, schemeName: fund?.schemeName } });
});

// List
router.get("/list", auth, async (req, res) => {
  const holdings = await Portfolio.find({ userId: req.user.id }).lean();
  const navs = await FundLatestNav.find({ schemeCode: { $in: holdings.map(h => h.schemeCode) } }).lean();
  const navMap = Object.fromEntries(navs.map(n => [n.schemeCode, n]));

  const results = holdings.map(h => {
    const n = navMap[h.schemeCode];
    const currentValue = n ? +(n.nav * h.units).toFixed(2) : null;
    return { schemeCode: h.schemeCode, units: h.units, currentNav: n?.nav, currentValue };
  });

  res.json({ success: true, data: { totalHoldings: results.length, holdings: results } });
});

// Remove
router.delete("/remove/:schemeCode", auth, async (req, res) => {
  await Portfolio.deleteOne({ userId: req.user.id, schemeCode: Number(req.params.schemeCode) });
  res.json({ success: true, message: "Removed" });
});

export default router;
