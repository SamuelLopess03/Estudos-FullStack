import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

import razorpayInstance from "../config/razorpay.js";

import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a Valid Email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Enter a Strong Password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Does Not Exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "User Profile Fetched Successfully",
      userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Missing Details",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.status(200).json({
      success: true,
      message: "User Profile Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, slotDate, slotTime } = req.body;

    const doctorData = await doctorModel.findById(doctorId).select("-password");

    if (!doctorData.available) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available",
      });
    }

    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({
          success: false,
          message: "Slot not Available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete doctorData.slots_booked;

    const appoinmentData = {
      userId,
      doctorId,
      slotDate,
      slotTime,
      userData,
      docData: doctorData,
      amount: doctorData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appoinmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(doctorId, {
      slots_booked,
    });

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;

    const appointments = await appointmentModel.find({ userId });

    res.status(200).json({
      success: true,
      message: "Appointments Fetched Successfully",
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (appointment.userId !== userId) {
      return res.status(400).json({
        success: false,
        message: "Unuthorized Action",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { doctorId, slotDate, slotTime } = appointment;

    const doctorData = await doctorModel.findById(doctorId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (item) => item !== slotTime
    );

    await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });

    res.status(200).json({
      success: true,
      message: "Appointment Cancelled Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment Cancelled or Not Found",
      });
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.RAZORPAY_CURRENCY,
      receipt: appointmentId,
    };

    console.log(options);

    const order = await razorpayInstance.orders.create(options);

    console.log(order);

    res.status(201).json({
      success: true,
      message: "Payment Initiated Successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.status(200).json({
        success: true,
        message: "Payment Successfull",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment Failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
