import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", { email });

      setMessage(
        "If an account exists for this email, a password reset link has been sent.",
      );
    } catch (err) {
      setError("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[380px] p-8 rounded-xl shadow-lg"
      >
        {/* LOGO */}
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="Mediqueue" className="w-12 h-12 mb-2" />
          <h2 className="text-xl font-semibold text-gray-800">
            Forgot Password
          </h2>
          <p className="text-xs text-gray-500 text-center mt-1">
            Enter your email and we’ll send you a reset link
          </p>
        </div>

        {/* SUCCESS */}
        {message && (
          <p className="text-green-600 text-sm text-center mb-3">{message}</p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {/* BACK TO LOGIN */}
        <p className="text-xs text-center text-gray-500 mt-4">
          Remembered your password?{" "}
          <Link to="/" className="text-teal-600 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
