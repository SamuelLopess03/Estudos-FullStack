import express from "express";

import { protect } from "../middlewares/auth.js";
import { getUserData } from "../controllers/user";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);

export default userRouter;
