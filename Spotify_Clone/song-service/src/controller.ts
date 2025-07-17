import { sql } from "./configs/db.js";
import tryCatch from "./tryCatch.js";

export const getAllAlbum = tryCatch(async (req, res) => {
  let albums;

  albums = await sql`SELECT * FROM albums`;

  res.status(200).json(albums);
});

export const getAllSongs = tryCatch(async (req, res) => {
  let songs;

  songs = await sql`SELECT * FROM songs`;

  res.status(200).json(songs);
});

export const getAllSongsOfAlbum = tryCatch(async (req, res) => {
  const { id } = req.params;

  let album, songs;

  album = await sql`SELECT * FROM albums WHERE id = ${id}`;

  if (album.length === 0) {
    res.status(404).json({
      message: "No Album With This ID",
    });

    return;
  }

  songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;

  const response = { songs, album: album[0] };

  res.status(200).json(response);
});

export const getSingleSong = tryCatch(async (req, res) => {
  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

  if (song.length === 0) {
    res.status(404).json({
      message: "No Song With This ID",
    });

    return;
  }

  res.status(200).json(song[0]);
});
