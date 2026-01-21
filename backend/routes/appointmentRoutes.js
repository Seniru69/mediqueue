import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  downloadInvoice,
  updateAppointmentStatus,
  getAppointmentCountByDate,
  holdSlot,
} from "../controllers/appointmentController.js";

const router = express.Router();

// hold slot before payment
router.post("/hold", authMiddleware, holdSlot);

// get daily slot count
router.get("/count", getAppointmentCountByDate);

// book appointment after payment
router.post("/", authMiddleware, createAppointment);

// get logged-in user's appointments
router.get("/my", authMiddleware, getMyAppointments);

// download invoice
router.get("/:id/invoice", authMiddleware, downloadInvoice);

/* ADMIN */

// get all appointments
router.get("/", authMiddleware, getAllAppointments);

// cancel / confirm appointment
router.patch("/:id/status", authMiddleware, updateAppointmentStatus);

export default router;
