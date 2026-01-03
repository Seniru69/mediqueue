import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/home"); // 👉 Go to Home
    } catch (err) {
      setError("Invalid email or password");
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
              className="w-12 h-12 mb-2 rounded-sm"
            />
            <h2 className="text-xl font-semibold text-gray-800">Login</h2>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          {/* Inputs */}
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
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
