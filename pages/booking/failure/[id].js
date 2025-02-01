// pages/booking/failure/[id].js

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

const FailurePage = ({ booking }) => {
  if (!booking) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your booking could not be found.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy, h:mm a");
  };

  return (
    <>
      <Head>
        <title>Payment Failed - {booking.guestName}</title>
      </Head>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We're sorry, {booking.guestName}. Your payment could not be
              processed.
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

              {/* Payment Details */}
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Payment Details
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Payment Status</TableHead>
                      <TableCell>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
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
            </div>
            <p className="mt-6">
              Please try booking again or contact support for assistance.
            </p>
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
      props: {
        booking: null,
      },
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

export default FailurePage;
