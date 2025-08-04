import express from "express";
import dotenv from "dotenv";
import { createClient } from "redis";

import blogRoutes from "./routes/blog.js";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);

const app = express();

const port = process.env.PORT || 5002;

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
