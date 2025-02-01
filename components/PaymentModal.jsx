// components/PaymentModal.js

import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/store/slices/bookingSlice";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { FiX, FiLoader } from "react-icons/fi";
import axios from "axios";

const PaymentModal = ({ isOpen, onClose, bookingData, onSuccess, onError }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.booking);
  const { addToast } = useToast();
  const [buttonText, setButtonText] = useState("Proceed to Payment");

  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const handlePayment = async () => {
    dispatch(setLoading(true));
    setButtonText("Processing");
    addToast({
      title: "Processing",
      description: "Creating your account and preparing payment...",
    });

    try {
      // Prepare payment data for the server
      const paymentData = {
        payment_description: `Booking for ${bookingData.activityName}`,
        order_id: `INV-${Date.now()}`,
        amount: bookingData.totalPrice,
        customer_email: bookingData.email,
        frontendReturnUrl: `${ROOT_DOMAIN}/api/payment-callback`,
        backendReturnUrl: `${ROOT_DOMAIN}/api/payment-callback`,
        cancel_url: `${ROOT_DOMAIN}/api/payment-callback`,
        user_defined_1: "", // Will set this after creating the booking
      };

      console.log("Sending paymentData to server:", paymentData);

      addToast({
        title: "Creating Booking",
        description: "Please wait while we process your booking...",
      });

      // Generate payment token
      const paymentToken = `PMT-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Generate random password that meets minimum length requirement (12 chars)
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-4);

      // **Important:** Do NOT hash the password on the frontend.
      // Send the plaintext password securely to the backend.
      // The backend will handle hashing and emailing the credentials.

      // Try to create user account first
      try {
        const userResponse = await axios.post("/api/users/create", {
          name: bookingData.guestName,
          email: bookingData.email,
          password: randomPassword, // Send plaintext password to server
        });

        if (userResponse.data.created) {
          addToast({
            title: "Account Created",
            description:
              "Your account has been created automatically. Check your email for credentials.",
          });
        }
      } catch (userError) {
        if (userError.response?.status === 409) {
          // Handle case where user already exists (e.g., status 409 Conflict)
          addToast({
            variant: "warning",
            title: "Account Exists",
            description:
              "An account with this email already exists. Proceeding with booking...",
          });
        } else {
          console.error("Error creating user:", userError);
          addToast({
            variant: "destructive",
            title: "Account Creation Failed",
            description: "Continuing with booking process...",
          });
        }
      }

      // Create the booking
      const bookingResponse = await axios.post("/api/bookings", {
        activityId: bookingData.activityId,
        activityName: bookingData.activityName,
        packageId: bookingData.packageId,
        packageName: bookingData.packageName,
        travelDate: bookingData.travelDate,
        adults: bookingData.adults,
        children: bookingData.children,
        guestName: bookingData.guestName,
        nationality: bookingData.nationality,
        email: bookingData.email,
        phone: bookingData.phone,
        totalPrice: bookingData.totalPrice,
        paymentStatus: "Pending",
        paymentToken: paymentToken,
        activity: bookingData.activityId, // Explicitly set the activity field
      });

      const { bookingId } = bookingResponse.data;
      console.log("Created booking with ID:", bookingId);

      // Update user_defined_1 with bookingId
      paymentData.user_defined_1 = bookingId;

      // Initiate payment
      const response = await axios.post("/api/initiate-payment", {
        ...paymentData,
        bookingId,
        paymentToken,
        frontendReturnUrl: `${ROOT_DOMAIN}/api/payment-callback`,
        backendReturnUrl: `${ROOT_DOMAIN}/api/payment-callback`,
        cancel_url: `${ROOT_DOMAIN}/api/payment-callback`,
      });

      const { paymentRequest } = response.data;

      console.log("Created booking and received paymentRequest:", {
        bookingId,
        paymentRequest,
      });

      // Create a form and submit it for payment processing
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://t.2c2p.com/RedirectV3/payment";

      for (const [key, value] of Object.entries(paymentRequest)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
      dispatch(setLoading(false));
      setButtonText("Proceed to Payment"); // Maintain consistency
      onError(
        error.response?.data?.error || "Payment failed. Please try again."
      );
    }
  };

  return (
    <>
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
              {/* Header */}
              <Dialog.Title className="flex justify-between items-center p-4 border-b text-lg font-semibold">
                Payment Details
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <FiX className="text-2xl" />
                </button>
              </Dialog.Title>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Activity Details</h3>
                  <p>Activity: {bookingData.activityName}</p>
                  <p>Package: {bookingData.packageName}</p>
                  <p>
                    Guests: {bookingData.adults} Adult
                    {bookingData.adults !== 1 ? "s" : ""}
                    {bookingData.children > 0
                      ? ` & ${bookingData.children} Child${
                          bookingData.children !== 1 ? "ren" : ""
                        }`
                      : ""}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Pricing</h3>
                  <p>
                    Total Price:{" "}
                    {bookingData.totalPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    THB
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Customer Details</h3>
                  <p>Name: {bookingData.guestName}</p>
                  <p>Email: {bookingData.email}</p>
                  <p>Phone: {bookingData.phone}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-4">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handlePayment} disabled={isLoading}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-6 max-w-sm w-full mx-4">
            <div className="relative">
              <FiLoader className="w-16 h-16 text-blue-600 animate-spin" />
              <div className="absolute inset-0 rounded-full border-t-2 border-blue-600 animate-ping"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-gray-800">Processing Payment</p>
              <p className="text-gray-600">Please wait while we process your payment...</p>
              <p className="text-sm text-red-600 font-medium">Do not close or refresh this window</p>
            </div>
          </div>
        </div>
      ) : null}
      </>
  );
};

export default PaymentModal;
