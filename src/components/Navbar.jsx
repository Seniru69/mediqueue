import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-white px-16 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl font-bold text-blue-900">
        <img src="/logo.png" alt="logo" className="w-8 h-8" />
        Mediqueue
      </div>

      {/* Links */}
      <ul className="hidden md:flex gap-8 text-sm text-gray-700">
        <li>
          <Link to="/home">HOME</Link>
        </li>

        <li className="border-b-2 border-blue-500 pb-1">
          <Link to="/doctors">ALL DOCTORS</Link>
        </li>

        <li>
          <Link to="/about">ABOUT</Link>
        </li>

        <li>
          <Link to="/contact">CONTACT</Link>
        </li>
      </ul>

      {/* Button */}
      <Link
        to="/signup"
        className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm"
      >
        Create account
      </Link>
    </nav>
  );
}

export default Navbar;
