import mongoose from "mongoose";

const slotHoldSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, //Mongo TTL
    },
  },
  { timestamps: true }
);

export default mongoose.model("SlotHold", slotHoldSchema);
