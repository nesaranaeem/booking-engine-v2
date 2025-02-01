// pages/booking/[id].js
import React, { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ActivityHeader from "@/components/booking/ActivityHeader";
import BookingForm from "@/components/booking/BookingForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ActivitySummaryCard from "@/components/booking/ActivitySummaryCard"; // Ensure correct path

import { format } from "date-fns"; // Ensure you have date-fns installed
import { FiCalendar, FiCheck, FiClock, FiMapPin, FiX } from "react-icons/fi";
import ActivityDetails from "@/components/booking/ActivityDetails";

const BookingPage = ({ activity, error }) => {
  const router = useRouter();
  const { addToast } = useToast();

  // State to manage loading spinner during form submission
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      addToast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, addToast]);

  // Early return if activity is not available
  if (!activity) {
    return (
      <>
        <Head>
          <title>Activity Not Found</title>
        </Head>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Activity Not Found
            </h1>
            <p className="mt-2 text-gray-600">
              The activity you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Mapping days of the week to numbers
  const dayNameToNumber = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  // Convert operating days to day numbers and ensure it's always an array
  const allowedDays =
    activity?.operatingDays?.map((day) => dayNameToNumber[day]) || [];

  // State Variables
  const [selectedPackage, setSelectedPackage] = useState("");
  const [travelDate, setTravelDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Default select the latest updated package
    if (activity.packages && activity.packages.length > 0) {
      const latestPackage = activity.packages[activity.packages.length - 1];
      setSelectedPackage(latestPackage._id);
      calculateTotalPrice(latestPackage._id, adults, children);
    }
  }, [activity.packages]);

  // Handler to select a package
  const handlePackageSelect = (pkgId) => {
    setSelectedPackage(pkgId);
    calculateTotalPrice(pkgId, adults, children);
  };

  // Handlers for guest counts
  const handleGuestCountChange = (type, value) => {
    if (type === "adults") {
      const newAdults = Math.max(1, value); // Ensure at least 1 adult
      setAdults(newAdults);
      calculateTotalPrice(selectedPackage, newAdults, children);
    } else {
      const newChildren = Math.max(0, value); // Ensure at least 0 children
      setChildren(newChildren);
      calculateTotalPrice(selectedPackage, adults, newChildren);
    }
  };

  // Calculate total price based on selected package and guest counts
  const calculateTotalPrice = (pkgId, adultsCount, childrenCount) => {
    const selectedPkg = activity.packages.find((pkg) => pkg._id === pkgId);
    if (selectedPkg) {
      const adultPrice = selectedPkg.adultPrice * adultsCount;
      const childPrice = selectedPkg.childPrice * childrenCount;
      setTotalPrice(adultPrice + childPrice);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all required fields
      if (
        !activity._id ||
        !selectedPackage ||
        !travelDate ||
        !guestName ||
        !nationality ||
        !email ||
        !phone
      ) {
        addToast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields.",
        });
        setIsLoading(false);
        return;
      }

      // Find selected package details
      const selectedPkg = activity.packages.find(
        (pkg) => pkg._id === selectedPackage
      );

      // Prepare booking data to be sent to the server
      const bookingInfo = {
        activityId: activity._id,
        packageId: selectedPackage,
        packageName: selectedPkg.name,
        activityName: activity.name,
        travelDate: travelDate.toISOString(),
        adults,
        children,
        guestName,
        nationality,
        email,
        phone,
        totalPrice,
      };

      // Store booking data in state
      setBookingData(bookingInfo);

      // Open payment modal
      setIsPaymentModalOpen(true);
    } catch (err) {
      console.error(err);
      addToast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = useCallback(
    async (paymentResult) => {
      if (!paymentResult?.bookingId) {
        throw new Error("Invalid payment result");
      }

      const mounted = useRef(true);
      const cleanupFns = [];
      try {
        addToast({
          title: "Payment Successful",
          description: "Your booking has been confirmed.",
        });
        if (mounted.current) {
          const unsubscribe = router.events.on("routeChangeComplete", () => {
            cleanupFns.forEach((fn) => fn());
          });
          cleanupFns.push(unsubscribe);
          await router.push(`/booking/order/${paymentResult.bookingId}`);
        }
        return Promise.resolve();
      } catch (error) {
        console.error("Payment success handler error:", error);
        addToast({
          variant: "destructive",
          title: "Navigation Error",
          description:
            "There was an error completing your booking. Please contact support.",
        });
        throw error;
      }
    },
    [addToast, router]
  );

  // Handle payment errors
  const handlePaymentError = (error) => {
    console.error(error);
    addToast({
      variant: "destructive",
      title: "Payment Failed",
      description: error.message || "An error occurred during payment.",
    });
  };

  // Function to handle scrolling to travel date section
  const scrollToTravelDate = () => {
    // First navigate to packages tab
    const packagesTab = document.querySelector('[value="packages"]');
    if (packagesTab) {
      packagesTab.click();
    }

    // Then scroll to travel date section
    setTimeout(() => {
      const travelDateSection = document.querySelector(
        '[data-section="travel-date"]'
      );
      if (travelDateSection) {
        const headerOffset = 100;
        const elementPosition = travelDateSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // After scrolling, try to open the date picker
        setTimeout(() => {
          const datePickerTrigger = document.querySelector(
            '[aria-label="Select travel date"]'
          );
          if (datePickerTrigger) {
            datePickerTrigger.click();
          }
        }, 1000);
      }
    }, 300);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}{" "}
      {/* Show Loading Spinner during form submission */}
      <Head>
        <title>{activity.name || "Activity"} - Booking</title>
      </Head>
      <Header />
      <ActivityHeader activity={activity} />
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-400 mx-2">/</span>
              </li>
              <li>
                <a
                  href="/activities"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Activities
                </a>
              </li>
              <li>
                <span className="text-gray-400 mx-2">/</span>
              </li>
              <li className="text-gray-900 font-medium">{activity.name}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ActivityDetails
              activity={activity}
              selectedPackage={selectedPackage}
              onPackageSelect={handlePackageSelect}
              travelDate={travelDate}
              setTravelDate={setTravelDate}
              allowedDays={allowedDays}
            />
          </div>

          {/* Booking Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ActivitySummaryCard
                activity={activity}
                lowestPrice={Math.min(
                  ...activity.packages.map((pkg) => pkg.adultPrice)
                )}
                nextAvailableDate={
                  new Date(new Date().setDate(new Date().getDate() + 1))
                }
                onViewPackages={() => {
                  const detailsTab =
                    document.querySelector('[value="overview"]');
                  if (detailsTab) detailsTab.click();
                }}
              />
              <BookingForm
                isLoading={isLoading}
                selectedPackage={selectedPackage}
                handlePackageSelect={handlePackageSelect}
                travelDate={travelDate}
                setTravelDate={setTravelDate}
                allowedDays={allowedDays}
                adults={adults}
                handleGuestCountChange={handleGuestCountChange}
                children={children}
                guestName={guestName}
                setGuestName={setGuestName}
                nationality={nationality}
                setNationality={setNationality}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                totalPrice={totalPrice}
                handleSubmit={handleSubmit}
                isPaymentModalOpen={isPaymentModalOpen}
                bookingData={bookingData}
                handlePaymentSuccess={handlePaymentSuccess}
                handlePaymentError={handlePaymentError}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { dbConnect, mongoose } = await import("@/lib/mongoose");
  await dbConnect();

  // Import and register the Package model before Activity
  const Package = (await import("@/models/Package")).default;

  // Import the Activity model
  const Activity = (await import("@/models/Activity")).default;

  if (!params?.id || !mongoose.Types.ObjectId.isValid(params.id)) {
    return {
      notFound: true,
    };
  }

  try {
    const activity = await Activity.findById(params.id)
      .populate({
        path: "packages",
        select: "-activity",
      })
      .lean()
      .exec();

    if (!activity) {
      return {
        notFound: true,
      };
    }

    // Sanitize and transform the data
    const sanitizedActivity = {
      ...activity,
      _id: activity._id.toString(),
      packages: Array.isArray(activity.packages)
        ? activity.packages.map((pkg) => ({
            ...pkg,
            _id: pkg._id.toString(),
            createdAt: pkg.createdAt?.toISOString() || null,
            updatedAt: pkg.updatedAt?.toISOString() || null,
          }))
        : [],
      createdAt: activity.createdAt?.toISOString() || null,
      updatedAt: activity.updatedAt?.toISOString() || null,
    };

    return {
      props: {
        activity: sanitizedActivity,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching activity:", error);
    return {
      props: {
        activity: null,
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Failed to load activity",
      },
    };
  }
}

export default BookingPage;
