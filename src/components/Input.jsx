const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      {...props}
      required
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-teal-400"
    />
  </div>
);

export default Input;
