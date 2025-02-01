// pages/booking/confirmation/[id].js

import { dbConnect } from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Head from "next/head";
import { format } from "date-fns";

const BookingConfirmation = ({ booking }) => {
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Booking not found.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy, h:mm a");
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Head>
        <title>Booking Confirmation - {booking.guestName}</title>
      </Head>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Booking Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Thank you, <strong>{booking.guestName}</strong>, for your booking!
            </p>
            <p className="text-gray-700 mb-6">
              Your booking ID is: <strong>{booking._id}</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Information */}
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Booking Information
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableCell>{booking._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableCell>{booking.activityName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableCell>{booking.packageName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Travel Date</TableHead>
                      <TableCell>{formatDate(booking.travelDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Booking Date</TableHead>
                      <TableCell>{formatDate(booking.createdAt)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Guest Details */}
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Guest Details
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Guest Name</TableHead>
                      <TableCell>{booking.guestName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableCell>{booking.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Phone</TableHead>
                      <TableCell>{booking.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Nationality</TableHead>
                      <TableCell>{booking.nationality}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mt-6">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Payment Details
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead>Payment Status</TableHead>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Total Amount</TableHead>
                    <TableCell>
                      {new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                      }).format(booking.totalPrice)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Transaction Reference</TableHead>
                    <TableCell>{booking.paymentToken}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Payment Date</TableHead>
                    <TableCell>{formatDate(booking.updatedAt)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export async function getServerSideProps({ params }) {
  await dbConnect();
  const booking = await Booking.findById(params.id).lean();

  if (!booking) {
    return {
      notFound: true,
    };
  }

  // Convert MongoDB ObjectId and dates to strings
  booking._id = booking._id.toString();
  booking.createdAt = booking.createdAt.toISOString();
  booking.updatedAt = booking.updatedAt.toISOString();
  booking.travelDate = booking.travelDate.toISOString();

  return {
    props: {
      booking,
    },
  };
}

export default BookingConfirmation;
