"use client";

import { Filter } from "lucide-react";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import BlogCard from "@/components/blogCard";

import { useAppData } from "@/context/AppContext";

const Blogs = () => {
  const { toggleSidebar } = useSidebar();
  const { loading, blogs, blogLoading } = useAppData();

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center my-5 gap-3">
            <h1 className="text-3xl font-bold">Latest Blogs</h1>

            <Button
              className="flex items-center gap-2 px-4 bg-primary text-white"
              onClick={toggleSidebar}
            >
              <Filter size={18} /> <span>Filter Blogs</span>
            </Button>
          </div>

          {blogLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {blogs?.length === 0 && <p>No Blogs Yet</p>}
              {blogs &&
                blogs.map((element, index) => {
                  return (
                    <BlogCard
                      key={index}
                      id={element.id}
                      image={element.image}
                      title={element.title}
                      desc={element.description}
                      time={element.create_at}
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;
