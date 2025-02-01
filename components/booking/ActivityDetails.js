import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Ensure correct path
import * as Popover from "@radix-ui/react-popover"; // If using Radix UI
import {
  FiInfo,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const ActivityDetails = ({
  activity,
  selectedPackage,
  onPackageSelect,
  travelDate,
  setTravelDate,
  allowedDays,
}) => {
  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold mb-6">About This Activity</h2>
        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
          {activity?.description || "No description available"}
        </p>
      </div>

      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold mb-6">Highlights</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activity?.highlights?.map((highlight, index) => (
            <li key={index} className="flex items-start gap-3">
              <FiCheck className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Travel Date */}
      <div
        className="p-4 border border-gray-200 shadow-sm rounded-md bg-white"
        data-section="travel-date"
      >
        <h2 className="text-xl font-semibold mb-4">Travel Date</h2>
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
                      const closeButton = popover.parentElement?.querySelector(
                        '[data-state="open"]'
                      );
                      if (closeButton) closeButton.click();
                    }
                  }}
                  minDate={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                  }
                  filterDate={(date) => {
                    if (!Array.isArray(allowedDays) || allowedDays.length === 0)
                      return true;
                    return allowedDays.includes(date.getDay());
                  }}
                  inline
                  required
                  dateFormat="MMMM d, yyyy"
                  calendarClassName="!border-0 shadow-lg rounded-lg"
                  wrapperClassName="!block"
                  dayClassName={(date) =>
                    Array.isArray(allowedDays) && allowedDays.length > 0
                      ? allowedDays.includes(date.getDay())
                      : true
                      ? "hover:bg-blue-100 rounded-full hover:text-blue-600 transition-colors"
                      : "text-gray-300 cursor-not-allowed"
                  }
                  monthClassName="font-semibold text-gray-800"
                  weekDayClassName={() => "font-medium text-gray-600 py-2"}
                />
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Package Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Your Package</h2>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedPackage}
          onChange={(e) => onPackageSelect(e.target.value)}
        >
          <option value="">Select a package</option>
          {[
            ...new Set(activity.packages.map((pkg) => JSON.stringify(pkg))),
          ].map((pkgStr) => {
            const pkg = JSON.parse(pkgStr);
            return (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name} -{" "}
                {pkg.adultPrice.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "THB",
                })}{" "}
                per adult
              </option>
            );
          })}
        </select>
      </Card>

      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold mb-6">Important Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FiCheck className="text-green-500" /> What's Included
            </h3>
            <ul className="space-y-3">
              {activity.included?.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FiCheck className="h-5 w-5 text-green-500 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FiX className="text-red-500" /> What's Not Included
            </h3>
            <ul className="space-y-3">
              {activity.notIncluded?.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FiX className="h-5 w-5 text-red-500 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <FiAlertCircle className="text-blue-500" />
          Cancellation Policy
        </h2>
        <p className="text-gray-700 leading-relaxed">{activity.cancellationPolicy}</p>
      </div>
    </div>
  );
};

ActivityDetails.propTypes = {
  activity: PropTypes.object.isRequired,
  selectedPackage: PropTypes.string,
  onPackageSelect: PropTypes.func,
  travelDate: PropTypes.instanceOf(Date),
  setTravelDate: PropTypes.func.isRequired,
  allowedDays: PropTypes.arrayOf(PropTypes.number),
};

export default ActivityDetails;
