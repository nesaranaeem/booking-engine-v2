// pages/api/verify-payment.js

import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Method not allowed");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { payload, signature } = req.body;

  const SECRET_KEY = process.env.SECRET_KEY;

  // Verify the signature
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("Invalid signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Decode and parse the payload
  const paymentResult = JSON.parse(payload);

  console.log("Payment Result:", paymentResult);

  // Handle the payment result
  if (paymentResult.respCode === "0000") {
    // Payment successful
    // Update your booking record in the database as paid
    // ...

    res.status(200).json({ paymentStatus: "success" });
  } else {
    // Payment failed
    console.error("Payment failed:", paymentResult);
    res.status(200).json({ paymentStatus: "failed" });
  }
}
