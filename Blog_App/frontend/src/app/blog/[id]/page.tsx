"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bookmark, Edit, Trash2Icon, User2 } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";

import {
  blog_service,
  useAppData,
  Blog,
  User,
  Comment,
} from "@/context/AppContext";

const BlogPage = () => {
  const { isAuth, user } = useAppData();

  const { id } = useParams();

  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchSingleBlog() {
    try {
      setLoading(true);

      const { data } = await axios.get<{ blog: Blog; author: User }>(
        `${blog_service}/api/v1/blog/${id}`
      );

      setBlog(data.blog);
      setAuthor(data.author);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addComment() {
    try {
      setLoading(true);

      const token = Cookies.get("token");
      const { data } = await axios.post<{ message: string }>(
        `${blog_service}/api/v1/comment/${id}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setComment("");
    } catch (error) {
      toast.error("Problem While Adding Comment");

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments() {
    try {
      setLoading(true);

      const { data } = await axios.get<Comment[]>(
        `${blog_service}/api/v1/comment/${id}`
      );

      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSingleBlog();
    fetchComments();
  }, [id]);

  if (!blog) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <Link
              href={`/profile/${author?._id}`}
              className="flex items-center gap-2"
            >
              <img
                src={author?.image}
                className="w-8 h-8 rounded-full"
                alt=""
              />
              {author?.name}
            </Link>
            {isAuth && (
              <Button
                variant={"ghost"}
                className="mx-3 cursor-pointer"
                size={"lg"}
              >
                <Bookmark />
              </Button>
            )}
            {blog.author === user?._id && (
              <>
                <Button
                  size={"sm"}
                  className="cursor-pointer"
                  onClick={() => router.push(`/blog/edit/${id}`)}
                >
                  <Edit />
                </Button>

                <Button
                  size={"sm"}
                  variant={"destructive"}
                  className="cursor-pointer mx-2"
                >
                  <Trash2Icon />
                </Button>
              </>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <img
            src={blog.image}
            alt=""
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-lg text-gray-700 mb-4">{blog.description}</p>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
          />
        </CardContent>
      </Card>

      {isAuth && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Leave a Comment</h3>
          </CardHeader>
          <CardContent>
            <Label htmlFor="comment">Your Comment</Label>
            <Input
              id="comment"
              placeholder="Type Your Comment Here"
              className="my-5"
              value={comment}
              onChange={(element) => setComment(element.target.value)}
            />
            <Button onClick={addComment} disabled={loading}>
              {loading ? "Adding Comment..." : "Post Comment"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">All Comments</h3>
        </CardHeader>
        <CardContent>
          {comments && comments.length > 0 ? (
            comments.map((element, index) => (
              <div
                key={index}
                className="border-b py-2 flex items-center gap-3"
              >
                <div>
                  <p className="font-semibold flex items-center gap-1">
                    <span className="user border border-gray-400 rounded-full p-1">
                      <User2 />
                    </span>
                    {element.username}
                  </p>

                  <p>{element.comment}</p>

                  <p className="text-xs text-gray-500">
                    {new Date(element.create_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No Comments Yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPage;
