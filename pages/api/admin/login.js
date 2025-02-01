// pages/api/admin/login.js
import dbConnect from "../../../lib/dbConnect";
import Admin from "../../../models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
