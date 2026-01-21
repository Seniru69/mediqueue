import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition">
      {/* Image */}
      <div className="h-60 bg-gray-100">
        <img
          src={
            doctor.image
              ? `http://localhost:5000${doctor.image}`
              : "/doctor-placeholder.png"
          }
          alt={doctor.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        {/* Availability */}
        <div
          className={`flex items-center gap-2 text-sm ${
            doctor.available ? "text-green-600" : "text-red-600"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              doctor.available ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {doctor.available ? "Available" : "Unavailable"}
        </div>

        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>

        <p className="text-sm text-gray-500">{doctor.specialty}</p>

        {/* Book Now Button */}
        <button
          disabled={!doctor.available}
          onClick={() => navigate(`/appointment/${doctor._id}`)}
          className={`w-full mt-2 text-sm py-2 rounded-lg transition ${
            doctor.available
              ? "bg-[#5aa7b4] text-white hover:bg-[#4a97a4]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
