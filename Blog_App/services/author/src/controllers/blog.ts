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

export const updateBlog = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, blogcontent, category } = req.body;

    const file = req.file;

    const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

    if (!blog.length) {
      res.status(404).json({
        message: "No Blog With This ID",
      });

      return;
    }

    if (blog[0].author !== req.user?._id) {
      res.status(403).json({
        message: "You Are Not Author of This Blog",
      });

      return;
    }

    let imageUrl = blog[0].image;

    if (file) {
      const fileBuffer = getBuffer(file);

      if (!fileBuffer || !fileBuffer.content) {
        throw new Error("Failed to Generate Buffer.");
      }

      const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "blogs",
      });

      imageUrl = cloud.secure_url;
    }

    const updatedBlog = await sql`
      UPDATE blogs SET title = ${title || blog[0].title}, description = ${
      description || blog[0].description
    },
      image = ${imageUrl}, blogcontent = ${
      blogcontent || blog[0].blogcontent
    }, category = ${category || blog[0].category}
      WHERE id = ${id} RETURNING *
    `;

    res.status(200).json({
      message: "Blog Updated Successfully",
      blog: updatedBlog[0],
    });
  }
);

export const deleteBlog = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

    if (!blog.length) {
      res.status(404).json({
        message: "No Blog With This ID",
      });

      return;
    }

    if (blog[0].author !== req.user?._id) {
      res.status(403).json({
        message: "You Are Not Author of This Blog",
      });

      return;
    }

    await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;

    res.status(200).json({
      message: "Blog Deleted Successfully",
    });
  }
);
