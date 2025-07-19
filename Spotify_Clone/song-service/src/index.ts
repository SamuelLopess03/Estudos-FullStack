import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import redis from "redis";

import songRouter from "./route.js";

dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-16936.c308.sa-east-1-1.ec2.redns.redis-cloud.com",
    port: 16936,
  },
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(console.error);

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());

app.use("/api/v1", songRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
