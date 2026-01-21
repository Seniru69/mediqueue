import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userName", res.data.name);

      if (res.data.role === "admin") {
        navigate("/admin/doctors");
      } else {
        navigate("/");
      }
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-50">
      <form
        className="bg-white w-[360px] p-8 rounded-xl shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center mb-4">
          <img
            src="/logo.png"
            alt="Mediqueue logo"
            className="w-12 h-12 mb-2"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            Login to Mediqueue
          </h2>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

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
          className="w-full mb-2 px-3 py-2 border rounded-lg"
        />

        {/* FORGOT PASSWORD */}
        <div className="text-right mb-4">
          <Link
            to="/forgot-password"
            className="text-sm text-teal-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600">
          Login
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-teal-600 font-medium hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
