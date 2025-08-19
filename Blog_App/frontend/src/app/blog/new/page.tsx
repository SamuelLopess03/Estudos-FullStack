"use client";

import dynamic from "next/dynamic";

import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";
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
  useAppData,
} from "@/context/AppContext";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddBlog = () => {
  const { fetchBlogs } = useAppData();

  const editor = useRef(null);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const [aiTitle, setAiTitle] = useState(false);
  const [aiDescription, setAiDescription] = useState(false);
  const [aiBlogLoading, setAiBlogLoading] = useState(false);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start Typings...",
    }),
    []
  );

  const aiTitleResponse = async () => {
    try {
      setAiTitle(true);
      const { data } = await axios.post<string>(
        `${author_service}/api/v1/ai/title`,
        {
          text: formData.title,
        }
      );

      setFormData({ ...formData, title: data });
    } catch (error) {
      toast.error("Problem While Fetching From AI");

      console.error(error);
    } finally {
      setAiTitle(false);
    }
  };

  const aiDescriptionResponse = async () => {
    try {
      setAiDescription(true);
      const { data } = await axios.post<string>(
        `${author_service}/api/v1/ai/description`,
        {
          title: formData.title,
          description: formData.description,
        }
      );

      setFormData({ ...formData, description: data });
    } catch (error) {
      toast.error("Problem While Fetching From AI");

      console.error(error);
    } finally {
      setAiDescription(false);
    }
  };

  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post<{ html: string }>(
        `${author_service}/api/v1/ai/blog`,
        {
          blog: formData.blogcontent,
        }
      );

      setContent(data.html);
      setFormData({ ...formData, blogcontent: data.html });
    } catch (error) {
      toast.error("Problem While Fetching From AI");

      console.error(error);
    } finally {
      setAiBlogLoading(false);
    }
  };

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
      const { data } = await axios.post<{ message: string }>(
        `${author_service}/api/v1/blog/new`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });
      setContent("");

      fetchBlogs();
    } catch (error) {
      toast.error("Error While Adding Blog");

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
                className={
                  aiTitle ? "animate-pulse placeholder:opacity-60" : ""
                }
                required
              />

              {formData.title === "" ? (
                ""
              ) : (
                <Button
                  type="button"
                  onClick={aiTitleResponse}
                  disabled={aiTitle}
                >
                  <RefreshCw className={aiTitle ? "animate-spin" : ""} />
                </Button>
              )}
            </div>

            <Label>Description</Label>

            <div className="flex justify-center items-center gap-2">
              <Input
                name="description"
                placeholder="Enter a Blog Description"
                onChange={handleInputChange}
                value={formData.description}
                className={
                  aiDescription ? "animate-pulse placeholder:opacity-60" : ""
                }
                required
              />

              {formData.description === "" && formData.title === "" ? (
                ""
              ) : (
                <Button
                  type="button"
                  onClick={aiDescriptionResponse}
                  disabled={aiDescription}
                >
                  <RefreshCw className={aiDescription ? "animate-spin" : ""} />
                </Button>
              )}
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
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Blog Content</Label>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Paste your blog or type here. You can use rich text
                  formatting. Please add image after improving your gammer
                </p>

                <Button
                  type="button"
                  size={"sm"}
                  onClick={aiBlogResponse}
                  disabled={aiBlogLoading}
                >
                  <RefreshCw
                    size={16}
                    className={aiBlogLoading ? "animate-spin" : ""}
                  />
                  <span className="ml-2">Fix Grammer</span>
                </Button>
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

export default AddBlog;
