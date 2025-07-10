import express from "express";

import { isAuth, uploadFile } from "./middleware.js";
import { addAlbum } from "./controller.js";

const adminRouter = express.Router();

adminRouter.post("/album/new", isAuth, uploadFile, addAlbum);

export default adminRouter;
