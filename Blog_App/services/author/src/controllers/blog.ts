import { Response } from "express";
import cloudinary from "cloudinary";

import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import tryCatch from "../utils/tryCatch.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";

export const createBlog = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, blogcontent, category } = req.body;

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

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    const result = await sql`
        INSERT INTO blogs (title, description, image, blogcontent, category, author) VALUES (${title},
        ${description}, ${cloud.secure_url}, ${blogcontent}, ${category}, ${req.user?._id}) RETURNING *
    `;

    res.status(201).json({
      message: "Blog Created Successfully",
      blog: result[0],
    });
  }
);
