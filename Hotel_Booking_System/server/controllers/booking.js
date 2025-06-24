import booking from "../models/booking.js";
import hotel from "../models/hotel.js";

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;

    const bookings = await booking
      .find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const hotelData = await hotel.findOne({ owner: req.auth.userId });

    if (!hotelData) {
      return res.status(404).json({
        success: false,
        message: "Hotel not Found",
      });
    }

    const bookings = await booking
      .find({ hotel: hotelData._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.pricePerNight,
      0
    );

    res.status(200).json({
      success: true,
      dashboardData: {
        bookings,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    res.status(200).json({
      success: true,
      isAvailable,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Room is not Available",
      });
    }

    const roomData = await room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const bookingData = await booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Booking Created Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;

    return isAvailable;
  } catch (error) {
    console.error(error);
  }
};
