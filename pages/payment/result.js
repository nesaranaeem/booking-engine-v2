// pages/payment/result.js

import { useEffect } from "react";
import { useRouter } from "next/router";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

const PaymentResult = () => {
  const router = useRouter();
  const { query, isReady } = router;
  const { orderRef, status, bookingId, payment_status } = query; // Combined query parameters
  const { addToast } = useToast();

  useEffect(() => {
    if (!isReady) return; // Ensure the router is ready

    const handlePaymentResult = async () => {
      // Handle payment status from the second component
      if (payment_status === "success" || payment_status === "0") {
        addToast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          variant: "success",
        });

        if (bookingId) {
          router.push(`/booking/confirmation/${bookingId}`);
        } else if (orderRef && status === "Success") {
          // Proceed with booking creation from the first component
          try {
            // Fetch the temporary booking data associated with orderRef
            // This could be stored in a temporary collection or passed via query parameters securely
            // For demonstration, we'll assume all necessary data is passed via query params (not recommended for production)

            const {
              packageId,
              travelDate,
              adults,
              children,
              guestName,
              nationality,
              email,
              phone,
              totalPrice,
            } = query;

            // Validate required data
            if (
              !packageId ||
              !travelDate ||
              !guestName ||
              !nationality ||
              !email ||
              !phone ||
              !totalPrice
            ) {
              addToast({
                variant: "destructive",
                title: "Invalid Data",
                description: "Missing booking information.",
              });
              return;
            }

            // Connect to the database
            await dbConnect();

            // Generate a unique invoice number
            const invoiceNo = `INV-${uuidv4()}`; // Customize as needed

            // Create the booking
            const booking = new Booking({
              package: packageId,
              travelDate: new Date(travelDate),
              adults: parseInt(adults, 10),
              children: parseInt(children, 10),
              guestName,
              nationality,
              email,
              phone,
              totalPrice: parseFloat(totalPrice),
              paymentStatus: "Completed",
              invoiceNo,
            });

            await booking.save();

            addToast({
              title: "Booking Successful",
              description: "Your booking has been confirmed.",
            });

            // Redirect to confirmation page
            router.push(`/booking/confirmation/${booking._id}`);
          } catch (error) {
            console.error("Booking Creation Error:", error);
            addToast({
              variant: "destructive",
              title: "Booking Failed",
              description:
                "There was an error creating your booking. Please contact support.",
            });
          }
        } else {
          router.push("/"); // Fallback to home if no booking ID
        }
      } else {
        // Handle payment failure from both components
        addToast({
          title: "Payment Failed",
          description:
            "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        });
        router.push("/"); // Redirect to home on failure
      }
    };

    handlePaymentResult();
  }, [isReady, query]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600">
        {orderRef && status === "Success"
          ? "Processing your payment and booking..."
          : "Processing your payment..."}
      </p>
    </div>
  );
};

export default PaymentResult;
