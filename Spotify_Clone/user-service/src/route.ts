import express from "express";

import { registerUser } from "./controller.js";

const router = express.Router();

router.post("/user/register", registerUser);

export default router;
