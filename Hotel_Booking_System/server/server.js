import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
