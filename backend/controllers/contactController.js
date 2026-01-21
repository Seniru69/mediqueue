import transporter from "../config/email.js";

export const sendContactEmail = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message
    } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const mailOptions = {
      from: `"Mediqueue Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `Contact Form: ${subject || "General Inquiry"}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName || ""}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    res.status(500).json({
      message: "Failed to send email"
    });
  }
};
