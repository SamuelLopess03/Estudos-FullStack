import hotel from "../models/hotel.js";
import user from "../models/user.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    const hoteData = await hotel.findOne({ owner });
    if (hoteData) {
      return res.status(400).json({
        success: false,
        message: "Hotel Already Registered",
      });
    }

    await hotel.create({
      name,
      address,
      contact,
      city,
      owner,
    });

    await user.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.status(201).json({
      success: true,
      message: "Hotel Registered Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
