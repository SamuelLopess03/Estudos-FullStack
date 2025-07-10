import { Request } from "express";
import cloudinary from "cloudinary";

import tryCatch from "./tryCatch.js";
import getBuffer from "./configs/dataUri.js";
import { sql } from "./configs/db.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const addAlbum = tryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      message: "You are not Admin",
    });

    return;
  }

  const { title, description } = req.body;

  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No File to Upload",
    });

    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    throw new Error("Failed to Generate File Buffer");
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });

  const result = await sql`
    INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
  `;

  res.status(201).json({
    message: "Album Created Successfully",
    album: result[0],
  });
});

export const addSong = tryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      message: "You are not Admin",
    });

    return;
  }

  const { title, description, album } = req.body;

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;

  if (isAlbum.length === 0) {
    res.status(404).json({
      message: "No Album With This Id",
    });

    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No File to Upload",
    });

    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    throw new Error("Failed to Generate File Buffer");
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });

  const result = await sql`
    INSERT INTO songs (title, description, audio, album_id) VALUES 
    (${title}, ${description}, ${cloud.secure_url}, ${album})
  `;

  res.status(201).json({
    message: "Song Added Successfully",
  });
});
