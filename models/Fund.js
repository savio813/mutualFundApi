import mongoose from "mongoose";

const fundSchema = new mongoose.Schema({
  schemeCode: { type: Number, unique: true, required: true },
  schemeName: String,
  fundHouse: String,
  schemeType: String,
  schemeCategory: String,
});

export default mongoose.model("Fund", fundSchema);
