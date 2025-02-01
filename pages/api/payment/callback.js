// /pages/api/payment/callback.js
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { paymentStatus, invoiceNo, bookingId } = req.body;

  try {
    await dbConnect();

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update payment status based on the result
    if (paymentStatus === "Success") {
      booking.paymentStatus = "Completed";
    } else {
      booking.paymentStatus = "Failed";
    }

    await booking.save();

    return res.status(200).json({ message: "Payment status updated" });
  } catch (error) {
    console.error("Payment Callback Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
