import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";

// Create Express App and HTTP Server
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is Live"));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
