import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./route.js";

dotenv.config();

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "spotify",
    });
  } catch (error) {
    console.error(error);
  }
};

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is Working!");
});

app.use("/api/v1", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
