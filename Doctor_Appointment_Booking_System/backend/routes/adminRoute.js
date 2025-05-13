import express from "express";

import {
  addDoctor,
  allDoctors,
  loginAdmin,
} from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";

import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, allDoctors);

adminRouter.put("/change-availability", authAdmin, changeAvailability);

export default adminRouter;
