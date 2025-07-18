import { sql } from "./configs/db.js";
import { redisClient } from "./index.js";
import tryCatch from "./tryCatch.js";

export const getAllAlbum = tryCatch(async (req, res) => {
  let albums;
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    albums = await redisClient.get("albums");
  }

  if (albums) {
    console.log("Cache Hit");

    res.status(200).json(JSON.parse(albums));

    return;
  }

  console.log("Cache Miss");

  albums = await sql`SELECT * FROM albums`;

  if (redisClient.isReady) {
    await redisClient.set("albums", JSON.stringify(albums), {
      EX: CACHE_EXPIRY,
    });
  }

  res.status(200).json(albums);
});

export const getAllSongs = tryCatch(async (req, res) => {
  let songs;
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    songs = await redisClient.get("songs");
  }

  if (songs) {
    console.log("Cache Hit");

    res.status(200).json(JSON.parse(songs));

    return;
  }

  console.log("Cache Miss");

  songs = await sql`SELECT * FROM songs`;

  if (redisClient.isReady) {
    await redisClient.set("songs", JSON.stringify(songs), {
      EX: CACHE_EXPIRY,
    });
  }

  res.status(200).json(songs);
});

export const getAllSongsOfAlbum = tryCatch(async (req, res) => {
  const { id } = req.params;
  const CACHE_EXPIRY = 1800;

  let album, songs;

  if (redisClient.isReady) {
    const cacheData = await redisClient.get(`album_songs_${id}`);

    if (cacheData) {
      console.log("Cache Hit");

      res.status(200).json(JSON.parse(cacheData));

      return;
    }
  }

  album = await sql`SELECT * FROM albums WHERE id = ${id}`;

  if (album.length === 0) {
    res.status(404).json({
      message: "No Album With This ID",
    });

    return;
  }

  songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;

  const response = { songs, album: album[0] };

  if (redisClient.isReady) {
    await redisClient.set(`album_songs_${id}`, JSON.stringify(response), {
      EX: CACHE_EXPIRY,
    });
  }

  console.log("Cache Miss");

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
