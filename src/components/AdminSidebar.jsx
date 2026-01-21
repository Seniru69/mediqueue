import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const linkClass = "flex items-center gap-3 px-6 py-3 text-sm transition";

  const activeClass =
    "bg-teal-100 border-r-4 border-teal-600 text-teal-700 font-medium";

  const inactiveClass = "text-gray-600 hover:bg-gray-100";

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/home");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r hidden md:block">
      {/* LOGO */}
      <div className="px-6 py-5 border-b">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-teal-600">MediQueue</span>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="mt-4 space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/appointments"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          📅 Appointments
        </NavLink>

        {/* DOCTORS */}
        <NavLink
          to="/admin/doctors"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          👨‍⚕️ Doctors
        </NavLink>

        {/* ADD DOCTOR */}
        <NavLink
          to="/admin/add-doctor"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          ➕ Add Doctor
        </NavLink>

        {/* PATIENTS */}
        <NavLink
          to="/admin/patients"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          👥 Patients
        </NavLink>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className={`${linkClass} text-red-600 hover:bg-red-50 w-full text-left`}
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
