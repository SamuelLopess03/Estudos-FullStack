import express from "express";

import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import { createBlog, deleteBlog, updateBlog } from "../controllers/blog.js";

const router = express.Router();

router.post("/blog/new", isAuth, uploadFile, createBlog);
router.put("/blog/:id", isAuth, uploadFile, updateBlog);
router.delete("/blog/:id", isAuth, uploadFile, deleteBlog);

export default router;
