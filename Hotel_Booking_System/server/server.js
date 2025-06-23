import express from "express";
import cors from "cors";
import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/user.js";
import hotelRouter from "./routes/hotel.js";
import roomRouter from "./routes/room.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

connectCloudinary();
connectDB();

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/clerk", clerkWebhooks);
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
