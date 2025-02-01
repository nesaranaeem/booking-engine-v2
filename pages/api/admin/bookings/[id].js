import { dbConnect } from "@/lib/mongoose";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case "PUT":
      try {
        const updatedBooking = await Booking.findByIdAndUpdate(
          id,
          { $set: req.body },
          { new: true }
        );

        if (!updatedBooking) {
          return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ success: true, booking: updatedBooking });
      } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Error updating booking" });
      }
      break;

    case "DELETE":
      try {
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
          return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Error deleting booking" });
      }
      break;

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
