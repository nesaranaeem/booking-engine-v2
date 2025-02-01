import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

const ActivitySummaryCard = ({
  activity,
  lowestPrice,
  nextAvailableDate,
  onViewPackages,
}) => {
  return (
    <Card className="shadow-lg border border-gray-100 rounded-xl overflow-hidden bg-white">
      <div className="p-6 space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Next available:</span>
            </div>
            <span className="font-semibold">
              {format(nextAvailableDate, "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Starting from:</span>
            <div className="text-2xl font-bold text-gray-900">
              {lowestPrice.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivitySummaryCard;
