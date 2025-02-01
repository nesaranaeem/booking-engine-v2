// models/Booking.js

import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: [true, "Activity reference is required"],
    },
    activityName: {
      type: String,
      required: [true, "Activity name is required"],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "Package reference is required"],
    },
    packageName: {
      type: String,
      required: [true, "Package name is required"],
    },
    travelDate: {
      type: Date,
      required: [true, "Travel date is required"],
    },
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    adults: {
      type: Number,
      required: [true, "Number of adults is required"],
      min: [1, "At least one adult is required"],
    },
    children: {
      type: Number,
      required: [true, "Number of children is required"],
      min: [0, "Number of children cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Cancelled",
        "Timeout",
        "Unknown",
      ],
      default: "Pending",
    },
    paymentToken: {
      type: String,
      required: [true, "Payment token is required"],
      unique: true,
    },
    invoiceNo: {
      type: String,
      unique: true,
    },
    paymentDetails: {
      respCode: String,
      tranRef: String,
      channelCode: String,
      paidAmount: Number,
      ippPeriod: String,
      paymentScheme: String,
      cardNo: String,
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
