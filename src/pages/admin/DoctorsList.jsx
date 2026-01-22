iimport { useEffect, useState } from "react";
import api from "../../api/axios.js";
import AdminSidebar from "../../components/AdminSidebar";
import DoctorRow from "./DoctorRow.jsx";

const MAX_APPOINTMENTS_PER_DAY = 10;

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchDoctorsAndSlots = async () => {
    try {
      const { data } = await api.get("/doctors");
      setDoctors(data);

      const slotMap = {};

      for (const doctor of data) {
        const res = await api.get(
          `/appointments/count?doctorId=${doctor._id}&date=${today}`
        );

        slotMap[doctor._id] =
          MAX_APPOINTMENTS_PER_DAY - res.data.count;
      }

      setSlots(slotMap);
    } catch (error) {
      console.error("Failed to load doctors or slots", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsAndSlots();
  }, []);

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await api.delete(`/doctors/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const toggleAvailability = async (id, value) => {
    try {
      await api.patch(`/doctors/${id}/availability`, {
        available: !value,
      });

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, available: !value } : doc
        )
      );
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-gray-50">
        <h2 className="text-lg font-semibold mb-6">
          Doctors List (Today’s Slots)
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Speciality</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Fees</th>
                  <th className="p-3">Remaining Slots</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doctor) => (
                  <DoctorRow
                    key={doctor._id}
                    doctor={doctor}
                    slots={slots[doctor._id]}
                    onDelete={deleteDoctor}
                    onToggle={toggleAvailability}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorsList;
