import express from "express";
import cors from "cors";
import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";

import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

connectDB();

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/clerk", clerkWebhooks);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
