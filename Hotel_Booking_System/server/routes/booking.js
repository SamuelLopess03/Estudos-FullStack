import express from "express";

import { protect } from "../middlewares/auth.js";

import {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getHotelBookings,
} from "../controllers/booking.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getHotelBookings);

export default bookingRouter;
