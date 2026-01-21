import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createPaymentIntent } from "../controllers/paymentController.js";

const router = express.Router();

router.post(
  "/create-payment-intent",
  authMiddleware,
  createPaymentIntent
);

export default router;
