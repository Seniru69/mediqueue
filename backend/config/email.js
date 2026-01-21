import dotenv from "dotenv";
import nodemailer from "nodemailer";


dotenv.config();

console.log("DEBUG ENV CHECK:");
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error) => {
  if (error) {
    console.error("EMAIL ERROR:", error);
  } else {
    console.log("Email server ready");
  }
});

export default transporter;
