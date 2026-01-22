import user from "../models/user.js";

export const protect = async (req, res, next) => {
  const { userId } = req.auth;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not Authenticated",
    });
  }

  const userData = await user.findById(userId);

  req.user = userData;

  next();
};
