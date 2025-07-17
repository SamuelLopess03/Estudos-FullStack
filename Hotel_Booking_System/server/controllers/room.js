import { v2 as cloudinary } from "cloudinary";

import hotel from "../models/hotel.js";
import room from "../models/room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotelData = await hotel.findOne({ owner: req.auth.userId });

    if (!hotelData) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not Found" });
    }

    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    await room.create({
      hotel: hotelData._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res
      .status(201)
      .json({ success: true, message: "Room Created Successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await room
      .find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await hotel.findOne({ owner: req.auth.userId });
    const rooms = await room
      .find({ hotel: hotelData._id.toString() })
      .populate("hotel");

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const roomData = await room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;

    await roomData.save();

    res
      .status(200)
      .json({ success: true, message: "Room Availability Updated" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: error.message });
  }
};
