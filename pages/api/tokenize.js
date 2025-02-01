// pages/api/tokenize.js
import axios from "axios";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv } = req.body;

  const merchantID = process.env.TWO_C2P_MERCHANT_ID;
  const secretKey = process.env.TWO_C2P_SECRET_KEY;

  if (!merchantID || !secretKey) {
    return res
      .status(500)
      .json({ message: "Merchant credentials not configured" });
  }

  const invoiceNo = `INV${Date.now()}`; // Ensure uniqueness
  const amount = "0.00"; // Tokenization typically doesn't require an amount
  const currencyCode = "764"; // ISO 4217 code for THB
  const description = "Tokenization Request";
  const customerEmail = "test@example.com"; // Replace with actual email if available
  const customerIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const returnURL = "https://yourdomain.com/payment/return"; // **Update to your actual return URL**

  // Construct data string for hash (ensure correct order as per 2C2P docs)
  const dataString = `${merchantID}${invoiceNo}${amount}${currencyCode}${description}${customerEmail}${customerIP}${returnURL}${secretKey}`;
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
    cardNumber,
    cardHolderName,
    cardExpiryMonth: expiryMonth.padStart(2, "0"),
    cardExpiryYear: expiryYear.slice(-2),
    securityCode: cvv,
    customerEmail,
    customerIP,
    returnURL,
    hashValue,
  };

  try {
    const response = await axios.post(
      "https://sandbox-pgw.2c2p.com/payment/4.3/paymentToken",
      paymentRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Tokenization Response:", response.data);

    if (response.data && response.data.respCode === "00") {
      res.status(200).json({ token: response.data.token });
    } else {
      res.status(400).json({
        message: response.data.respDesc || "Tokenization failed",
      });
    }
  } catch (error) {
    console.error("Tokenization error:", error.response?.data || error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
