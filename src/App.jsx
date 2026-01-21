import { Routes, Route } from "react-router-dom";

/* PUBLIC PAGES */
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import AllDoctors from "./pages/AllDoctors";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import ContactSection from "./pages/Contact";
import Profile from "./pages/Profile";
import PaymentPage from "./pages/Payment";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ADMIN PAGES  */
import DoctorsList from "./pages/admin/DoctorsList";
import AddDoctor from "./pages/admin/AddDoctor";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminPatients from "./pages/admin/AdminPatients";

/* LAYOUT  */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        <Routes>
          {/*  PUBLIC ROUTES  */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/about" element={<About />} />
          <Route path="/alldoctors" element={<AllDoctors />} />
          <Route path="/appointment/:doctorId" element={<Appointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/*  ADMIN ROUTES  */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/patients"
            element={
              <ProtectedAdminRoute>
                <AdminPatients />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/add-doctor"
            element={
              <ProtectedAdminRoute>
                <AddDoctor />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/doctors"
            element={
              <ProtectedAdminRoute>
                <DoctorsList />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/appointments"
            element={
              <ProtectedAdminRoute>
                <AdminAppointments />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
