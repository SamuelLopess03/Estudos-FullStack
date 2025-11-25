import jwt from "jsonwebtoken";

// User Authentication Middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (req.method === "GET") {
      req.body = {};
      req.body.userId = token_decoded.id;
    } else {
      req.body.userId = token_decoded.id;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
