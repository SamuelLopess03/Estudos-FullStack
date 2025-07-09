import express from "express";
import dotenv from "dotenv";

import { sql } from "./configs/db.js";

dotenv.config();

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

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
