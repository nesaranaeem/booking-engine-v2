// components/ui/loadingSpinner.js
import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-4">
      <FaSpinner className="animate-spin text-white text-4xl" />
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
