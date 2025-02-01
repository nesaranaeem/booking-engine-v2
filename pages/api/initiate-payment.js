// pages/api/initiate-payment.js

import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Method not allowed");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    payment_description,
    order_id,
    amount,
    customer_email,
    frontendReturnUrl,
    backendReturnUrl,
    cancel_url,
    user_defined_1,
    // Include any other required fields
  } = req.body;

  const MERCHANT_ID = process.env.MERCHANT_ID; // Your 2C2P Merchant ID
  const SECRET_KEY = process.env.SECRET_KEY; // Your 2C2P Secret Key

  if (!MERCHANT_ID || !SECRET_KEY) {
    console.error(
      "MERCHANT_ID or SECRET_KEY is not defined in environment variables"
    );
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // Prepare the payment request data
    const paymentRequest = {
      version: "7.0",
      merchant_id: MERCHANT_ID,
      payment_description,
      order_id,
      invoice_no: order_id,
      currency: "764", // Use '764' for THB
      amount: formatAmount(amount),
      customer_email,
      result_url_1: frontendReturnUrl,
      result_url_2: backendReturnUrl,
      cancel_url: cancel_url || frontendReturnUrl, // Fallback to frontend URL if no cancel URL
      payment_option: "A",
      default_lang: "en",
      user_defined_1,
      // Include other optional parameters if needed
    };

    // Generate the signature
    const signature = generateSignature(paymentRequest, SECRET_KEY);

    paymentRequest.hash_value = signature;

    // Return the paymentRequest to the frontend
    res.status(200).json({
      paymentRequest,
    });
  } catch (error) {
    console.error("Error generating payment request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while initiating the payment" });
  }
}

// Helper function to format amount
function formatAmount(amount) {
  const amountNumber = parseFloat(amount);
  if (isNaN(amountNumber)) {
    throw new Error("Invalid amount");
  }
  const amountFixed = amountNumber.toFixed(2);
  const amountNoDecimal = amountFixed.replace(".", "");
  const amountStr = amountNoDecimal.padStart(12, "0");
  return amountStr;
}

// Helper function to generate signature
function generateSignature(params, secretKey) {
  let signatureString = "";

  const keys = [
    "version",
    "merchant_id",
    "payment_description",
    "order_id",
    "invoice_no",
    "currency",
    "amount",
    "customer_email",
    "pay_category_id",
    "promotion",
    "user_defined_1",
    "user_defined_2",
    "user_defined_3",
    "user_defined_4",
    "user_defined_5",
    "result_url_1",
    "result_url_2",
    "enable_store_card",
    "stored_card_unique_id",
    "request_3ds",
    "recurring",
    "order_prefix",
    "recurring_amount",
    "allow_accumulate",
    "max_accumulate_amount",
    "recurring_interval",
    "recurring_count",
    "charge_next_date",
    "charge_on_date",
    "payment_option",
    "ipp_interest_type",
    "payment_expiry",
    "default_lang",
    "statement_descriptor",
  ];

  keys.forEach((key) => {
    if (params[key]) {
      signatureString += params[key];
    }
  });

  const hmac = crypto.createHmac("sha1", secretKey);
  hmac.update(signatureString);
  const signature = hmac.digest("hex").toUpperCase();

  return signature;
}
