import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { IUser } from "../models/User.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login - No Auth Header",
      });

      return;
    }

    const token = authHeader.split(" ")[1];

    const decodeToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decodeToken || !decodeToken.user) {
      res.status(401).json({
        message: "Invalid Token",
      });

      return;
    }

    req.user = decodeToken.user;

    next();
  } catch (error) {
    console.error("JWT Authentication Error: ", error);

    res.status(401).json({
      message: "Please Login - Jwt Error",
    });
  }
};
