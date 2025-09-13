import { CronJob } from "cron";
import Portfolio from "../models/Portfolio.js";
import { fetchLatestNAV, updateLatestNAVInDb } from "../services/navService.js";

export default function startCron() {
  const job = new CronJob(
    "0 0 0 * * *", // midnight IST
    async () => {
      console.log("Starting NAV update...");
      const schemeCodes = await Portfolio.distinct("schemeCode");
      for (const sc of schemeCodes) {
        const nav = await fetchLatestNAV(sc);
        if (nav) await updateLatestNAVInDb(nav);
      }
      console.log("✅ NAV update done");
    },
    null,
    true,
    "Asia/Kolkata"
  );
  job.start();
}
