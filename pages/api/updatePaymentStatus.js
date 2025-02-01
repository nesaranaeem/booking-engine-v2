// pages/api/updatePaymentStatus.js
import dbConnect from "../../lib/dbConnect";
import Booking from "../../models/Booking";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    const { bookingId, paymentStatus } = req.body;

    if (!bookingId || !paymentStatus) {
      return res
        .status(400)
        .json({ message: "Missing booking ID or payment status" });
    }

    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.paymentStatus = paymentStatus === "000" ? "Completed" : "Failed";
      await booking.save();

      res.status(200).json({ message: "Payment status updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update payment status" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
