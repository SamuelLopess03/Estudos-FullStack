import { protectRoute } from "../middlewares/auth.js";
import {
  getUsersForSidebar,
  getMessages,
  markMessageAsSeen,
} from "../controllers/message.js";

import express from "express";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

export default messageRouter;
