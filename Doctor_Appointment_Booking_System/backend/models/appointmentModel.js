import moogoose from "mongoose";

const appointmentSchema = new moogoose.Schema({
  userId: { type: String, required: true },
  doctorId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const appointmentModel =
  moogoose.models.appointment ||
  moogoose.model("appointment", appointmentSchema);

export default appointmentModel;
