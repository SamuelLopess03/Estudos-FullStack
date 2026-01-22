import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import tryCatch from "./tryCatch.js";

import { User } from "./model.js";
import { AuthenticatedRequest } from "./middleware.js";

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

export const loginUser = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User Not Exists",
    });

    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({
      message: "Invalid Credentials",
    });

    return;
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    message: "User Logged In",
    user,
    token,
  });
});

export const myProfile = tryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  res.status(200).json(user);
});

export const addPlaylist = tryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({
      message: "User Not Exists",
    });

    return;
  }

  if (user?.playlist.includes(req.params.id)) {
    const index = user.playlist.indexOf(req.params.id);

    user.playlist.splice(index, 1);

    await user.save();

    res.status(200).json({
      message: "Removed from Playlist",
    });

    return;
  }

  user.playlist.push(req.params.id);

  await user.save();

  res.status(200).json({
    message: "Added to Playlist",
  });
});
