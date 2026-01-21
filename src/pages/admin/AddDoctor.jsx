import { useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";
import Input from "../../components/Input";
import Select from "../../components/Select";

const AddDoctor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    education: "",
    experience: "",
    address1: "",
    address2: "",
    fees: "",
    about: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // merge address fields for backend
      data.append("address", `${form.address1} ${form.address2}`.trim());

      Object.entries(form).forEach(([key, value]) => {
        if (!key.startsWith("address")) {
          data.append(key, value);
        }
      });

      if (image) data.append("image", image);

      await api.post("/doctors", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Doctor added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-gray-50">
        <h2 className="text-lg font-semibold mb-6">Add Doctor</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-teal-100 rounded-xl p-8 max-w-4xl"
        >
          {/* Image Upload */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">👤</span>
              )}
            </div>

            <label className="cursor-pointer text-sm text-gray-600">
              Upload doctor picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Doctor name" name="name" onChange={handleChange} />

            <Select
              label="Speciality"
              name="specialty"
              options={[
                "General physician",
                "Psychiatry",
                "Dermatology",
                "Orthopedics",
                "Pediatrics",
              ]}
              onChange={handleChange}
            />

            <Input label="Doctor Email" name="email" onChange={handleChange} />
            <Input label="Education" name="education" onChange={handleChange} />

            <Input
              label="Doctor Password"
              name="password"
              type="password"
              onChange={handleChange}
            />

            <Input label="Address" name="address1" onChange={handleChange} />

            <Select
              label="Experience"
              name="experience"
              options={["1 year", "2 years", "5 years", "10+ years"]}
              onChange={handleChange}
            />

            <Input label="Address 2" name="address2" onChange={handleChange} />
            <Input label="Fees" name="fees" onChange={handleChange} />
          </div>

          {/* About */}
          <div className="mt-6">
            <label className="block text-sm mb-2">About</label>
            <textarea
              name="about"
              rows="4"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 resize-none"
              placeholder="write about doctor"
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            {loading ? "Adding..." : "Add doctor"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddDoctor;
