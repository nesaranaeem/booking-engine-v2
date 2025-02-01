// pages/payment-result.js

import { useEffect } from "react";
import { useRouter } from "next/router";

const PaymentResult = () => {
  const router = useRouter();

  useEffect(() => {
    // Extract necessary data from query parameters or POST data
    // 2C2P sends the data via POST, so we might need to handle that
    // For simplicity, we'll assume the data is in the query parameters
    const { payment_status, order_id } = router.query;

    if (payment_status === "000") {
      // Payment successful
      router.push(`/booking/confirmation/${order_id}`);
    } else {
      // Payment failed
      router.push(`/booking/failure/${order_id}`);
    }
  }, [router]);

  return <div>Processing payment result...</div>;
};

export default PaymentResult;
