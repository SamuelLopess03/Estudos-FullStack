"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { Bookmark, Edit, Trash2Icon } from "lucide-react";
import axios from "axios";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";

import { Blog, blog_service, useAppData, User } from "@/context/AppContext";
import { Input } from "@/components/ui/input";

const BlogPage = () => {
  const { isAuth, user } = useAppData();

  const { id } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
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

  useEffect(() => {
    fetchSingleBlog();
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
                <Button size={"sm"} className="cursor-pointer">
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
            />
            <Button>Post Comment</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogPage;
