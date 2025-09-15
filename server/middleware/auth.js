import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.json({
        success: false,
        message: "not authorized",
      });
    }

    const userId = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!userId) {
      return res.json({
        success: false,
        message: "not authorized",
      });
    }

    const user = await User.findById(userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyUser;
