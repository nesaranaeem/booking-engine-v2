// pages/api/update-payment.js

import { dbConnect } from "@/lib/mongoose";
import Booking from "@/models/Booking";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await dbConnect();

  const { bookingId, paymentStatus, paymentDetails } = req.body;

  if (!bookingId || !paymentStatus || !paymentDetails) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update booking with payment details and status
    booking.paymentStatus = paymentStatus;
    booking.paymentDetails = paymentDetails;

    await booking.save();

    return res.status(200).json({ message: "Booking payment status updated" });
  } catch (error) {
    console.error("Error updating booking payment status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
