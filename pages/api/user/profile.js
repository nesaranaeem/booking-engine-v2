// pages/api/user/profile.js
import { authMiddleware } from "@/middleware/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    console.log("Invalid method:", req.method);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // req.user is set by authMiddleware
    if (!req.user || !req.user.email) {
      console.log("User information missing in request");
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    const user = await User.findOne({ email: req.user.email }).lean();
    console.log("Fetched user:", user); // Debugging

    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove sensitive fields before sending the response
    const { password, __v, ...userData } = user;

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      // Removed process.env.NODE_ENV check as per your instruction
      // error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default authMiddleware(handler);
