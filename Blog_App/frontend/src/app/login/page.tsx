"use client";

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

import { user_service } from "@/context/AppContext";

const LoginPage = () => {
  const responseGoogle = async (authResult: any) => {
    try {
      const result = await axios.post<{ token: string; message: string }>(
        `${user_service}/api/v1/login`,
        {
          code: authResult["code"],
          redirect_uri: "http://localhost:3000",
        }
      );

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      toast.success(result.data.message);
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Problem While Login You");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
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
  );
};

export default LoginPage;
