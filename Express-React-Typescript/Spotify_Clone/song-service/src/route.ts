import express from "express";
import {
  getAllAlbum,
  getAllSongs,
  getAllSongsOfAlbum,
  getSingleSong,
} from "./controller.js";

const songRouter = express.Router();

songRouter.get("/album/all", getAllAlbum);
songRouter.get("/song/all", getAllSongs);
songRouter.get("/album/:id", getAllSongsOfAlbum);
songRouter.get("/song/:id", getSingleSong);

export default songRouter;
