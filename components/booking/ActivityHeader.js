import React from "react";
import { Badge } from "@/components/ui/badge";
import { FiClock, FiMapPin, FiCalendar } from "react-icons/fi";

const ActivityHeader = ({ activity }) => {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <img
          src={activity.imageUrl || "/images/placeholder-activity.jpg"}
          alt={activity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Activity Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{activity.name}</h1>
          <div className="flex flex-wrap gap-4 items-center text-sm md:text-base">
            <div className="flex items-center gap-2">
              <FiMapPin className="h-4 w-4" />
              <span>{activity.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="h-4 w-4" />
              <span>{activity.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4" />
              <span>{activity.operatingDays.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeader;
