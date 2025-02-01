// pages/admin/bookings.js
import { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import BookingDetailsModal from "@/components/admin/BookingDetailsModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingInvoice from "@/components/booking/BookingInvoice";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Head from "next/head";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const { addToast } = useToast();

  const limitOptions = [5, 10, 25, 50];

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token, page, limit, sortField, sortOrder]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit,
          sortField,
          sortOrder,
        },
      });
      setBookings(res.data.bookings ?? []);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      addToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Manage Bookings</title>
      </Head>
      <AdminLayout>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Bookings</CardTitle>
            <div className="flex items-center gap-4">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded p-1"
              >
                {limitOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    Show {opt}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSortField("guestName");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Guest Name{" "}
                    {sortField === "guestName" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSortField("travelDate");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Date{" "}
                    {sortField === "travelDate" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSortField("totalPrice");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Price{" "}
                    {sortField === "totalPrice" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSortField("paymentStatus");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Status{" "}
                    {sortField === "paymentStatus" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="8" className="text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-mono text-sm">
                        {booking._id.slice(-6)}
                      </TableCell>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell>{booking.activityName}</TableCell>
                      <TableCell>
                        {new Date(booking.travelDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("th-TH", {
                          style: "currency",
                          currency: "THB",
                        }).format(booking.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${
                            booking.paymentStatus === "Completed"
                              ? "bg-green-100 text-green-800"
                              : booking.paymentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsModalOpen(true);
                            }}
                          >
                            View
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                            onClick={() => {
                              const downloadContainer =
                                document.createElement("div");
                              downloadContainer.style.display = "none";
                              document.body.appendChild(downloadContainer);

                              const btn = document.querySelector(
                                `button[data-booking-id="${booking._id}"]`
                              );
                              const originalText = btn.innerHTML;
                              btn.innerHTML = `
                                <div class="flex items-center gap-2">
                                  <FiDownload className="h-4 w-4" />
                                  Generating Invoice...
                                </div>
                              `;
                              element.style.display = "none";
                              document.body.appendChild(element);

                              const downloadLink = (
                                <PDFDownloadLink
                                  document={
                                    <BookingInvoice booking={booking} />
                                  }
                                  fileName={`invoice-${booking._id}.pdf`}
                                >
                                  {({ blob, url, loading, error }) => {
                                    if (loading) return null;
                                    if (error) {
                                      btn.innerHTML = originalText;
                                      element.remove();
                                      return null;
                                    }
                                    if (blob) {
                                      const link = document.createElement("a");
                                      link.href = url;
                                      link.download = `invoice-${booking._id}.pdf`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      setTimeout(() => {
                                        btn.innerHTML = originalText;
                                        element.remove();
                                      }, 1000);
                                    }
                                    return null;
                                  }}
                                </PDFDownloadLink>
                              );
                              ReactDOM.render(downloadLink, element);
                            }}
                            data-booking-id={booking._id}
                          >
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                              Download Invoice
                            </div>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, bookings.length)} of {totalPages * limit}{" "}
              entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
        {/* Booking Details Modal */}
        <BookingDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
        />
      </AdminLayout>
    </>
  );
};

export default AdminBookings;
