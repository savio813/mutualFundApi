import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  schemeCode: { type: Number, index: true },
  nav: Number,
  date: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("FundNavHistory", historySchema);
