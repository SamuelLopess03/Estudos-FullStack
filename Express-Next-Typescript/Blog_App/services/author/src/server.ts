import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import { sql } from "./utils/db.js";
import { connectRabbitMQ } from "./utils/rabbitMQ.js";

import blogRoutes from "./routes/blog.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function initDB() {
  try {
    await sql`
            CREATE TABLE IF NOT EXISTS blogs(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                blogcontent TEXT NOT NULL,
                image VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS comments(
                id SERIAL PRIMARY KEY,
                comment VARCHAR(255) NOT NULL,
                userid VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                blogid VARCHAR(255) NOT NULL,
                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS savedblogs(
                id SERIAL PRIMARY KEY,
                userid VARCHAR(255) NOT NULL,
                blogid VARCHAR(255) NOT NULL,
                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    console.log("Database Initialized Successfully");
  } catch (error) {
    console.error("Error initDB: ", error);
  }
}

connectRabbitMQ();

const app = express();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use("/api/v1", blogRoutes);

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
  });
});
