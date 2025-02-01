// pages/dashboard/bookings.js

import React, { useState, useEffect } from "react";
import UserLayout from "@/components/user/UserLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import BookingDetailsModal from "@/components/user/BookingDetailsModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pdf } from "@react-pdf/renderer"; // Import pdf function
import BookingInvoice from "@/components/booking/BookingInvoice";
import axios from "axios";
import { format } from "date-fns";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Head from "next/head";
import { FiDownload, FiLoader } from "react-icons/fi";

const UserBookings = () => {
  // State variables
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const { addToast } = useToast();
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch bookings whenever page, limit, sortField, or sortOrder changes
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sortField, sortOrder]);

  // Function to fetch bookings from the API
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit,
          sortField,
          sortOrder,
        },
      });

      setBookings(res.data.bookings || []);
      setTotalPages(Math.ceil((res.data.total || 0) / limit));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle sorting
  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  // Function to render status badges
  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Paid: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
      Cancelled: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={styles[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  // Function to handle PDF download initiation
  const handleDownloadInvoice = async (booking) => {
    setLoadingInvoiceId(booking._id);
    try {
      // Generate the PDF blob
      const blob = await pdf(<BookingInvoice booking={booking} />).toBlob();

      // Create a Blob URL
      const url = URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${booking._id}.pdf`;

      // Append the link to the document and trigger a click
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link and revoking the Blob URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate invoice",
      });
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  return (
    <UserLayout>
      <Head>
        <title>My Bookings</title>
      </Head>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      Date
                      {sortField === "createdAt" && (
                        <span className="ml-2">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Travel Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell>
                          {format(new Date(booking.createdAt), "PP")}
                        </TableCell>
                        <TableCell>{booking.activityName}</TableCell>
                        <TableCell>{booking.packageName}</TableCell>
                        <TableCell>
                          {format(new Date(booking.travelDate), "PP")}
                        </TableCell>
                        <TableCell>
                          {booking.totalPrice.toLocaleString("th-TH", {
                            style: "currency",
                            currency: "THB",
                          })}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* View Button */}
                            <Button
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsModalOpen(true);
                              }}
                            >
                              View
                            </Button>

                            {/* Download Button */}
                            <Button
                              variant="ghost"
                              className="text-green-600 hover:text-green-800"
                              onClick={() => handleDownloadInvoice(booking)}
                              disabled={loadingInvoiceId === booking._id}
                            >
                              {loadingInvoiceId === booking._id ? (
                                <div className="flex items-center gap-2">
                                  <FiLoader className="animate-spin h-4 w-4" />
                                  Downloading...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <FiDownload className="h-4 w-4" />
                                  Download
                                </div>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="border rounded p-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>items per page</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="py-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
      />
    </UserLayout>
  );
}; // Proper closure of React.forwardRef

export default UserBookings;
