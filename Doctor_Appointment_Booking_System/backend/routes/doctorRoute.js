import express from "express";

import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);

doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.put("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.put("/cancel-appointment", authDoctor, appointmentCancel);

doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

export default doctorRouter;
