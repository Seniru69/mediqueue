import { useEffect, useState } from "react";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put("/auth/update-profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully");
      setEditMode(false);
      setUser({ ...user, name: form.name, email: form.email });
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* TOP CARD */}
      <div className="bg-white rounded-xl p-6 shadow flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#5aa7b4] text-white flex items-center justify-center text-xl font-semibold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-50"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="font-semibold mb-4">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              name="name"
              value={form.name}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mt-1 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              name="email"
              value={form.email}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mt-1 disabled:bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">New Password</label>
            <input
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
              disabled={!editMode}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mt-1 disabled:bg-gray-100"
            />
          </div>
        </div>

        {editMode && (
          <button
            onClick={handleUpdate}
            className="mt-6 bg-[#5aa7b4] text-white px-6 py-2 rounded-lg hover:bg-[#4a97a4]"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
