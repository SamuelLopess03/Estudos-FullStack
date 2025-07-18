import { Request } from "express";
import cloudinary from "cloudinary";

import tryCatch from "./tryCatch.js";
import getBuffer from "./configs/dataUri.js";
import { sql } from "./configs/db.js";
import { redisClient } from "./index.js";

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

  if (redisClient.isReady) {
    await redisClient.del("albums");

    console.log("Cache Invalidated for Albums");
  }

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

  if (redisClient.isReady) {
    await redisClient.del("songs");

    console.log("Cache Invalidated for Songs");
  }

  res.status(201).json({
    message: "Song Added Successfully",
  });
});

export const addThumbnail = tryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      message: "You are not Admin",
    });

    return;
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

  if (song.length === 0) {
    res.status(404).json({
      message: "No Song With This Id",
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

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

  const result = await sql`
    UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
  `;

  if (redisClient.isReady) {
    await redisClient.del("songs");

    console.log("Cache Invalidated for Songs");
  }

  res.status(200).json({
    message: "Thumbnail Added Successfully",
    song: result[0],
  });
});

export const deleteAlbum = tryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      message: "You are not Admin",
    });

    return;
  }

  const { id } = req.params;

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;

  if (isAlbum.length === 0) {
    res.status(404).json({
      message: "No Album With This Id",
    });

    return;
  }

  await sql`DELETE FROM songs WHERE album_id = ${id}`;

  await sql`DELETE FROM albums WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("albums");

    console.log("Cache Invalidated for Albums");
  }

  if (redisClient.isReady) {
    await redisClient.del("songs");

    console.log("Cache Invalidated for Songs");
  }

  res.status(200).json({
    message: "Album Deleted Successfully",
  });
});

export const deleteSong = tryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      message: "You are not Admin",
    });

    return;
  }

  const { id } = req.params;

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

  if (song.length === 0) {
    res.status(404).json({
      message: "No Song With This Id",
    });

    return;
  }

  await sql`DELETE FROM songs WHERE id = ${id}`;

  if (redisClient.isReady) {
    await redisClient.del("songs");

    console.log("Cache Invalidated for Songs");
  }

  res.status(200).json({
    message: "Song Deleted Successfully",
  });
});
