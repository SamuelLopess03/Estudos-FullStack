import { Response } from "express";
import axios from "axios";

import tryCatch from "../utils/tryCatch.js";
import { sql } from "../utils/db.js";

import { AuthenticatedRequest } from "../middlewares/isAuth.js";

import { redisClient } from "../server.js";

export const getAllBlogs = tryCatch(async (req, res) => {
  const { searchQuery = "", category = "" } = req.query;

  const cacheKey = `blogs:${searchQuery}:${category}`;

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log("Serving From Redis Cache");

    res.status(200).json(JSON.parse(cached));

    return;
  }

  let blogs;

  if (searchQuery && category) {
    blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
      "%" + searchQuery + "%"
    } OR description ILIKE ${
      "%" + searchQuery + "%"
    }) AND category = ${category} ORDER BY create_at DESC`;
  } else if (searchQuery) {
    blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
      "%" + searchQuery + "%"
    } OR description ILIKE ${"%" + searchQuery + "%"}) ORDER BY create_at DESC`;
  } else if (category) {
    blogs =
      await sql`SELECT * FROM blogs WHERE category = ${category} ORDER BY create_at DESC`;
  } else {
    blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC`;
  }

  console.log("Serving From DB");

  await redisClient.set(cacheKey, JSON.stringify(blogs), {
    EX: 3600,
  });

  res.status(200).json(blogs);
});

export const getSingleBlog = tryCatch(async (req, res) => {
  const blogId = req.params.id;

  const cacheKey = `blog:${blogId}`;

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log("Serving Single Blog From Redis Cache");

    res.status(200).json(JSON.parse(cached));

    return;
  }

  const blog = await sql`SELECT * FROM blogs WHERE id = ${blogId}`;

  if (blog.length === 0) {
    res.status(404).json({
      message: "No Blog With This ID",
    });

    return;
  }

  const { data } = await axios.get(
    `${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`
  );

  const responseData = {
    blog: blog[0],
    author: data,
  };

  await redisClient.set(cacheKey, JSON.stringify(responseData), {
    EX: 3600,
  });

  res.status(200).json(responseData);
});

export const addComment = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: blogid } = req.params;
    const { comment } = req.body;

    await sql`
      INSERT INTO comments (comment, blogid, userid, username) VALUES (
        ${comment}, ${blogid}, ${req.user?._id}, ${req.user?.name}
      ) RETURNING *
    `;

    res.status(201).json({
      message: "Comment Added",
    });
  }
);

export const getAllComments = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const comments = await sql`
      SELECT * FROM comments WHERE blogid = ${id} ORDER BY create_at DESC
    `;

    res.status(200).json(comments);
  }
);

export const deleteComment = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { commentid } = req.params;

    const comment = await sql`
      SELECT * FROM comments WHERE id = ${commentid}
    `;

    if (comment[0].userid !== req.user?._id) {
      res.status(403).json({
        message: "You Are Not Owner of This Comment",
      });

      return;
    }

    await sql`
      DELETE FROM comments WHERE id = ${commentid}
    `;

    res.status(200).json({
      message: "Comment Deleted",
    });
  }
);

export const saveBlog = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { blogid } = req.params;
    const userid = req.user?._id;

    if (!blogid || !userid) {
      res.status(400).json({
        message: "Missing Blog ID or User ID",
      });

      return;
    }

    const existing = await sql`
      SELECT * FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}
    `;

    if (existing.length !== 0) {
      await sql`
        DELETE FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}
      `;

      res.status(200).json({
        message: "Blog Removed from Saved Items",
      });

      return;
    }

    await sql`
      INSERT INTO savedblogs (blogid, userid) VALUES (${blogid}, ${userid})
    `;

    res.status(200).json({
      message: "Blog Saved",
    });
  }
);

export const getSavedBlogs = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const blogs = await sql`
      SELECT * FROM savedblogs WHERE userid = ${req.user?._id}
    `;

    res.status(200).json(blogs);
  }
);
