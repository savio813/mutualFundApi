import axios from "axios";
import { config } from "../config.js";
import FundLatestNav from "../models/FundLatestNav.js";
import FundNavHistory from "../models/FundNavHistory.js";

export async function fetchLatestNAV(schemeCode) {
  const resp = await axios.get(`${config.mfapiBase}/mf/${schemeCode}/latest`);
  const d = resp.data?.data;
  if (!d) return null;
  return { schemeCode, nav: Number(d.nav), date: d.date };
}

export async function updateLatestNAVInDb(obj) {
  if (!obj) return;
  await FundLatestNav.updateOne(
    { schemeCode: obj.schemeCode },
    { $set: { nav: obj.nav, date: obj.date, updatedAt: new Date() } },
    { upsert: true }
  );
  await FundNavHistory.updateOne(
    { schemeCode: obj.schemeCode, date: obj.date },
    { $set: { schemeCode: obj.schemeCode, nav: obj.nav } },
    { upsert: true }
  );
}
