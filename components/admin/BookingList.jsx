import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FiDownload, FiLoader, FiEdit, FiTrash2 } from "react-icons/fi";

const BookingList = ({
  bookings,
  onViewBooking,
  onEditBooking,
  onDeleteBooking,
  loadingInvoiceId,
  handleDownloadInvoice,
}) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Guest Name</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
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
                {format(new Date(booking.travelDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {booking.totalPrice.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "THB",
                })}
              </TableCell>
              <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewBooking(booking)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditBooking(booking)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteBooking(booking)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
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
                        Download Invoice
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
  );
};

export default BookingList;
