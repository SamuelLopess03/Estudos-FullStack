import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

    channel = await connection.createChannel();

    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to Connect to RabbitMQ", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.error("RabbitMQ Channel is not Initialized");

    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

export const invalidateCacheJob = async (cacheKeys: string[]) => {
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
    };

    await publishToQueue("cache-invalidation", message);

    console.log("Cache Invalidation Job Published to RabbitMQ");
  } catch (error) {
    console.error("Failed to Publish Cache on RabbitMQ", error);
  }
};
