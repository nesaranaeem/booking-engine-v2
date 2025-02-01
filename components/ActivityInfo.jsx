// components/ActivityInfo.js

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CurrencySwitcher from "./CurrencySwitcher"; // Assuming you have this component
import { Badge } from "@/components/ui/badge";

const ActivityInfo = ({ activity, selectedPackage, handlePackageSelect }) => {
  const [currentCurrency, setCurrentCurrency] = useState("THB");
  const [convertedAdultPrice, setConvertedAdultPrice] = useState(null);
  const [convertedChildPrice, setConvertedChildPrice] = useState(null);

  const handleCurrencyChange = (pkg) => (convertedAmount, currency) => {
    setCurrentCurrency(currency);
    setConvertedAdultPrice(convertedAmount);
    setConvertedChildPrice(convertedAmount * (pkg.childPrice / pkg.adultPrice));
  };

  return (
    <Card className="mb-8 shadow-xl border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-2xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          {activity.name}
        </CardTitle>
        <p className="text-lg text-gray-700 mt-4 leading-relaxed">
          {activity.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-inner">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Operating Days
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {activity.operatingDays.map((day) => (
              <span
                key={day}
                className="px-4 py-2 bg-white rounded-full text-gray-700 shadow-sm border border-gray-200 font-medium"
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Available Packages
            </span>
          </h3>
          <div className="flex flex-col items-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center w-full max-w-5xl mx-auto">
              {activity.packages.map((pkg) => (
                <button
                  key={pkg._id}
                  type="button"
                  onClick={() => handlePackageSelect(pkg._id)}
                  className="w-full max-w-sm transform transition-all duration-300 hover:scale-105"
                  aria-label={`Select package ${pkg.name}`}
                >
                  <div
                    className={`
                      relative p-6 rounded-xl transition-all duration-300
                      ${
                        selectedPackage === pkg._id
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl"
                          : "bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white shadow-md hover:shadow-xl"
                      }
                    `}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
                      <div className="absolute transform rotate-45 bg-opacity-20 bg-white w-20 h-20"></div>
                    </div>
                    <div className="relative">
                      {selectedPackage === pkg._id && (
                        <Badge className="absolute -top-3 -right-3 bg-green-500">
                          Selected
                        </Badge>
                      )}
                      <h4 className="text-xl font-bold mb-4">{pkg.name}</h4>
                      <CurrencySwitcher
                        amount={pkg.adultPrice}
                        onCurrencyChange={handleCurrencyChange(pkg)}
                      />
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">
                          Adult:{" "}
                          {currentCurrency === "THB"
                            ? `${
                                pkg.adultPrice
                                  ? Number(pkg.adultPrice).toLocaleString()
                                  : "N/A"
                              } THB`
                            : `${
                                convertedAdultPrice?.toFixed(2) || "N/A"
                              } ${currentCurrency}`}
                        </p>
                        <p className="text-lg font-semibold">
                          Child:{" "}
                          {currentCurrency === "THB"
                            ? `${
                                pkg.childPrice
                                  ? Number(pkg.childPrice).toLocaleString()
                                  : "N/A"
                              } THB`
                            : `${
                                convertedChildPrice?.toFixed(2) || "N/A"
                              } ${currentCurrency}`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-opacity-20">
                      <p className="opacity-90">{pkg.inclusions}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityInfo;
