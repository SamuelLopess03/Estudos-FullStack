import User from "../models/user.js";
import { verifyToken } from "../lib/utils.js";

export const protectRoute = async (req, res) => {
  try {
    const token = req.headers.token;

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
