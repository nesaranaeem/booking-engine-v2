import { authMiddleware } from "@/middleware/auth";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    
    if (!req.user || !req.user.email) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Create sort object
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    // Get total count
    const total = await Booking.countDocuments({ email: req.user.email });

    // Get paginated bookings
    const bookings = await Booking.find({ email: req.user.email })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ 
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export default authMiddleware(handler);
