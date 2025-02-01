// models/Package.js
import { mongoose } from "@/lib/mongoose";

const PackageSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: [true, "Associated activity is required"],
    },
    name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
    },
    adultPrice: {
      type: Number,
      required: [true, "Adult price is required"],
      min: [0, "Price cannot be negative"],
    },
    childPrice: {
      type: Number,
      required: [true, "Child price is required"],
      min: [0, "Price cannot be negative"],
    },
    inclusions: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Package ||
  mongoose.model("Package", PackageSchema);
