import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const QUEUE_NAME = "news_queue";

export async function publishToQueue(message: any) {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME);
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
  console.log("📩 News added to queue:", message.title);
  await channel.close();
  await conn.close();
}
