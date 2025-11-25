"use client";

import { redirect } from "next/navigation";

import React from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/loading";

import { useAppData, user_service, User } from "@/context/AppContext";

const LoginPage = () => {
  const { isAuth, loading, setIsAuth, setLoading, setUser } = useAppData();

  if (isAuth) return redirect("/blogs");

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post<{
        token: string;
        message: string;
        user: User;
      }>(`${user_service}/api/v1/login`, {
        code: authResult["code"],
        redirect_uri: "https://blog-app-gamma-nine-96.vercel.app",
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      toast.success(result.data.message);
      setIsAuth(true);
      setLoading(false);
      setUser(result.data.user);
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Problem While Login You");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-[350px] m-auto mt-[200px]">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Login to The Reading Retreat</CardTitle>
              <CardDescription>Your go to Blog App</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={googleLogin}>
                Login With Google{" "}
                <img src="/google.png" className="w-5 h-5" alt="Google Icon" />{" "}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;
