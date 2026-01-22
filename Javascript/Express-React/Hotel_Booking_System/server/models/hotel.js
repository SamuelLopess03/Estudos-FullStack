import mongoose from "mongoose";

const hotelSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    owner: { type: String, required: true, ref: "user" },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

const hotel = mongoose.model("hotel", hotelSchema);

export default hotel;
