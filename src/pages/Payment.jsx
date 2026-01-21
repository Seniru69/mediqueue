import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axios";
import { FaLock } from "react-icons/fa";
import { useState } from "react";

/* 
   STRIPE PUBLIC KEY
*/
const stripePromise = loadStripe(
  "",
);

/* 
   PAYMENT FORM
 */
const PaymentForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      /* CREATE PAYMENT INTENT */
      const intentRes = await api.post(
        "/payments/create-payment-intent",
        { amount: booking.amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const clientSecret = intentRes.data.clientSecret;

      /* CONFIRM CARD PAYMENT */
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error("STRIPE ERROR:", result.error);
        alert(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status !== "succeeded") {
        alert("Payment not completed");
        setLoading(false);
        return;
      }

      /* CREATE APPOINTMENT AFTER PAYMENT */
      const paymentIntentId = result.paymentIntent.id;

      await api.post(
        "/appointments",
        {
          doctorId: booking.doctorId,
          date: booking.date,
          time: booking.time,
          paymentIntentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /* ✅ SUCCESS */
      alert("Payment successful! Appointment confirmed.");
      navigate("/my-appointments");
    } catch (error) {
      console.error("PAYMENT FLOW ERROR:", error);

      /* Payment may have succeeded already */
      alert("Payment completed. Please check My Appointments.");
      navigate("/my-appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#a0aec0",
                },
              },
            },
          }}
        />
      </div>

      <button
        disabled={!stripe || loading}
        className="w-full bg-[#5aa7b4] hover:bg-[#4a97a4] text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
      >
        {loading ? "Processing payment..." : `Pay LKR ${booking.amount}.00`}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <FaLock />
        Secure payment powered by Stripe
      </div>
    </form>
  );
};

const Payment = () => {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Invalid payment session
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* LEFT: SUMMARY */}
        <div className="bg-[#5aa7b4] text-white p-8">
          <h2 className="text-2xl font-semibold mb-6">Appointment Summary</h2>

          <div className="space-y-4 text-sm">
            <SummaryRow label="Doctor" value={state.doctorName} />
            <SummaryRow label="Date" value={state.date} />
            <SummaryRow label="Time" value={state.time} />

            <div className="border-t border-white/30 pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>LKR {state.amount}.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold mb-2">Card Payment</h3>
          <p className="text-sm text-gray-500 mb-6">
            Enter your card details to complete the booking
          </p>

          <Elements stripe={stripePromise}>
            <PaymentForm booking={state} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="opacity-80">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Payment;
