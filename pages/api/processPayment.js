// pages/api/processPayment.js
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, bookingData } = req.body;

  const merchantID = process.env.TWO_C2P_MERCHANT_ID;
  const secretKey = process.env.TWO_C2P_SECRET_KEY;

  if (!merchantID || !secretKey) {
    return res
      .status(500)
      .json({ message: "Merchant credentials not configured" });
  }

  const invoiceNo = `INV${Date.now()}`; // Ensure uniqueness
  const amount = bookingData.totalPrice.toFixed(2);
  const currencyCode = "764";
  const description = `Booking for ${bookingData.guestName}`;
  const customerEmail = bookingData.email;
  const customerIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const returnURL = "https://yourdomain.com/payment/return"; // **Update to your actual return URL**

  // Construct data string for hash (include token as per 2C2P docs)
  const dataString = `${merchantID}${invoiceNo}${amount}${currencyCode}${description}${token}${customerEmail}${customerIP}${returnURL}${secretKey}`;
  const hashValue = crypto
    .createHash("sha256")
    .update(dataString)
    .digest("hex")
    .toUpperCase();

  const paymentRequest = {
    merchantID,
    invoiceNo,
    description,
    amount,
    currencyCode,
    token, // Token received from tokenization
    customerEmail,
    customerIP,
    returnURL,
    hashValue,
  };

  try {
    const response = await axios.post(
      "https://sandbox-pgw.2c2p.com/payment/4.3/payment",
      paymentRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Payment Processing Response:", response.data);

    if (response.data && response.data.respCode === "00") {
      // Payment successful, save booking
      await dbConnect();
      const booking = new Booking({
        package: bookingData.packageId,
        travelDate: bookingData.travelDate,
        adults: bookingData.adults,
        children: bookingData.children,
        guestName: bookingData.guestName,
        nationality: bookingData.nationality,
        email: bookingData.email,
        phone: bookingData.phone,
        totalPrice: bookingData.totalPrice,
        paymentStatus: "Paid",
        paymentDetails: response.data,
      });

      await booking.save();

      console.log("Booking saved successfully:", booking._id);

      res.status(200).json({ bookingId: booking._id });
    } else {
      res.status(400).json({
        message: response.data.respDesc || "Payment failed",
      });
    }
  } catch (error) {
    console.error(
      "Payment processing error:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
}
