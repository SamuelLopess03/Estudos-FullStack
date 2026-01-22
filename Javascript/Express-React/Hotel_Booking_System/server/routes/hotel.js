import express from "express";

import { protect } from "../middlewares/auth.js";
import { registerHotel } from "../controllers/hotel.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel);

export default hotelRouter;
