import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Activity from "@/models/Activity";
import Package from "@/models/Package";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const booking = await Booking.findOne({
      $or: [
        { invoiceNo: req.query.id },
        { _id: req.query.id }
      ]
    })
    .populate('activity')
    .populate('package')
    .lean();

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Convert dates to ISO strings
    booking.createdAt = booking.createdAt.toISOString();
    booking.updatedAt = booking.updatedAt.toISOString();
    booking.travelDate = booking.travelDate.toISOString();

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
}
