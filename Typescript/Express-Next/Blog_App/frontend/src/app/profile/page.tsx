"use client";

import { redirect, useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { Facebook, Instagram, Linkedin } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Loading from "@/components/loading";

import { useAppData, User, user_service } from "@/context/AppContext";

const ProfilePage = () => {
  const { user, setUser, logoutUser } = useAppData();

  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    bio: "",
  });

  const router = useRouter();

  const changeHandler = async (element: any) => {
    const file = element.target.files[0];

    if (file) {
      const formData = new FormData();

      formData.append("file", file);

      try {
        setLoading(true);

        const token = Cookies.get("token");

        const { data } = await axios.put<{
          message: string;
          token: string;
          user: User;
        }>(`${user_service}/api/v1/user/pic`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(data.message);
        setLoading(false);
        setUser(data.user);

        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/",
        });
      } catch (error) {
        toast.error("Image Update Failed");
        setLoading(false);

        console.error(error);
      }
    }
  };

  const clickHandler = () => {
    inputRef.current?.click();
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);

      const token = Cookies.get("token");

      const { data } = await axios.put<{
        message: string;
        token: string;
        user: User;
      }>(`${user_service}/api/v1/user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message);
      setLoading(false);
      setOpen(false);
      setUser(data.user);

      Cookies.set("token", data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
    } catch (error) {
      toast.error("User Update Failed");
      setLoading(false);

      console.error(error);
    }
  };

  const logoutHandler = () => {
    logoutUser();
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        instagram: user.instagram || "",
        facebook: user.facebook || "",
        linkedin: user.linkedin || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  if (!user) return redirect("/login");

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading ? (
        <Loading />
      ) : (
        <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>

            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar
                className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer"
                onClick={clickHandler}
              >
                <AvatarImage src={user?.image} alt="Profile Pic" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={inputRef}
                  onChange={changeHandler}
                />
              </Avatar>

              <div className="w-full space-y-2 text-center">
                <label htmlFor="" className="font-medium">
                  Name
                </label>
                <p>{user?.name}</p>
              </div>

              {user?.bio && (
                <div className="w-full space-y-2 text-center">
                  <label htmlFor="" className="font-medium">
                    Bio
                  </label>
                  <p>{user.bio}</p>
                </div>
              )}

              <div className="flex gap-4 mt-3">
                {user?.instagram && (
                  <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="text-pink-500 text-2xl" />
                  </a>
                )}

                {user?.facebook && (
                  <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="text-blue-500 text-2xl" />
                  </a>
                )}

                {user?.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="text-blue-700 text-2xl" />
                  </a>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
                <Button onClick={logoutHandler}>Logout</Button>
                <Button onClick={() => router.push("/blog/new")}>
                  Add Blog
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>Edit</Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Input
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Instagram</Label>
                        <Input
                          value={formData.instagram}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagram: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Facebook</Label>
                        <Input
                          value={formData.facebook}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              facebook: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Linkedin</Label>
                        <Input
                          value={formData.linkedin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkedin: e.target.value,
                            })
                          }
                        />
                      </div>

                      <Button
                        onClick={handleFormSubmit}
                        className="w-full mt-4"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
