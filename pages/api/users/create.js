// pages/api/users/create.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/utils/mailer";
import generator from "generate-password";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
      created: false,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        created: false,
      });
    }

    // Generate a secure random password
    const password = generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Send welcome email with generated password
    await sendWelcomeEmail(email, name, password);

    res.status(201).json({
      message: "User created successfully",
      created: true,
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
      created: false,
    });
  }
}
