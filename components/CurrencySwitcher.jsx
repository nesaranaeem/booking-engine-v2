import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const CurrencySwitcher = ({ amount, onCurrencyChange }) => {
  const [rates, setRates] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("THB");
  const { addToast } = useToast();

  const currencies = ["THB", "USD", "BDT", "INR"];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/THB`
        );
        const data = await response.json();
        setRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchRates();
  }, []);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    if (rates) {
      const convertedAmount = amount * rates[currency];
      onCurrencyChange(convertedAmount, currency);

      addToast({
        title: "Currency Switched",
        description:
          "This is only for reference. All transactions will be processed in THB.",
        duration: 3000,
      });
    }
  };

  if (!rates) return null;

  return (
    <div className="flex gap-2 justify-center mb-4">
      {currencies.map((currency) => (
        <Button
          key={currency}
          onClick={() => handleCurrencyChange(currency)}
          variant={selectedCurrency === currency ? "default" : "outline"}
          className={`px-4 py-2 ${
            selectedCurrency === currency
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {currency}
        </Button>
      ))}
    </div>
  );
};

export default CurrencySwitcher;
