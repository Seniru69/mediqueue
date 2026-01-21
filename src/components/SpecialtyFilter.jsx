const specialties = [
  "All",
  "Orthopedics",
  "Psychiatry",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Gastroenterology"
];

const SpecialtyFilter = ({ selected, onSelect }) => {
  return (
    <div className="w-full md:w-56 space-y-3">
      {specialties.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`w-full text-left px-4 py-2 rounded-lg border transition
            ${
              selected === item
                ? "bg-teal-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SpecialtyFilter;
