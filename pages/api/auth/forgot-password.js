import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/utils/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Generate reset token even if user doesn't exist (security through obscurity)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    if (user) {
      // Only save token if user exists
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      // Send reset email
      await sendPasswordResetEmail(email, resetToken);
    }

    // Always return success (security through obscurity)
    return res.status(200).json({
      message: "If an account exists, you will receive a reset email shortly",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
