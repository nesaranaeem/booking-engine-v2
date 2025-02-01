// components/admin/BookingDetailsModal.jsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { FiX } from "react-icons/fi";
import { format } from "date-fns";

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="relative w-11/12 sm:w-4/5 lg:w-3/5 xl:w-2/5 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Booking Information */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Booking Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Booking ID:</div>
                  <div>{booking._id}</div>
                  <div className="text-gray-600">Activity:</div>
                  <div>{booking.activityName}</div>
                  <div className="text-gray-600">Package:</div>
                  <div>{booking.packageName}</div>
                  <div className="text-gray-600">Travel Date:</div>
                  <div>{formatDate(booking.travelDate)}</div>
                  <div className="text-gray-600">Payment Status:</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${booking.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                        booking.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Guest Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Name:</div>
                  <div>{booking.guestName}</div>
                  <div className="text-gray-600">Email:</div>
                  <div>{booking.email}</div>
                  <div className="text-gray-600">Phone:</div>
                  <div>{booking.phone}</div>
                  <div className="text-gray-600">Nationality:</div>
                  <div>{booking.nationality}</div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Booking Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Adults:</div>
                  <div>{booking.adults}</div>
                  <div className="text-gray-600">Children:</div>
                  <div>{booking.children}</div>
                  <div className="text-gray-600">Total Price:</div>
                  <div>{formatCurrency(booking.totalPrice)}</div>
                </div>
              </div>

              {/* Payment Details */}
              {booking.paymentDetails && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Transaction Ref:</div>
                    <div>{booking.paymentToken}</div>
                    <div className="text-gray-600">Payment Channel:</div>
                    <div>{booking.paymentDetails.channelCode || 'N/A'}</div>
                    <div className="text-gray-600">Card Number:</div>
                    <div>{booking.paymentDetails.cardNo || 'N/A'}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4 flex justify-end">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default BookingDetailsModal;
