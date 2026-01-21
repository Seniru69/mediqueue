import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api/axios";

// config
const MAX_APPOINTMENTS_PER_DAY = 10;
const times = ["8.00 am", "11.30 am", "7.00 pm"];

// socket connection
const socket = io("http://localhost:5000");

// generate next 7 days
const generateNextDays = (count = 7) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    days.push({
      label: d
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(),
      date: d.toISOString().split("T")[0],
    });
  }

  return days;
};

function Appointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const days = useMemo(() => generateNextDays(7), []);

  const [doctor, setDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [bookingCount, setBookingCount] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  // fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (error) {
        console.error("Failed to load doctor", error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // fetch slot counts from backend (single source of truth)
  const fetchCounts = async () => {
    try {
      setLoadingSlots(true);
      const counts = {};

      for (const day of days) {
        const res = await api.get(
          `/appointments/count?doctorId=${doctorId}&date=${day.date}`
        );
        counts[day.date] = res.data.count;
      }

      setBookingCount(counts);
    } catch (error) {
      console.error("Failed to fetch slot counts", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [doctorId, days]);

  // refresh slots after successful payment
  useEffect(() => {
    if (location.state?.refreshSlots) {
      fetchCounts();
    }
  }, [location.state]);

  // live slot updates via socket
  useEffect(() => {
    socket.on("slotUpdated", ({ doctorId: updatedDoctorId }) => {
      if (updatedDoctorId === doctorId) {
        fetchCounts();
      }
    });

    return () => socket.off("slotUpdated");
  }, [doctorId]);

  // proceed to payment
  const handleProceedToPayment = async () => {
    const token = localStorage.getItem("token");
    const booked = bookingCount[selectedDay.date] || 0;

    if (booked >= MAX_APPOINTMENTS_PER_DAY) {
      alert("This day is fully booked. Please select another date.");
      return;
    }

    // not logged in → redirect to login
    if (!token) {
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          doctorId,
          date: selectedDay.date,
          time: selectedTime,
          amount: doctor.fees,
        })
      );
      navigate("/");
      return;
    }

    try {
      // ask backend to hold slot
      await api.post(
        "/appointments/hold",
        {
          doctorId,
          date: selectedDay.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/payment", {
        state: {
          doctorId,
          doctorName: doctor.name,
          date: selectedDay.date,
          time: selectedTime,
          amount: doctor.fees,
        },
      });
    } catch (error) {
      alert(
        error.response?.data?.message || "Slot is no longer available"
      );
    }
  };

  if (!doctor) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading doctor details...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* doctor info */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-[280px] h-[280px] rounded-xl overflow-hidden bg-gray-100 border">
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

        <div className="flex-1 bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-1">{doctor.name}</h2>

          <p className="text-sm text-gray-500 mb-3">
            {doctor.education} – {doctor.specialty}
            <span className="ml-3 text-xs border px-2 py-1 rounded-full">
              {doctor.experience}
            </span>
          </p>

          <h4 className="font-medium mb-1">About</h4>
          <p className="text-sm text-gray-600 mb-4">{doctor.about}</p>

          <p className="text-sm font-medium">
            Appointment fee:
            <span className="ml-1 text-gray-700">
              LKR {doctor.fees}.00
            </span>
          </p>
        </div>
      </div>

      {/* booking slots */}
      <div className="mt-10">
        <h3 className="font-semibold mb-4">Booking slots</h3>

        {/* days */}
        <div className="flex gap-3 overflow-x-auto mb-4">
          {days.map((day) => {
            const count = bookingCount[day.date] || 0;
            const isFull = count >= MAX_APPOINTMENTS_PER_DAY;

            return (
              <button
                key={day.date}
                disabled={isFull}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-3 rounded-lg border text-sm min-w-[80px] ${
                  selectedDay.date === day.date
                    ? "bg-[#5aa7b4] text-white"
                    : "bg-white"
                } ${isFull ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium">{day.label}</div>
                <div className="text-xs">{day.date.split("-")[2]}</div>
                <div className="text-[10px] mt-1">
                  {loadingSlots
                    ? "Loading..."
                    : isFull
                    ? "Full"
                    : `${MAX_APPOINTMENTS_PER_DAY - count} slots`}
                </div>
              </button>
            );
          })}
        </div>

        {/* times */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-4 py-2 rounded-lg border text-sm ${
                selectedTime === time
                  ? "bg-[#5aa7b4] text-white"
                  : "bg-white"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* proceed */}
        <button
          onClick={handleProceedToPayment}
          className="bg-[#5aa7b4] text-white px-8 py-3 rounded-lg hover:bg-[#4a97a4] transition"
        >
          Proceed to payment
        </button>
      </div>
    </div>
  );
}

export default Appointment;
