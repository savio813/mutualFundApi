import mongoose from "mongoose";

const latestNavSchema = new mongoose.Schema({
  schemeCode: { type: Number, unique: true, required: true },
  nav: Number,
  date: String,
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("FundLatestNav", latestNavSchema);
