const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      {...props}
      required
      className="w-full rounded-lg border px-4 py-2 bg-white"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Select;