// pages/api/payment/return.js
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    console.error("Invalid HTTP method:", req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract necessary query parameters sent by 2C2P
  const { invoiceNo, respCode, transID } = req.query;

  await dbConnect();

  // Find the booking by invoiceNo
  const booking = await Booking.findOne({
    "paymentDetails.invoiceNo": invoiceNo,
  });

  if (!booking) {
    console.error("Booking not found for invoiceNo:", invoiceNo);
    return res.status(404).json({ message: "Booking not found" });
  }

  // Update payment status based on respCode
  if (respCode === "00") {
    booking.paymentStatus = "Paid";
    await booking.save();
    // Redirect to confirmation page
    res.redirect(`/booking/confirmation/${booking._id}`);
  } else {
    booking.paymentStatus = "Failed";
    booking.paymentDetails.respDesc = "Payment failed or was canceled.";
    await booking.save();
    // Redirect back to booking page with error message
    res.redirect(
      `/booking/${booking.packageId}?error=Payment failed. Please try again.`
    );
  }
}
