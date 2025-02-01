import { useState, useEffect, useCallback } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingInvoice from "@/components/booking/BookingInvoice";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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
import { Badge } from "@/components/ui/badge";
import Head from "next/head";
import { format } from "date-fns";

const BookingOrderPage = () => {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/bookings/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking");
        }
        const data = await response.json();

        // Transform the data if needed
        const transformedBooking = {
          ...data,
          activity: data.activity || { name: data.activityName },
          package: data.package || { name: data.packageName },
        };

        setBooking(transformedBooking);
      } catch (error) {
        console.error("Error fetching booking:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }
  if (!booking) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Booking Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The requested booking could not be found.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={styles[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  return (
    <>
      <Head>
        <title>Booking Order - {booking._id}</title>
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex justify-between items-center">
              <span>Booking Order Details</span>
              {getStatusBadge(booking.paymentStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Booking Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-1/3">Booking ID</TableHead>
                      <TableCell>{booking._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableCell>{booking.invoiceNo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableCell>
                        {booking.activity
                          ? booking.activity.name
                          : booking.activityName}
                        {booking.activity && booking.activity.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {booking.activity.description}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableCell>
                        {booking.package
                          ? booking.package.name
                          : booking.packageName}
                        {booking.package && booking.package.inclusions && (
                          <p className="text-sm text-gray-500 mt-1">
                            {booking.package.inclusions}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Travel Date</TableHead>
                      <TableCell>{formatDate(booking.travelDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Number of Adults</TableHead>
                      <TableCell>{booking.adults}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Number of Children</TableHead>
                      <TableCell>{booking.children}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Customer Information
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-1/3">Name</TableHead>
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

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Payment Information
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-1/3">Amount</TableHead>
                      <TableCell>
                        {new Intl.NumberFormat("th-TH", {
                          style: "currency",
                          currency: "THB",
                        }).format(booking.totalPrice)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Transaction Reference</TableHead>
                      <TableCell>
                        {booking.paymentToken || "Not available"}
                      </TableCell>
                    </TableRow>
                    {booking.paymentDetails && (
                      <>
                        <TableRow>
                          <TableHead>Payment Channel</TableHead>
                          <TableCell>
                            {booking.paymentDetails.channelCode || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Card Number</TableHead>
                          <TableCell>
                            {booking.paymentDetails.cardNo || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Payment Scheme</TableHead>
                          <TableCell>
                            {booking.paymentDetails.paymentScheme || "N/A"}
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                    <TableRow>
                      <TableHead>Booking Date</TableHead>
                      <TableCell>{formatDate(booking.createdAt)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Download Invoice Button */}
              <div className="mt-6">
                <button
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.innerHTML = "Generating Invoice...";
                    btn.disabled = true;

                    const pdfContent = (
                      <PDFDownloadLink
                        document={<BookingInvoice booking={booking} />}
                        fileName={`invoice-${booking.invoiceNo}.pdf`}
                      >
                        {({ blob, url, loading, error }) => {
                          if (loading) return null;
                          if (error) {
                            btn.innerHTML = "Download Invoice";
                            btn.disabled = false;
                            return "Error";
                          }
                          if (blob) {
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = `invoice-${booking.invoiceNo}.pdf`;
                            link.click();
                            setTimeout(() => {
                              btn.innerHTML = "Download Invoice";
                              btn.disabled = false;
                            }, 1000);
                          }
                          return null;
                        }}
                      </PDFDownloadLink>
                    );
                    return pdfContent;
                  }}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default BookingOrderPage;
