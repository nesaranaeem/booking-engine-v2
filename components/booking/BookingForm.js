// components/booking/BookingForm.js

import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { setBookingData } from "@/store/slices/bookingSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FiCalendar,
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PaymentModal from "@/components/PaymentModal";
import ReactSelect from "react-select";
import countryList from "react-select-country-list";

const BookingForm = ({
  datePickerOnly,
  isVisible,
  isLoading,
  selectedPackage,
  handlePackageSelect,
  travelDate,
  setTravelDate,
  allowedDays,
  adults,
  handleGuestCountChange,
  children,
  guestName,
  setGuestName,
  nationality,
  setNationality,
  email,
  setEmail,
  phone,
  setPhone,
  totalPrice,
  handleSubmit,
  isPaymentModalOpen,
  bookingData,
  handlePaymentSuccess,
  handlePaymentError,
  setIsPaymentModalOpen,
}) => {
  // Memoize the country options
  const options = useMemo(() => countryList().getData(), []);

  // Find the selected country option
  const selectedCountry = options.find(
    (option) => option.label === nationality
  );

  return (
    <Card className="shadow-xl border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300 sticky top-24">
      <CardContent className="relative">
        {datePickerOnly ? (
          <div className="p-4 border border-gray-200 shadow-sm rounded-md bg-white">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  aria-label="Select travel date"
                  className={`w-full flex items-center justify-between px-3 py-2 border ${
                    travelDate ? "border-blue-500" : "border-gray-300"
                  } rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                >
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span
                      className={`${
                        !travelDate ? "text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {travelDate
                        ? format(travelDate, "MMMM d, yyyy")
                        : "Select travel date"}
                    </span>
                  </div>
                  <div className="text-gray-400">▼</div>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 p-2"
                  sideOffset={5}
                >
                  <div className="relative">
                    <DatePicker
                      selected={travelDate}
                      onChange={(date) => {
                        setTravelDate(date);
                        // Close the popover after date selection
                        const popover = document.querySelector(
                          "[data-radix-popper-content-wrapper]"
                        );
                        if (popover) {
                          const closeButton =
                            popover.parentElement?.querySelector(
                              '[data-state="open"]'
                            );
                          if (closeButton) closeButton.click();
                        }
                      }}
                      minDate={
                        new Date(new Date().setDate(new Date().getDate() + 1))
                      }
                      filterDate={(date) =>
                        Array.isArray(allowedDays) &&
                        allowedDays.includes(date.getDay())
                      }
                      inline
                      required
                      dateFormat="MMMM d, yyyy"
                      calendarClassName="!border-0 shadow-lg rounded-lg"
                      wrapperClassName="!block"
                    />
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        ) : (
          <>
            {isLoading && <LoadingSpinner />}
            {/* Show either form or view packages button */}
            {travelDate && selectedPackage ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Number of Adults */}
                  <div className="p-4 border border-gray-200 shadow-sm rounded-md">
                    <Label
                      htmlFor="adults"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Number of Adults
                    </Label>
                    <div className="flex items-center">
                      <FiUser className="text-gray-500 mr-3" />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleGuestCountChange(
                              "adults",
                              adults > 1 ? adults - 1 : 1
                            )
                          }
                          className={`p-2 border border-gray-300 rounded-l-md ${
                            adults <= 1
                              ? "cursor-not-allowed opacity-50"
                              : "hover:bg-gray-100"
                          }`}
                          disabled={adults <= 1}
                          aria-label="Decrease number of adults"
                        >
                          <FiMinus />
                        </button>
                        <Input
                          id="adults"
                          type="number"
                          min="1"
                          value={adults}
                          onChange={(e) =>
                            handleGuestCountChange(
                              "adults",
                              parseInt(e.target.value) || 1
                            )
                          }
                          required
                          className="w-12 text-center border-t border-b border-gray-300"
                          aria-label="Number of adults"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleGuestCountChange("adults", adults + 1)
                          }
                          className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                          aria-label="Increase number of adults"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Number of Children */}
                  <div className="p-4 border border-gray-200 shadow-sm rounded-md">
                    <Label
                      htmlFor="children"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Number of Children
                    </Label>
                    <div className="flex items-center">
                      <FiUsers className="text-gray-500 mr-3" />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleGuestCountChange(
                              "children",
                              children > 0 ? children - 1 : 0
                            )
                          }
                          className={`p-2 border border-gray-300 rounded-l-md ${
                            children <= 0
                              ? "cursor-not-allowed opacity-50"
                              : "hover:bg-gray-100"
                          }`}
                          disabled={children <= 0}
                          aria-label="Decrease number of children"
                        >
                          <FiMinus />
                        </button>
                        <Input
                          id="children"
                          type="number"
                          min="0"
                          value={children}
                          onChange={(e) =>
                            handleGuestCountChange(
                              "children",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-12 text-center border-t border-b border-gray-300"
                          aria-label="Number of children"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleGuestCountChange("children", children + 1)
                          }
                          className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                          aria-label="Increase number of children"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Guest Name */}
                  <div className="p-4 border border-gray-200 shadow-sm rounded-md bg-white hover:shadow-md transition-shadow">
                    <Label
                      htmlFor="guestName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Guest Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-500" />
                      </div>
                      <Input
                        id="guestName"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        className="w-full pl-10 h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                        aria-label="Guest Name"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Nationality */}
                  <div className="p-4 border border-gray-200 shadow-sm rounded-md bg-white hover:shadow-md transition-shadow">
                    <Label
                      htmlFor="nationality"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Nationality
                    </Label>
                    <div className="relative">
                      <ReactSelect
                        id="nationality"
                        options={options}
                        value={selectedCountry}
                        onChange={(selected) => setNationality(selected.label)}
                        placeholder="Select your nationality"
                        classNamePrefix="react-select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            height: "48px",
                            paddingLeft: "40px",
                            borderColor: "#d1d5db", // Gray-300
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#3b82f6", // Blue-500
                            },
                          }),
                          option: (provided) => ({
                            ...provided,
                            display: "flex",
                            alignItems: "center",
                          }),
                        }}
                        formatOptionLabel={(option) => (
                          <div className="flex items-center">
                            <span
                              className={`fi fi-${option.value.toLowerCase()} mr-2`}
                            ></span>
                            <span>{option.label}</span>
                          </div>
                        )}
                        isSearchable
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-4 border border-gray-200 shadow-sm rounded-md bg-white hover:shadow-md transition-shadow">
                    <Label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-500" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                        aria-label="Email Address"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="p-4 border border-gray-200 shadow-sm rounded-md bg-white hover:shadow-md transition-shadow">
                    <Label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </Label>
                    <div className="flex items-center relative">
                      <FiPhone className="mr-2 text-gray-500" />
                      <PhoneInput
                        country={"us"}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        inputClass="flex-1"
                        inputStyle={{ width: "100%" }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="text-right text-2xl font-bold text-gray-800 mt-6">
                  Total Price:{" "}
                  {totalPrice.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                  })}{" "}
                </div>

                {/* Floating Mobile Button */}
                {!datePickerOnly && (
                  <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg md:hidden">
                    {travelDate && selectedPackage ? (
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md shadow-md transition duration-300"
                      >
                        Proceed to Payment -{" "}
                        {totalPrice.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                        })}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          // First navigate to packages tab
                          const packagesTab =
                            document.querySelector('[value="packages"]');
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
                              const elementPosition =
                                travelDateSection.getBoundingClientRect().top;
                              const offsetPosition =
                                elementPosition +
                                window.pageYOffset -
                                headerOffset;

                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth",
                              });

                              // After scrolling, try to open the date picker
                              setTimeout(() => {
                                const datePickerTrigger =
                                  document.querySelector(
                                    '[aria-label="Select travel date"]'
                                  );
                                if (datePickerTrigger) {
                                  datePickerTrigger.click();
                                }
                              }, 1000);
                            }
                          }, 300);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md shadow-md transition duration-300"
                      >
                        View Packages
                      </Button>
                    )}
                  </div>
                )}

                {/* Desktop Submit Button */}
                {travelDate && selectedPackage && (
                  <div className="hidden md:block">
                    <Button
                      type="submit"
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md shadow-md transition duration-300"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                )}
              </form>
            ) : (
              <>
                {/* Desktop View Packages */}
                <div className="hidden md:block p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Ready to Book?
                    </h3>
                    <p className="text-gray-600">
                      Select your travel date and package to begin booking
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        // First navigate to packages tab
                        const packagesTab =
                          document.querySelector('[value="packages"]');
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
                            const elementPosition =
                              travelDateSection.getBoundingClientRect().top;
                            const offsetPosition =
                              elementPosition +
                              window.pageYOffset -
                              headerOffset;

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
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg shadow-lg transition duration-300 text-lg font-medium"
                    >
                      View Available Packages
                    </Button>
                  </div>
                </div>

                {/* Mobile Floating Button */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50">
                  <Button
                    type="button"
                    onClick={() => {
                      // First navigate to packages tab
                      const packagesTab =
                        document.querySelector('[value="packages"]');
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
                          const elementPosition =
                            travelDateSection.getBoundingClientRect().top;
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
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg shadow-md transition duration-300 text-base font-medium"
                  >
                    View Available Packages
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>

      {/* Payment Modal */}
      {isPaymentModalOpen && bookingData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </Card>
  );
};

export default BookingForm;
