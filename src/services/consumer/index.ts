// import { FEED_NEWS } from "../db/schema/news";
import { FeedNews } from "../db/schema/news";
import { summarizeNews } from "../newsService";

const amqp = require("amqp-connection-manager");
export let connection;
export let channel;

export const consumer = async () => {
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

    channel.consume(
      "NEWS_CATEGORY",
      async (msg) => {
        if (msg) {
          const messageContent = JSON.parse(msg.content.toString());

          const data = await summarizeNews(messageContent);

          console.log(data);

          const existingNews = await FeedNews.findOne({ title: data.title });
          if (!existingNews) {
            const fluffy = new FeedNews({ ...data });
            await fluffy.save();
          }

          channel.ack(msg);
        }
      },

      { noAck: false }
    );
  } catch (error) {
    console.log(error);
  }
};
