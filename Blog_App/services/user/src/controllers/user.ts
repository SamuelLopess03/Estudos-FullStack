import { Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import tryCatch from "../utils/tryCatch.js";
import getBuffer from "../utils/dataUri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";

export const loginUser = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { email, name, image } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, image });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "5d",
    });

    res.status(200).json({
      message: "Login Success",
      token,
      user,
    });
  }
);

export const myProfile = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    res.status(200).json(user);
  }
);

export const getUserProfile = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "No User With This ID",
      });

      return;
    }

    res.status(200).json(user);
  }
);

export const updateUser = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, instagram, facebook, linkedin, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        name,
        instagram,
        facebook,
        linkedin,
        bio,
      },
      { new: true }
    );

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "5d",
    });

    res.status(200).json({
      message: "User Updated",
      token,
      user,
    });
  }
);

export const updateProfilePic = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No File to Upload",
      });

      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      throw new Error("Failed to Generate Buffer.");
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        image: cloud.secure_url,
      },
      {
        new: true,
      }
    );

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "5d",
    });

    res.status(200).json({
      message: "User Profile Pic Updated",
      token,
      user,
    });
  }
);
