import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import SpecialtyFilter from "../components/SpecialtyFilter";
import api from "../api/axios";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
        setDoctors(response.data || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors =
    specialty === "All"
      ? doctors
      : doctors.filter(
          (doctor) => doctor.specialty === specialty
        );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-gray-500">Loading doctors...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold mb-6">
        Explore doctors by their specialities.
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        <SpecialtyFilter
          selected={specialty}
          onSelect={setSpecialty}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))
          ) : (
            <p className="text-gray-500">
              No doctors found for this specialty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
