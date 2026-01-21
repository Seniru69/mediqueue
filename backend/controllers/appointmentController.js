import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { io } from "../server.js";
import Stripe from "stripe";
import { sendInvoiceEmail } from "../utils/sendInvoiceEmail.js";
import {
  generateInvoicePdfBuffer,
  streamInvoicePdf,
} from "../utils/invoicePdf.js";

const MAX_APPOINTMENTS_PER_DAY = 10;
const HOLD_EXPIRE_MINUTES = 10;

/* HOLD SLOT (BEFORE PAYMENT)*/
export const holdSlot = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date required" });
    }

    // count held + confirmed slots
    const count = await Appointment.countDocuments({
      doctor: doctorId,
      date,
      status: { $in: ["hold", "confirmed"] },
    });

    if (count >= MAX_APPOINTMENTS_PER_DAY) {
      return res.status(400).json({ message: "No slots available" });
    }

    // create temporary hold
    const hold = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time: "HOLD",
      status: "hold",
      paymentStatus: "pending",
    });

    // auto-expire hold after X minutes
    setTimeout(
      async () => {
        await Appointment.findOneAndDelete({
          _id: hold._id,
          status: "hold",
        });

        io.emit("slotUpdated", { doctorId });
      },
      HOLD_EXPIRE_MINUTES * 60 * 1000,
    );

    io.emit("slotUpdated", { doctorId });

    res.json({ message: "Slot held" });
  } catch (error) {
    console.error("HOLD SLOT ERROR:", error);
    res.status(500).json({ message: "Failed to hold slot" });
  }
};

/*CREATE APPOINTMENT (AFTER PAYMENT)*/
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, paymentIntentId } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !date || !time || !paymentIntentId) {
      return res.status(400).json({ message: "All fields required" });
    }

    // find existing hold
    const hold = await Appointment.findOne({
      doctor: doctorId,
      date,
      patient: patientId,
      status: "hold",
    });

    if (!hold) {
      return res.status(400).json({
        message: "Slot hold expired. Please try again.",
      });
    }

    // confirm appointment
    hold.time = time;
    hold.status = "confirmed";
    hold.paymentStatus = "paid";
    hold.paymentIntentId = paymentIntentId;

    await hold.save();

    io.emit("slotUpdated", { doctorId });

    const user = await User.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    const pdfBuffer = await generateInvoicePdfBuffer({
      appointment: hold,
      user,
      doctor,
    });

    await sendInvoiceEmail({
      to: user.email,
      pdfBuffer,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: hold,
    });
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

/* 
   GET DAILY APPOINTMENT COUNT
*/
export const getAppointmentCountByDate = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date required" });
    }

    const count = await Appointment.countDocuments({
      doctor: doctorId,
      date,
      status: { $in: ["hold", "confirmed"] },
    });

    res.json({ count });
  } catch (error) {
    console.error("GET COUNT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch count" });
  }
};

/*
   GET USER APPOINTMENTS
*/
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate("doctor", "name specialty image fees")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* 
   ADMIN: GET ALL APPOINTMENTS
*/
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialty")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* 
   DOWNLOAD INVOICE
*/
export const downloadInvoice = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor")
      .populate("patient");

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      appointment.patient._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    streamInvoicePdf(res, {
      appointment,
      user: appointment.patient,
      doctor: appointment.doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

/* 
   ADMIN: CONFIRM / CANCEL + REFUND
*/
export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      req.body.status === "cancelled" &&
      appointment.paymentStatus === "paid"
    ) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      await stripe.refunds.create({
        payment_intent: appointment.paymentIntentId,
      });

      appointment.paymentStatus = "refunded";
    }

    appointment.status = req.body.status;
    await appointment.save();

    io.emit("slotUpdated", { doctorId: appointment.doctor });

    res.json({ message: "Appointment updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
};
