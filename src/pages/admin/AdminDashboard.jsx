import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  CalendarX,
  Download,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (error) {
      console.error("Dashboard load failed", error);
    }
  };

  /* ================= CSV EXPORT ================= */
  const exportCSV = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/export/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "appointments.csv";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("CSV export failed");
    } finally {
      setExporting(false);
    }
  };

  if (!stats) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-10 text-gray-500">
          Loading dashboard...
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-gray-50">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>

          <button
            onClick={exportCSV}
            disabled={exporting}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition disabled:opacity-60"
          >
            <Download size={16} />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Registered Users"
            value={stats.users}
            icon={<Users size={26} />}
            gradient="from-blue-500 to-blue-600"
          />

          <StatCard
            title="Doctors"
            value={stats.doctors}
            icon={<Stethoscope size={26} />}
            gradient="from-teal-500 to-teal-600"
          />

          <StatCard
            title="Total Appointments"
            value={stats.appointments}
            icon={<CalendarCheck size={26} />}
            gradient="from-emerald-500 to-emerald-600"
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={<CalendarX size={26} />}
            gradient="from-red-500 to-red-600"
          />
        </div>

        {/* ================= ANALYTICS ================= */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Appointments – Last 7 Days
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#5aa7b4"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

/* ================= UI COMPONENT ================= */

const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`rounded-2xl p-6 text-white shadow bg-gradient-to-br ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>

      <div className="bg-white/20 p-3 rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
