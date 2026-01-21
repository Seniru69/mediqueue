import { useEffect, useState } from "react";
import api from "../api/axios";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD INVOICE */
  const downloadInvoice = async (appointmentId) => {
    try {
      setDownloadingId(appointmentId);
      const token = localStorage.getItem("token");

      const res = await api.get(`/appointments/${appointmentId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-${appointmentId}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download invoice");
      console.error(error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-xl font-semibold mb-6">My Appointments</h2>

      {loading ? (
        <p className="text-gray-500">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">You have no appointments yet.</p>
      ) : (
        <>
          {/* TABLE */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Specialty</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Invoice</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{appt.doctor?.name}</td>
                    <td className="p-3">{appt.doctor?.specialty}</td>
                    <td className="p-3">{appt.date}</td>
                    <td className="p-3">{appt.time}</td>
                    <td className="p-3">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="p-3">
                      <PaymentBadge status={appt.paymentStatus} />
                    </td>
                    <td className="p-3">
                      {appt.paymentStatus === "paid" && (
                        <button
                          onClick={() => downloadInvoice(appt._id)}
                          disabled={downloadingId === appt._id}
                          className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                        >
                          {downloadingId === appt._id
                            ? "Downloading..."
                            : "Download"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*  MOBILE CARDS  */}
          <div className="md:hidden space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-xl shadow p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      appt.doctor?.image
                        ? `http://localhost:5000${appt.doctor.image}`
                        : "/doctor-placeholder.png"
                    }
                    alt={appt.doctor?.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div>
                    <p className="font-medium">{appt.doctor?.name}</p>
                    <p className="text-xs text-gray-500">
                      {appt.doctor?.specialty}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {appt.date} • {appt.time}
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={appt.status} />
                  <PaymentBadge status={appt.paymentStatus} />
                </div>

                {appt.paymentStatus === "paid" && (
                  <button
                    onClick={() => downloadInvoice(appt._id)}
                    disabled={downloadingId === appt._id}
                    className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                  >
                    {downloadingId === appt._id
                      ? "Downloading invoice..."
                      : "Download invoice"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
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

const PaymentBadge = ({ status }) => (
  <span
    className={`px-2 py-1 text-xs rounded-full ${
      status === "paid"
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {status}
  </span>
);

export default MyAppointments;
