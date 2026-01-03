import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register", form);
      navigate("/"); // go to login after successful register
    } catch (err) {
      setError("Registration failed");
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-[360px] p-8 rounded-xl shadow-lg"
        >
          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/logo.png"
              alt="Mediqueue logo"
              className="w-12 h-12 mb-2"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Create Account
            </h2>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">
              {error}
            </p>
          )}

          {/* Inputs */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded-lg"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded-lg"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 border rounded-lg"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
