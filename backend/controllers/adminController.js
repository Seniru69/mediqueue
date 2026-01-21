import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.countDocuments();
    const doctors = await Doctor.countDocuments();
    const appointments = await Appointment.countDocuments();
    const cancelled = await Appointment.countDocuments({
      status: "cancelled",
    });

    /* date range */
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const rawData = await Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const countMap = {};
    rawData.forEach((d) => {
      countMap[d._id] = d.count;
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const key = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");

      chartData.push({
        _id: key,
        count: countMap[key] || 0,
      });
    }

    res.json({
      users,
      doctors,
      appointments,
      cancelled,
      chartData,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

/* export appointment as csv */
export const exportAppointmentsCSV = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialty")
      .lean();

    const escape = (v = "") => `"${String(v).replace(/"/g, '""')}"`;

    let csv = "Patient,Email,Doctor,Specialty,Date,Time,Status\n";

    appointments.forEach((a) => {
      csv +=
        [
          escape(a.patient?.name),
          escape(a.patient?.email),
          escape(a.doctor?.name),
          escape(a.doctor?.specialty),
          escape(`="${a.date}"`),
          escape(a.time),
          escape(a.status),
        ].join(",") + "\n";
    });

    const BOM = "\uFEFF";

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=appointments.csv",
    );
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    res.send(BOM + csv);
  } catch (error) {
    console.error("CSV EXPORT ERROR:", error);
    res.status(500).json({ message: "Export failed" });
  }
};

/* GET ALL PATIENTS (ADMIN)*/
export const getAllPatients = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patients = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error("GET PATIENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

/*DELETE PATIENT (ADMIN)*/
export const deletePatient = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patientId = req.params.id;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "user") {
      return res.status(404).json({ message: "Patient not found" });
    }

    const hasAppointments = await Appointment.exists({
      patient: patientId,
    });

    if (hasAppointments) {
      return res.status(400).json({
        message: "Cannot delete patient with existing appointments",
      });
    }

    await User.findByIdAndDelete(patientId);

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("DELETE PATIENT ERROR:", error);
    res.status(500).json({ message: "Failed to delete patient" });
  }
};
