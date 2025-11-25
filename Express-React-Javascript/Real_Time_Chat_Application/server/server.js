import express from "express";
import cors from "cors";
import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";

// Create Express App and HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store Online Users
export const userSocketMap = {};

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit Online Users to all Connected Clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is Live"));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export Server for Vercel
export default server;
