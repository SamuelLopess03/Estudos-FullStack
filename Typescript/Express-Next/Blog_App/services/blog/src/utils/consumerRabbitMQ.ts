import amqp from "amqplib";

import { redisClient } from "../server.js";
import { sql } from "./db.js";

interface CacheInvalidationMessage {
  action: string;
  keys: string[];
}

export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

    const channel = await connection.createChannel();

    const queueName = "cache-invalidation";

    await channel.assertQueue(queueName, { durable: true });

    console.log("Blog Service Cache Consumer Started");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(
            msg.content.toString()
          ) as CacheInvalidationMessage;

          console.log(
            "Blog Service Received Cache Invalidation Message",
            content
          );

          if (content.action === "invalidateCache") {
            for (const pattern of content.keys) {
              const keys = await redisClient.keys(pattern);

              if (keys.length > 0) {
                await redisClient.del(keys);

                console.log(
                  `Blog Service Invalidated ${keys.length} Cache Keys Matching: ${pattern}`
                );

                const category = "";
                const searchQuery = "";

                const cacheKey = `blogs:${searchQuery}:${category}`;

                const blogs = await sql`
                  SELECT * FROM blogs ORDER BY create_at DESC
                `;

                await redisClient.set(cacheKey, JSON.stringify(blogs), {
                  EX: 3600,
                });

                console.log("Cache Rebuilt With Key: ", cacheKey);
              }
            }
          }

          channel.ack(msg);
        } catch (error) {
          console.error(
            "Error Processing Cache Invalidation in Blog Service: ",
            error
          );

          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("Failed to Start RabbitMQ Consumer");
  }
};
