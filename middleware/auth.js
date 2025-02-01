// middleware/auth.js
import jwt from "jsonwebtoken";
import dbConnect from "../lib/dbConnect";
import Admin from "../models/Admin";
import User from "../models/User";

export const authMiddleware = (handler) => async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded user info to request

    await dbConnect();

    // Check if this is a user token (has userId) or admin token (has id)
    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }
      req.user = user;
    } else if (decoded.id) {
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Admin not found" });
      }
      req.admin = admin;
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token type" });
    }

    return handler(req, res);
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
