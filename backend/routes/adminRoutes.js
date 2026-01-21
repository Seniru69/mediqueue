import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAdminStats,
  exportAppointmentsCSV,
  getAllPatients,
  deletePatient,
} from "../controllers/adminController.js";

const router = express.Router();

/* DASHBOARD */
router.get("/stats", authMiddleware, getAdminStats);

/* EXPORT */
router.get(
  "/export/appointments",
  authMiddleware,
  exportAppointmentsCSV
);

/* PATIENTS */
router.get("/patients", authMiddleware, getAllPatients);
router.delete(
  "/patients/:id",
  authMiddleware,
  deletePatient
);

export default router;
