import { authMiddleware } from "@/middleware/auth";
import { dbConnect } from "@/lib/mongoose";
import Booking from "@/models/Booking";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Get total bookings
    const totalBookings = await Booking.countDocuments({ email: user.email });

    // Calculate total spent
    const bookings = await Booking.find({ email: user.email });
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Get upcoming bookings with time left
    const upcomingBookingsData = await Booking.find({
      email: user.email,
      travelDate: { $gt: new Date() },
      paymentStatus: "Paid"
    }).sort({ travelDate: 1 });

    const upcomingBookings = {
      count: upcomingBookingsData.length,
      nextBooking: upcomingBookingsData[0] ? {
        date: upcomingBookingsData[0].travelDate,
        timeLeft: calculateTimeLeft(upcomingBookingsData[0].travelDate)
      } : null
    };

    // Get last booking
    const lastBooking = await Booking.findOne({ email: user.email })
      .sort({ createdAt: -1 })
      .limit(1);

    res.status(200).json({
      totalBookings,
      totalSpent,
      upcomingBookings,
      lastBooking,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};

// Helper function to calculate time left
const calculateTimeLeft = (travelDate) => {
  const now = new Date();
  const travel = new Date(travelDate);
  const diffTime = Math.abs(travel - now);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ${diffDays % 30} day${(diffDays % 30) !== 1 ? 's' : ''}`;
  }
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
};

export default authMiddleware(handler);
