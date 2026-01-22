"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  blogCategories,
  author_service,
  Blog,
  blog_service,
  useAppData,
  User,
} from "@/context/AppContext";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditBlogPage = () => {
  const { fetchBlogs } = useAppData();

  const editor = useRef(null);

  const { id } = useParams();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start Typings...",
    }),
    []
  );

  const handleInputChange = (element: any) => {
    setFormData({ ...formData, [element.target.name]: element.target.value });
  };

  const handleFileChange = (element: any) => {
    const file = element.target.files[0];

    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (element: any) => {
    element.preventDefault();
    setLoading(true);

    const fromDataToSend = new FormData();

    fromDataToSend.append("title", formData.title);
    fromDataToSend.append("description", formData.description);
    fromDataToSend.append("blogcontent", formData.blogcontent);
    fromDataToSend.append("category", formData.category);

    if (formData.image) {
      fromDataToSend.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");
      const { data } = await axios.put<{ message: string }>(
        `${author_service}/api/v1/blog/${id}`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      fetchBlogs();
    } catch (error) {
      toast.error("Error While Adding Blog");

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get<{ blog: Blog; author: User }>(
          `${blog_service}/api/v1/blog/${id}`
        );
        const blog = data.blog;

        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          image: null,
          blogcontent: blog.blogcontent,
        });

        setContent(blog.blogcontent);
        setExistingImage(blog.image);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Blog</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>

            <div className="flex justify-center items-center gap-2">
              <Input
                name="title"
                placeholder="Enter a Blog Title"
                onChange={handleInputChange}
                value={formData.title}
                required
              />
            </div>

            <Label>Description</Label>

            <div className="flex justify-center items-center gap-2">
              <Input
                name="description"
                placeholder="Enter a Blog Description"
                onChange={handleInputChange}
                value={formData.description}
                required
              />
            </div>

            <Label>Category</Label>
            <Select
              onValueChange={(value: any) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={formData.category || "Select Category"}
                />
              </SelectTrigger>

              <SelectContent>
                {blogCategories?.map((element, index) => (
                  <SelectItem key={index} value={element}>
                    {element}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-4">
              <Label>Image Upload</Label>
              {existingImage && !formData.image && (
                <img
                  src={existingImage}
                  className="w-40 h-40 object-cover rounded mb-2"
                  alt=""
                />
              )}
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Blog Content</Label>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Paste your blog or type here. You can use rich text
                  formatting. Please add image after improving your gammer
                </p>
              </div>

              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => {
                  setContent(newContent);
                  setFormData({ ...formData, blogcontent: newContent });
                }}
              />
            </div>

            <Button type="submit" className="w-full mt-5" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlogPage;
