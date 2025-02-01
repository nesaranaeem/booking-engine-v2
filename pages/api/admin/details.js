// pages/api/admin/details.js
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin"; // Ensure you have an Admin model
import verifyToken from "@/lib/verifyToken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authorization.split(" ")[1]; // Assuming 'Bearer <token>'
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    await dbConnect();

    try {
      const admin = await Admin.findById(decoded.id).lean();

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json({
        username: admin.username ?? "",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch admin details" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
