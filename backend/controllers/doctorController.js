import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";

/* 
   CREATE DOCTOR
*/
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      specialty,
      password,
      experience,
      education,
      address,
      fees,
      about,
    } = req.body;

    if (
      !name ||
      !email ||
      !specialty ||
      !password ||
      !experience ||
      !education ||
      !address ||
      !fees
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      specialty,
      password: hashedPassword,

      experience: String(experience),
      education,
      address,
      fees: Number(fees),

      about,
      image: req.file ? `/uploads/doctors/${req.file.filename}` : null,

      available: true, // default availability
    });

    res.status(201).json(doctor);
  } catch (error) {
    console.error("CREATE DOCTOR ERROR:", error);
    res.status(500).json({
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};

/* 
   GET ALL DOCTORS (Home / All Doctors)
 */
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.json(doctors);
  } catch (error) {
    console.error("GET DOCTORS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
};

/* 
   GET SINGLE DOCTOR BY ID (Appointment Page)
*/
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("GET DOCTOR BY ID ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch doctor",
    });
  }
};

/* 
   DELETE DOCTOR (Admin)
 */
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.deleteOne();
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("DELETE DOCTOR ERROR:", error);
    res.status(500).json({
      message: "Delete failed",
    });
  }
};

/* 
   UPDATE AVAILABILITY (Admin / Booking logic)
*/
export const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.available = Boolean(req.body.available);
    await doctor.save();

    res.json(doctor);
  } catch (error) {
    console.error("UPDATE AVAILABILITY ERROR:", error);
    res.status(500).json({
      message: "Update failed",
    });
  }
};
