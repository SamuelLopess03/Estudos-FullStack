import express from "express";

import { isAuth, uploadFile } from "./middleware.js";
import {
  addAlbum,
  addSong,
  addThumbnail,
  deleteAlbum,
  deleteSong,
} from "./controller.js";

const adminRouter = express.Router();

adminRouter.post("/album/new", isAuth, uploadFile, addAlbum);
adminRouter.delete("/album/:id", isAuth, deleteAlbum);

adminRouter.post("/song/new", isAuth, uploadFile, addSong);
adminRouter.post("/song/:id", isAuth, uploadFile, addThumbnail);
adminRouter.delete("/song/:id", isAuth, deleteSong);

export default adminRouter;
