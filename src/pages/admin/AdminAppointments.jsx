import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data);
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setLoading(false);
    }
  };

  /* CANCEL (ADMIN) */
  const cancelAppointment = async (appointmentId) => {
    const confirm = window.confirm(
      "Cancel this appointment?\n\nA refund will be issued to the patient.",
    );

    if (!confirm) return;

    try {
      setActionLoading(appointmentId);

      const token = localStorage.getItem("token");

      await api.patch(
        `/appointments/${appointmentId}/status`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchAppointments();
    } catch (error) {
      console.error("Cancel failed:", error);
      alert("Failed to cancel appointment");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-gray-50">
        <h2 className="text-xl font-semibold mb-6">All Appointments</h2>

        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Specialty</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{appt.patient?.name}</td>
                    <td className="p-3">{appt.patient?.email}</td>
                    <td className="p-3">{appt.doctor?.name}</td>
                    <td className="p-3">{appt.doctor?.specialty}</td>
                    <td className="p-3">{appt.date}</td>
                    <td className="p-3">{appt.time}</td>

                    <td className="p-3">
                      <StatusBadge status={appt.status} />
                    </td>

                    <td className="p-3">
                      {appt.status === "confirmed" ? (
                        <button
                          disabled={actionLoading === appt._id}
                          onClick={() => cancelAppointment(appt._id)}
                          className="text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          {actionLoading === appt._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 text-xs rounded-full ${
      status === "confirmed"
        ? "bg-green-100 text-green-800"
        : status === "cancelled"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {status}
  </span>
);

export default AdminAppointments;
