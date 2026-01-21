import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(res.data);
    } catch (error) {
      console.error("Failed to load patients", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure?\nThis action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(id);

      const token = localStorage.getItem("token");

      await api.delete(`/admin/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete patient"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-gray-50">
        <h2 className="text-xl font-semibold mb-6">
          Patients
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading patients...</p>
        ) : patients.length === 0 ? (
          <p className="text-gray-500">
            No patients found.
          </p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">
                      <button
                        disabled={actionLoading === p._id}
                        onClick={() => deletePatient(p._id)}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                      >
                        {actionLoading === p._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
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

export default AdminPatients;
