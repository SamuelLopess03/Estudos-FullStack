import { protectRoute } from "../middlewares/auth.js";
import {
  getUsersForSidebar,
  getMessages,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/message.js";

import express from "express";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
