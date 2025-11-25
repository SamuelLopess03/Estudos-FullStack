import { Response } from "express";
import cloudinary from "cloudinary";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import tryCatch from "../utils/tryCatch.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabbitMQ.js";

export const createBlog = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, blogcontent, category } = req.body;

    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No File to Upload",
      });

      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      throw new Error("Failed to Generate Buffer.");
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    const result = await sql`
        INSERT INTO blogs (title, description, image, blogcontent, category, author) VALUES (${title},
        ${description}, ${cloud.secure_url}, ${blogcontent}, ${category}, ${req.user?._id}) RETURNING *
    `;

    await invalidateCacheJob(["blogs:*"]);

    res.status(201).json({
      message: "Blog Created Successfully",
      blog: result[0],
    });
  }
);

export const updateBlog = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, blogcontent, category } = req.body;

    const file = req.file;

    const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

    if (!blog.length) {
      res.status(404).json({
        message: "No Blog With This ID",
      });

      return;
    }

    if (blog[0].author !== req.user?._id) {
      res.status(403).json({
        message: "You Are Not Author of This Blog",
      });

      return;
    }

    let imageUrl = blog[0].image;

    if (file) {
      const fileBuffer = getBuffer(file);

      if (!fileBuffer || !fileBuffer.content) {
        throw new Error("Failed to Generate Buffer.");
      }

      const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "blogs",
      });

      imageUrl = cloud.secure_url;
    }

    const updatedBlog = await sql`
      UPDATE blogs SET title = ${title || blog[0].title}, description = ${
      description || blog[0].description
    },
      image = ${imageUrl}, blogcontent = ${
      blogcontent || blog[0].blogcontent
    }, category = ${category || blog[0].category}
      WHERE id = ${id} RETURNING *
    `;

    await invalidateCacheJob(["blogs:*", `blog:${id}`]);

    res.status(200).json({
      message: "Blog Updated Successfully",
      blog: updatedBlog[0],
    });
  }
);

export const deleteBlog = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

    if (!blog.length) {
      res.status(404).json({
        message: "No Blog With This ID",
      });

      return;
    }

    if (blog[0].author !== req.user?._id) {
      res.status(403).json({
        message: "You Are Not Author of This Blog",
      });

      return;
    }

    await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;

    await invalidateCacheJob(["blogs:*", `blog:${req.params.id}`]);

    res.status(200).json({
      message: "Blog Deleted Successfully",
    });
  }
);

export const aiTitleResponse = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { text } = req.body;

    const prompt = `Correct the grammar of the following blog title and return only the 
                  corrected title without any additional text, formatting, or symbols:
                  ${text}`;

    let result;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      let rawtext = response.text;

      if (!rawtext) {
        res.status(400).json({
          message: "Something Went Wrong",
        });

        return;
      }

      result = rawtext
        .replace(/\*\*/g, "")
        .replace(/[\r\n]+/g, "")
        .replace(/[*_`~]/g, "")
        .trim();
    }

    await main();

    res.status(200).json(result);
  }
);

export const aiDescriptionResponse = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description } = req.body;

    const prompt =
      description === ""
        ? `Generate only one short blog description based on this title: "${title}". Your response must be only 
           one sentence, strictly under 30 words, with no options, no greetings, and no extra text. Do not explain.
           Do not say 'here is'. Just return the description only.`
        : `Fix the grammar in the following blog description and return only the corrected sentence. Do not add
           anything else: "${description}"`;

    let result;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      let rawtext = response.text;

      if (!rawtext) {
        res.status(400).json({
          message: "Something Went Wrong",
        });

        return;
      }

      result = rawtext
        .replace(/\*\*/g, "")
        .replace(/[\r\n]+/g, "")
        .replace(/[*_`~]/g, "")
        .trim();
    }

    await main();

    res.status(200).json(result);
  }
);

export const aiBlogResponse = tryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const prompt = `You will act as a grammar correction engine. I will provide you with blog content
                  in rich HTML format (from Jodit Editor). Do not generate or rewrite the content with
                  new ideas. Only correct grammatical, punctuation, and spelling errors while preserving
                  all HTML tags and formatting. Maintain inline styles, image tags, line breaks, and
                  structural tags exactly as they are. Return the full corrected HTML string as output.`;

    const { blog } = req.body;

    if (!blog) {
      res.status(400).json({
        message: "Please Provide Blog",
      });

      return;
    }

    const fullMessage = `${prompt}\n\n${blog}`;

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullMessage }],
        },
      ],
    });

    const responseText = await result.response.text();

    const cleanedHtml = responseText
      .replace(/^(html|```html|```)\n?/i, "")
      .replace(/```$/i, "")
      .replace(/\*\*/g, "")
      .replace(/[\r\n]+/g, "")
      .replace(/[*_`~]/g, "")
      .trim();

    res.status(200).json({ html: cleanedHtml });
  }
);
