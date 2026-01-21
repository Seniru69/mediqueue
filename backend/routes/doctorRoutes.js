import express from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  deleteDoctor,
  updateAvailability
} from "../controllers/doctorController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), createDoctor);
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.patch("/:id/availability", updateAvailability);
router.delete("/:id", deleteDoctor);

export default router;
