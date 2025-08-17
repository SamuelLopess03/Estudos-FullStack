"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const user_service = "http://localhost:5000";
export const author_service = "http://localhost:5001";
export const blog_service = "http://localhost:5002";

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  create_at: string;
}

export interface Comment {
  id: string;
  comment: string;
  userid: string;
  username: string;
  blogid: string;
  create_at: string;
}

interface AppContextType {
  user: User | null;
  blogs: Blog[] | null;
  loading: boolean;
  blogLoading: boolean;
  isAuth: boolean;
  searchQuery: string;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  logoutUser: () => Promise<void>;
  fetchBlogs: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);

  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchUser() {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get<User>(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);

    toast.success("User Logged Out");
  }

  async function fetchBlogs() {
    setBlogLoading(true);

    try {
      const { data } = await axios.get<Blog[]>(
        `${blog_service}/api/v1/blog/all?searchQuery=${searchQuery}&category=${category}`
      );

      setBlogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setBlogLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, category]);

  const value = {
    user,
    blogs,
    isAuth,
    loading,
    blogLoading,
    searchQuery,
    setIsAuth,
    setLoading,
    setUser,
    setSearchQuery,
    setCategory,
    logoutUser,
    fetchBlogs,
  };

  return (
    <AppContext.Provider value={value}>
      <GoogleOAuthProvider clientId="609014385615-0v8cgcm5aa1hbdb7gfqm2vtkj1c76nur.apps.googleusercontent.com">
        {children}
        <Toaster />
      </GoogleOAuthProvider>
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppData Must be Used Within AppProvider");
  }

  return context;
};
