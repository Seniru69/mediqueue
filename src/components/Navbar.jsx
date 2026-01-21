import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white px-16 py-4 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-blue-900"
      >
        <img src="/logo.png" alt="logo" className="w-8 h-8" />
        Mediqueue
      </Link>

      {/* Links */}
      <ul className="hidden md:flex gap-8 text-sm text-gray-700">
        <li>
          <Link to="/" className="hover:text-[#5aa7b4]">
            HOME
          </Link>
        </li>
        <li>
          <Link to="/alldoctors" className="hover:text-[#5aa7b4]">
            ALL DOCTORS
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-[#5aa7b4]">
            ABOUT
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-[#5aa7b4]">
            CONTACT
          </Link>
        </li>
      </ul>

      {/* Right Side */}
      {!token ? (
        /* NOT LOGGED IN */
        <Link
          to="/signup"
          className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-600 transition"
        >
          Create account
        </Link>
      ) : (
        /* LOGGED IN */
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-semibold">
              {userName?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {userName}
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg z-50">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                My Profile
              </Link>

              <Link
                to="/my-appointments"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                My Appointments
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
