// pages/api/bookings.js
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    const {
      activityId,
      activityName,
      packageId,
      packageName,
      travelDate,
      adults,
      children,
      guestName,
      nationality,
      email,
      phone,
      totalPrice,
      paymentStatus = "Pending"
    } = req.body;

    try {
      // Validate required fields
      if (
        !req.body.activityId ||
        !packageId ||
        !travelDate ||
        !guestName ||
        !nationality ||
        !email ||
        !phone ||
        !totalPrice
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          error: "All fields are required",
        });
      }

      // Validate date format
      const parsedDate = new Date(travelDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid date format",
          error: "Travel date must be a valid date",
        });
      }

      // Save booking details to the database
      const invoiceNo = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      const booking = new Booking({
        activity: req.body.activityId,
        activityName,
        package: packageId,
        packageName,
        travelDate,
        adults,
        children,
        guestName,
        nationality,
        email,
        phone,
        totalPrice,
        paymentStatus,
        paymentToken: req.body.paymentToken,
        invoiceNo
      });

      await booking.save();

      res.status(200).json({ bookingId: booking._id });
    } catch (error) {
      // Handle mongoose validation errors
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error",
          error: Object.values(error.errors).map((err) => err.message),
        });
      }

      // Handle duplicate key error for invoiceNo
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.invoiceNo
      ) {
        return res.status(400).json({
          message: "Duplicate invoice number",
          error:
            "An invoice with this number already exists. Please try again.",
        });
      }

      console.error("Booking Error:", error.message, error.stack);
      res.status(500).json({
        message: "Failed to create booking",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
