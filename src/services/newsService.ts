import axios from "axios";
import { OpenAI } from "@langchain/openai";
import { publishToQueue } from "./queueService";
import * as dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
const amqp = require("amqp-connection-manager");
export let connection;
export let channel;
dotenv.config();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  content: string;
  category: string;
  image: string;
  source: {
    name: string;
    url: string;
  };
  summary: string;
}

async function fetchLatestNews(category: string): Promise<NewsArticle[]> {
  try {
    connection = await amqp.connect(["amqp://localhost"]);
    const channel = await connection.createChannel({
      json: true,
      setup: function (channel) {
        return Promise.all([
          channel.assertQueue("NEWS_CATEGORY", { durable: true }),
        ]);
      },
    });
    const response = await axios.get(
      `https://gnews.io/api/v4/top-headlines?category=${category}&country=in&lang=hi&max=100&apikey=${GNEWS_API_KEY}`,
      {
        params: { category, token: GNEWS_API_KEY, lang: "en" },
      }
    );

    if (response?.data) {
      for (const article of response.data.articles) {
        channel
          .sendToQueue("NEWS_CATEGORY", {
            category,
            ...article,
          })
          .then(function () {
            return console.log("Message add to  NEWS_CATEGORY");
          })
          .catch(function (err) {
            return console.log("Message was rejected...  Boo!");
          });
      }
    }
  } catch (error) {
    console.error(
      `❌ Error fetching news for ${category}:`,
      (error as Error).message
    );
    return [];
  }
}

export async function summarizeNews(
  article: NewsArticle
): Promise<NewsArticle & { summary: string }> {
  try {
    const prompt = `Given the news article titled "${article.title}" with the content: "${article.content}", provide a clear and concise summary in exactly 60 words. Emphasize the key points and context of the news so readers get a comprehensive understanding.`;

    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 1,
      // It's more secure to use environment variables for API keys.
      apiKey: process.env.OPENAI_API_KEY,
    });

    const summary = await model.invoke([prompt]);

    const summaryText = Array.isArray(summary?.content)
      ? summary?.content
          .map((item) =>
            typeof item === "string"
              ? item
              : "text" in item
              ? item.text
              : String(item)
          )
          .join(" ")
      : String(summary?.content);
    return { ...article, summary: summaryText };
  } catch (error) {
    console.error("❌ Error summarizing news:", (error as Error).message);
    return { ...article, summary: "No summary available" };
  }
}

export async function fetchAndQueueNews(category: string) {
  const articles = await fetchLatestNews(category);
  //   for (const article of articles) {
  //     console.log(article);
  //     // const summarizedArticle = await summarizeNews(article);
  //     // await publishToQueue({ category, ...summarizedArticle });
  //   }
  console.log(`✅ Fetched and queued news for category: ${category}`);
}
