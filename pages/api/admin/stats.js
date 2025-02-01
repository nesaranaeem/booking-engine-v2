// pages/api/admin/stats.js
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import Booking from "@/models/Booking";
import User from "@/models/User"; // Ensure you have a User model
import verifyToken from "@/lib/verifyToken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authorization.split(" ")[1]; // Assuming 'Bearer <token>'
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    await dbConnect();

    try {
      const totalActivities = await Activity.countDocuments();
      const totalBookings = await Booking.countDocuments();
      const totalUsers = await User.countDocuments();

      res.status(200).json({
        totalActivities: totalActivities ?? 0,
        totalBookings: totalBookings ?? 0,
        totalUsers: totalUsers ?? 0,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
