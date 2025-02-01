// pages/api/admin/bookings.js
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { authMiddleware } from "@/middleware/auth";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;
    const sortQuery = { [sortField]: sortOrder };

    const [bookings, total] = await Promise.all([
      Booking.find({}).sort(sortQuery).skip(skip).limit(limit).lean(),
      Booking.countDocuments({}),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      bookings,
      totalPages,
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export default authMiddleware(handler);
