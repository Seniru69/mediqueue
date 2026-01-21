import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
      default: "HOLD",
    },

    // slot lifecycle
    status: {
      type: String,
      enum: ["hold", "pending", "confirmed", "cancelled"],
      default: "hold",
    },

    paymentIntentId: {
      type: String,
      default: null,
    },

    // payment lifecycle
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Appointment", appointmentSchema);
