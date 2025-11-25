import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import cloudinary from "./cloudinary.js";

/* ------ Functions Authentication ------ */
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);

  return token;
};

export const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  return decoded;
};

/* ------ Functions Password ------ */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    return isPasswordCorrect;
  } catch (error) {
    console.error(error);
  }
};

export const uploadImg = async (image) => {
  try {
    const upload = await cloudinary.uploader.upload(image);

    const urlSecureUpload = upload.secure_url;

    return urlSecureUpload;
  } catch (error) {
    console.error(error);
  }
};
