import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import tryCatch from "./tryCatch.js";

import { User } from "./model.js";

export const registerUser = tryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    res.status(400).json({
      message: "User Already Exists",
    });

    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(201).json({
    message: "User Registered",
    user,
    token,
  });
});
