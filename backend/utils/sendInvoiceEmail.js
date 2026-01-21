import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 
   INVOICE EMAIL
*/
export const sendInvoiceEmail = async ({ to, pdfBuffer }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL credentials are missing in .env");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"MediQueue Healthcare" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your MediQueue Appointment Invoice",

      text:
        "Thank you for booking your appointment with MediQueue.\n\n" +
        "Your payment was successful. Please find your invoice attached.\n\n" +
        "You can access your appointment details anytime from your MediQueue account.\n\n" +
        "MediQueue Healthcare",

      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f5f7fa; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.08);">

            <!-- HEADER -->
            <div style="background-color: #0f766e; padding: 24px; text-align: center;">
              <img 
                src="cid:mediqueue-logo" 
                alt="MediQueue Logo" 
                style="height: 60px; margin-bottom: 12px;"
              />
              <h2 style="margin: 0; color: #ffffff; font-weight: 600;">
                MediQueue Healthcare
              </h2>
              <p style="margin: 6px 0 0; color: #d1fae5; font-size: 14px;">
                Appointment Confirmation & Invoice
              </p>
            </div>

            <!-- BODY -->
            <div style="padding: 28px; color: #374151;">
              <p style="font-size: 15px; margin-top: 0;">
                Dear Patient,
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                Thank you for choosing <strong>MediQueue</strong> for your healthcare needs.
                We’re pleased to confirm that your payment has been successfully processed.
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                Your appointment invoice is attached to this email for your reference.
                You can also view or download your invoice anytime by logging into your MediQueue account.
              </p>

              <div style="margin: 24px 0; padding: 16px; background-color: #f0fdfa; border-left: 4px solid #0f766e; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px;">
                  🧾 <strong>Invoice attached:</strong> invoice.pdf
                </p>
              </div>

              <p style="font-size: 14px; color: #4b5563;">
                If you have any questions or require assistance, our support team is always here to help.
              </p>

              <p style="font-size: 14px; margin-top: 32px;">
                Wishing you good health,<br />
                <strong>MediQueue Healthcare Team</strong>
              </p>
            </div>

            <!-- FOOTER -->
            <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
              © ${new Date().getFullYear()} MediQueue Healthcare. All rights reserved.
            </div>
          </div>
        </div>
      `,

      /* Attachments */
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "mediqueue-logo",
        },
      ],
    });

    console.log("Invoice email sent to:", to);
  } catch (error) {
    console.error("SEND INVOICE EMAIL ERROR:", error);
    throw error;
  }
};
