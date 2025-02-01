// pages/api/payment-callback.js

import crypto from "crypto";
import { dbConnect } from "@/lib/mongoose";
import Booking from "@/models/Booking";
import { sendBookingConfirmationEmail } from "@/utils/mailer";

export default async function handler(req, res) {
  await dbConnect();

  const SECRET_KEY = process.env.SECRET_KEY;

  let data;
  let method = req.method;

  if (method === "POST") {
    data = req.body;
  } else if (method === "GET") {
    data = req.query;
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    version,
    merchant_id,
    payment_description,
    order_id,
    invoice_no,
    currency,
    amount,
    transaction_ref,
    approval_code,
    eci,
    transaction_datetime,
    payment_channel,
    payment_status,
    channel_response_code,
    channel_response_desc,
    masked_pan,
    stored_card_unique_id,
    backend_invoice,
    paid_channel,
    paid_agent,
    recurring_unique_id,
    user_defined_1,
    user_defined_2,
    user_defined_3,
    user_defined_4,
    user_defined_5,
    browser_info,
    ippPeriod,
    ippInterestType,
    ippInterestRate,
    ippMerchantAbsorbRate,
    payment_scheme,
    process_by,
    sub_merchant_list,
    hash_value,
  } = data;

  // Prepare the data string for hash verification
  let dataString = "";

  const keys = [
    "version",
    "request_timestamp",
    "merchant_id",
    "order_id",
    "invoice_no",
    "currency",
    "amount",
    "transaction_ref",
    "approval_code",
    "eci",
    "transaction_datetime",
    "payment_channel",
    "payment_status",
    "channel_response_code",
    "channel_response_desc",
    "masked_pan",
    "stored_card_unique_id",
    "backend_invoice",
    "paid_channel",
    "paid_agent",
    "recurring_unique_id",
    "user_defined_1",
    "user_defined_2",
    "user_defined_3",
    "user_defined_4",
    "user_defined_5",
    "browser_info",
    "ippPeriod",
    "ippInterestType",
    "ippInterestRate",
    "ippMerchantAbsorbRate",
    "payment_scheme",
    "process_by",
    "sub_merchant_list",
  ];

  keys.forEach((key) => {
    if (data[key]) {
      dataString += data[key];
    }
  });

  // Verify hash
  const hmac = crypto.createHmac("sha1", SECRET_KEY);
  hmac.update(dataString);
  const calculatedHash = hmac.digest("hex").toUpperCase();

  if (calculatedHash !== hash_value) {
    console.error("Hash verification failed");
    // For GET requests (cancellations), hash may not be present, so we can proceed
    if (method === "POST") {
      return res.status(400).send("Invalid hash value");
    }
  }

  try {
    // Parse amount back to number
    const parsedAmount = amount ? parseInt(amount, 10) / 100 : 0;

    // Get bookingId from user_defined_1
    const bookingId = user_defined_1;

    if (!bookingId) {
      console.error("No booking ID found in callback");
      return res.redirect(302, "/");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error(`Booking with ID ${bookingId} not found`);
      return res.redirect(302, "/");
    }

    // Map 2C2P payment_status codes to booking paymentStatus
    const paymentStatusMap = {
      "000": "Paid",
      "1001": "Pending",
      "1002": "Pending",
      "2001": "Failed",
      "2002": "Failed",
      "3001": "Cancelled",
      "003": "Cancelled",
      "4000": "Timeout",
    };

    const bookingPaymentStatus =
      paymentStatusMap[payment_status] || "Unknown";

    // Prepare paymentDetails object
    const paymentDetails = {
      respCode: payment_status,
      tranRef: transaction_ref,
      channelCode: payment_channel,
      paidAmount: parsedAmount,
      ippPeriod,
      paymentScheme: payment_scheme,
      cardNo: masked_pan,
      updatedAt: new Date(),
    };

    // Update booking with payment details and status
    booking.paymentStatus = bookingPaymentStatus;
    booking.paymentDetails = paymentDetails;

    await booking.save();

    // Send booking confirmation email
    await sendBookingConfirmationEmail(booking, bookingPaymentStatus);

    // Add toast message to query params and redirect to dashboard
    return res.redirect(302, `/auth/signin?bookingComplete=true`);
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res.redirect(302, "/");
  }
}
