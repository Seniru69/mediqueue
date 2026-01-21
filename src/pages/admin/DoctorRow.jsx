const DoctorRow = ({ doctor, slots, onDelete, onToggle }) => {
  const isFull = slots === 0;

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-3 flex items-center gap-3">
        <img
          src={
            doctor.image
              ? `http://localhost:5000${doctor.image}`
              : "/doctor-placeholder.png"
          }
          alt={doctor.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span>{doctor.name}</span>
      </td>

      <td className="p-3">{doctor.specialty}</td>
      <td className="p-3">{doctor.experience}</td>
      <td className="p-3">LKR {doctor.fees}</td>

      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            isFull
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {slots ?? "—"} / 10
        </span>
      </td>

      <td className="p-3">
        <button
          onClick={() => onToggle(doctor._id, doctor.available)}
          className={`px-3 py-1 rounded-full text-xs ${
            doctor.available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {doctor.available ? "Available" : "Unavailable"}
        </button>
      </td>

      <td className="p-3">
        <button
          onClick={() => onDelete(doctor._id)}
          className="text-red-500 hover:underline text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default DoctorRow;
