import express from "express";

import {
  registerUser,
  loginUser,
  myProfile,
  addPlaylist,
} from "./controller.js";
import { isAuth } from "./middleware.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

router.get("/user/me", isAuth, myProfile);

router.post("/song/:id", isAuth, addPlaylist);

export default router;
