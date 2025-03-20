import express from "express";
import cron from "node-cron";

import { consumer } from "@/services/consumer";
import { connectDynamo } from "./services/db/connectDb";
import * as dotenv from "dotenv";
import router from "./services/route";
import { fetchAndQueueNews } from "./services/newsService";

const app = express();
app.use(express.json());
dotenv.config();
const CATEGORIES = [
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

app.use("/api", router);

consumer();
connectDynamo();

cron.schedule("*/10 * * * * *", async () => {
  console.log("⏳ Running news fetch every 10 seconds...");

  for (const category of CATEGORIES) {
    await fetchAndQueueNews(category);
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
module.exports = app;
