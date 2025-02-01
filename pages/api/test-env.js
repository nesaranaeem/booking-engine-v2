// pages/api/test-env.js

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const MERCHANT_ID = process.env.MERCHANT_ID || "Not Defined";
  const SECRET_KEY = process.env.SECRET_KEY || "Not Defined";

  // **Do not expose SECRET_KEY in responses!**
  // For testing, we'll only return MERCHANT_ID
  res.status(200).json({ MERCHANT_ID });
}
