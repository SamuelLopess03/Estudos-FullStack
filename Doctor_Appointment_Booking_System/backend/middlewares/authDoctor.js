import jwt from "jsonwebtoken";

// Admin Authentication Middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET_KEY);

    if (req.method === "GET") {
      req.body = {};
      req.body.docId = token_decoded.id;
    } else {
      req.body.docId = token_decoded.id;
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

export default authDoctor;
