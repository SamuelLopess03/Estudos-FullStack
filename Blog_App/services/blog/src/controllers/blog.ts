import axios from "axios";

import tryCatch from "../utils/tryCatch.js";
import { sql } from "../utils/db.js";
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
