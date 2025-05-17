import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
} from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.put(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);

userRouter.post("/book-appointment", authUser, bookAppointment);

export default userRouter;
