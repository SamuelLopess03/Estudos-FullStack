import { Request, Response, NextFunction } from "express";
import axios from "axios";

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface AuthenticatedRequest extends Request {
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

    const { data } = await axios.get(`${process.env.USER_URL}/api/v1/user/me`, {
      headers: {
        token,
      },
    });

    req.user = data;

    next();
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};
