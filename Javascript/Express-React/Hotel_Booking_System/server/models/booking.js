import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    user: { type: String, required: true, ref: "user" },
    room: { type: String, required: true, ref: "room" },
    hotel: { type: String, required: true, ref: "hotel" },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true, default: "Pay At Hotel" },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const booking = mongoose.model("booking", bookingSchema);

export default booking;
