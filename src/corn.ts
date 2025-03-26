import { fetchAndQueueNews } from "./services/newsService";

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
for (const category of CATEGORIES) {
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

  async function run() {
    for (const category of CATEGORIES) {
      await fetchAndQueueNews(category);
    }
  }

  run().catch((error) => {
    console.error("Error running the script:", error);
  });
}
