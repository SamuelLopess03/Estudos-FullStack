import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "redis";

import { startCacheConsumer } from "./utils/consumerRabbitMQ.js";

import blogRoutes from "./routes/blog.js";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);

startCacheConsumer();

const app = express();

const port = process.env.PORT || 5002;

app.use(express.json());
app.use(cors());

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
