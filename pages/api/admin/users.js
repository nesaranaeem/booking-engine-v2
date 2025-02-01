import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { authMiddleware } from "@/middleware/auth";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await User.find({}).select("-password").lean();
        res.status(200).json({ users });
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ message: "User ID is required" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query;
        const { name, email, password } = req.body;
        
        if (!id) {
          return res.status(400).json({ message: "User ID is required" });
        }

        // Validate required fields
        if (!name || !email) {
          return res.status(400).json({ message: "Name and email are required" });
        }

        const updateData = { name, email };
        
        // Handle password update if provided
        if (password !== undefined) {
          if (password === "") {
            return res.status(400).json({ 
              message: "Password cannot be empty",
              type: "password_validation"
            });
          }
          if (password.length < 6) {
            return res.status(400).json({ 
              message: "Password must be at least 6 characters long",
              type: "password_validation"
            });
          }
          // Use bcrypt directly for consistent hashing
          updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        ).select("-password");

        res.status(200).json({ user: updatedUser });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
};

export default authMiddleware(handler);
