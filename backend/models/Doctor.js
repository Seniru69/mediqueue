import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },

    education: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },
    about: {
      type: String,
    },
    image: {
      type: String, 
      default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
