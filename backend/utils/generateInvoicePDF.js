import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePdf = ({ res, appointment, user, doctor }) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  /*  HEADERS  */
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Mediqueue-Invoice-${appointment._id}.pdf`,
  );

  doc.pipe(res);

  const primary = "#5aa7b4";
  const dark = "#111827";
  const gray = "#6b7280";
  const lightGray = "#e5e7eb";

  const logoPath = path.resolve("backend/assets/logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 60 });
  }

  /* HEADER  */
  doc
    .fillColor(primary)
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("MediQueue", 120, 50);

  doc
    .fontSize(11)
    .fillColor(gray)
    .font("Helvetica")
    .text("Hospital Appointment Invoice", 120, 80);

  doc
    .strokeColor(primary)
    .lineWidth(2)
    .moveTo(50, 120)
    .lineTo(545, 120)
    .stroke();

  doc.moveDown(2);

  metaRow(doc, "Invoice ID", appointment._id);
  metaRow(doc, "Issued Date", new Date().toLocaleDateString());

  doc.moveDown(2);

  /*  PATIENT INFO  */
  sectionTitle(doc, "Patient Information");

  infoRow(doc, "Full Name", user.name);
  infoRow(doc, "Email Address", user.email);

  doc.moveDown(1.5);

  /* APPOINTMENT INFO  */
  sectionTitle(doc, "Appointment Details");

  infoRow(doc, "Doctor", doctor.name);
  infoRow(doc, "Specialty", doctor.specialty);
  infoRow(doc, "Appointment Date", appointment.date);
  infoRow(doc, "Time Slot", appointment.time);
  infoRow(doc, "Status", appointment.status.toUpperCase());

  doc.moveDown(1.5);

  /*  SUMMARY  */
  sectionTitle(doc, "Payment Summary");

  infoRow(doc, "Payment ID", appointment.paymentIntentId);
  infoRow(doc, "Payment Status", appointment.paymentStatus.toUpperCase());

  doc.moveDown(1);

  doc
    .fillColor(primary)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(`Total Paid: LKR ${doctor.fees}.00`, {
      align: "right",
    });

  doc.moveDown(2);

  /*FOOTER*/
  doc
    .strokeColor(lightGray)
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown(1);

  doc
    .fontSize(9)
    .fillColor(gray)
    .font("Helvetica")
    .text(
      "This invoice was generated electronically by MediQueue Hospital Appointment System.\nNo physical signature is required.",
      {
        align: "center",
        lineGap: 4,
      },
    );

  doc.end();
};

const sectionTitle = (doc, title) => {
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#5aa7b4").text(title);

  doc
    .strokeColor("#5aa7b4")
    .lineWidth(1)
    .moveTo(50, doc.y + 4)
    .lineTo(545, doc.y + 4)
    .stroke();

  doc.moveDown(1);
};

const infoRow = (doc, label, value) => {
  doc
    .fontSize(11)
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .text(`${label}: `, { continued: true })
    .font("Helvetica")
    .fillColor("#374151")
    .text(value);
};

const metaRow = (doc, label, value) => {
  doc
    .fontSize(10)
    .fillColor("#374151")
    .font("Helvetica-Bold")
    .text(`${label}: `, { continued: true })
    .font("Helvetica")
    .text(value);
};
