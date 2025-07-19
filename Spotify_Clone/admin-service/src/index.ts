import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import cloudinary from "cloudinary";
import redis from "redis";

import { sql } from "./configs/db.js";
import adminRoutes from "./route.js";

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

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255),
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    console.log("Database Initialized Successfully");
  } catch (error) {
    console.log("Error InitDB: ", error);
  }
}

const app = express();

const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());

app.use("/api/v1", adminRoutes);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
