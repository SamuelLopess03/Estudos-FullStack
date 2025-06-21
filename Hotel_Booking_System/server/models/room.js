import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    hotel: { type: String, required: true, ref: "hotel" },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const room = mongoose.model("room", roomSchema);

export default room;
