import express from "express";

import { isAuth, uploadFile } from "./middleware.js";
import { addAlbum, addSong, addThumbnail } from "./controller.js";

const adminRouter = express.Router();

adminRouter.post("/album/new", isAuth, uploadFile, addAlbum);
adminRouter.post("/song/new", isAuth, uploadFile, addSong);
adminRouter.post("/song/:id", isAuth, uploadFile, addThumbnail);

export default adminRouter;
