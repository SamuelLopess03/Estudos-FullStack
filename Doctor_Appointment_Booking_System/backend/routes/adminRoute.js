import express from "express";

import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  AppointmentCancel,
  adminDashboard,
} from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";

import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, allDoctors);

adminRouter.put("/change-availability", authAdmin, changeAvailability);

adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.put("/cancel-appointment", authAdmin, AppointmentCancel);
adminRouter.get("/admin-dashboard", authAdmin, adminDashboard);

export default adminRouter;
