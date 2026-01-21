import { useState } from "react";
import api from "../api/axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!form.firstName || !form.email || !form.message) {
      setError("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/contact", form);

      setSuccess("Message sent successfully!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err) {
      setError("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <section className="w-full py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-2xl font-semibold text-gray-700 mb-12">
              CONTACT US
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* LEFT */}
              <div className="bg-[#5aa7b4] text-white p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    Connect with us
                  </h3>
                  <p className="text-sm opacity-90 mb-10">
                    Say something to start a conversation.
                  </p>

                  <div className="space-y-6 text-sm">
                    <div className="flex items-center gap-4">
                      <FaPhoneAlt /> 0112 200 200
                    </div>
                    <div className="flex items-center gap-4">
                      <FaEnvelope /> mediqueue@gmail.com
                    </div>
                    <div className="flex items-center gap-4">
                      <FaMapMarkerAlt /> Colombo 3, Sri Lanka
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <SocialIcon icon={<FaFacebookF />} />
                  <SocialIcon icon={<FaInstagram />} />
                  <SocialIcon icon={<FaTwitter />} />
                  <SocialIcon icon={<FaLinkedinIn />} />
                </div>
              </div>

              {/* RIGHT */}
              <div className="md:col-span-2 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name *"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Email *"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-3">Select Subject</p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                      {[
                        "General Inquiry",
                        "Appointments",
                        "Support",
                        "Feedback",
                      ].map((item) => (
                        <label key={item} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="subject"
                            value={item}
                            checked={form.subject === item}
                            onChange={handleChange}
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Message *</label>
                    <textarea
                      rows="3"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 focus:border-[#5aa7b4] outline-none py-2 resize-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  {success && (
                    <p className="text-green-600 text-sm">{success}</p>
                  )}

                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-[#5aa7b4] text-white px-8 py-3 rounded-lg shadow-md hover:bg-[#4a97a4] transition"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      {...props}
      className="w-full border-b border-gray-300 focus:border-[#5aa7b4] outline-none py-2"
    />
  </div>
);

const SocialIcon = ({ icon }) => (
  <button className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
    {icon}
  </button>
);

export default Contact;
