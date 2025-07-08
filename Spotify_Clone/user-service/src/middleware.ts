import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { IUser, User } from "./model.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      throw new Error("Please Login");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded._id) {
      throw new Error("Invalid Token");
    }

    const userId = decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;

    next();
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};
