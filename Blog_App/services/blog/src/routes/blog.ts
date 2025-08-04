import express from "express";

import { getAllBlogs, getSingleBlog } from "../controllers/blog.js";

const router = express.Router();

router.get("/blog/all", getAllBlogs);
router.get("/blog/:id", getSingleBlog);

export default router;
