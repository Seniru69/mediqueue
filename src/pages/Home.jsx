import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { io } from "socket.io-client";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);

        const uniqueSpecialties = [
          ...new Set(res.data.map((doc) => doc.specialty)),
        ].map((name) => ({
          name,
          icon: "/images/specialty/general.png",
        }));

        setSpecialties(uniqueSpecialties);
      } catch (error) {
        console.error("Failed to load doctors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  /* Socket */
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("doctorAvailabilityUpdated", (data) => {
      setDoctors((prevDoctors) =>
        prevDoctors.map((doc) =>
          doc._id === data.doctorId
            ? { ...doc, available: data.available }
            : doc,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-[#5aa7b4] rounded-2xl mx-6 mt-6 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between text-white">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Make an Appointment <br /> With Trusted Specialists
          </h1>
          <p className="text-sm md:text-base opacity-90 mb-6">
            Discover qualified doctors and schedule your visit quickly and
            stress free.
          </p>
          <button className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
            Book appointment →
          </button>
        </div>

        <div className="w-full md:w-[380px] h-[260px] bg-white/20 rounded-2xl mt-10 md:mt-0 flex items-center justify-center">
          <img
            src="/hero.jpg"
            alt="Doctor and patient"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* SPECIALITY SECTION */}
      <section className="text-center mt-16 px-6">
        <h2 className="text-xl font-semibold mb-2">Find by Speciality</h2>
        <p className="text-sm text-gray-500 mb-10">
          Find the right doctor for your needs and secure your appointment
          without any hassle.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {specialties.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-2 flex items-center justify-center">
                <span className="text-lg font-semibold text-blue-600">
                  {item.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* DOCTORS SECTION */}
      <section className="mt-20 px-6">
        <h2 className="text-xl font-semibold text-center mb-2">
          Top Doctors Available for Booking
        </h2>
        <p className="text-sm text-gray-500 text-center mb-10">
          Easily explore our wide range of trusted doctors.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading doctors...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-48 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={
                      doctor.image
                        ? `http://localhost:5000${doctor.image}`
                        : "/doctor-placeholder.png"
                    }
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        doctor.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      ● {doctor.available ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {doctor.specialty}
                  </p>

                  <button
                    onClick={() => navigate(`/appointment/${doctor._id}`)}
                    className="w-full bg-[#5aa7b4] text-white hover:bg-[#4a97a4] text-xs py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gradient-to-r from-blue-50 to-teal-50 mt-20 mx-6 rounded-2xl px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-lg">
          <h2 className="text-xl font-semibold mb-3 text-[#5aa7b4]">
            You have lots of reasons to choose us
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Mediqueue makes healthcare simple by connecting patients with
            trusted doctors quickly and efficiently.
          </p>

          <div className="flex gap-4 flex-wrap">
            <button className="bg-[#5aa7b4] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#4a97a4] transition-colors shadow-sm">
              Get started
            </button>
            <button className="bg-white border border-[#5aa7b4] text-[#5aa7b4] px-5 py-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm">
              Talk to sales
            </button>
          </div>
        </div>

        <div className="w-full md:w-[400px] h-[250px] bg-white rounded-xl overflow-hidden shadow-lg">
          <img
            src="/hospital.jpg"
            alt="Why choose Mediqueue"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="mt-16 px-6">
        <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-center text-lg font-semibold text-gray-800 mb-6">
            Trusted by Patients Nationwide
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { stat: "10,000+", label: "Happy Patients" },
              { stat: "98%", label: "Satisfaction Rate" },
              { stat: "24/7", label: "Support Available" },
              { stat: "200+", label: "Expert Doctors" },
            ].map((item, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold text-[#5aa7b4] mb-2">
                  {item.stat}
                </div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
