// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
// ENVx`
require('dotenv').config();
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;


// Middleware
app.use(cors());
app.use(express.static("public")); // Assuming your HTML is in /public
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST /contact route
app.post("/contact", async (req, res) => {
  const { fullName, mobile, email, tripDate, message } = req.body;

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,           // ✅ Your Gmail
      pass: EMAIL_PASS,             // ✅ App password, not your Gmail password
    },
  });

  // Email content
  const mailOptions = {
  from: `"${fullName}" <${email}>`, // This looks cleaner
  to: [
    EMAIL_USER
    // "smriti.sinha.prakash@gmail.com"
  ], // Multiple recipients
  cc: [], // Optional CCs
  subject: "New Contact Form Submission",
html: `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #0056b3; border-bottom: 1px solid #ccc; padding-bottom: 5px;">New Contact Request 📩</h2>
    <p style="margin: 10px 0;"><strong>👤 Full Name:</strong> ${fullName}</p>
    <p style="margin: 10px 0;"><strong>📞 Mobile Number:</strong> ${mobile}</p>
    <p style="margin: 10px 0;"><strong>✉️ Email:</strong> ${email}</p>
    <p style="margin: 10px 0;"><strong>🗓️ Trip Date:</strong> ${tripDate}</p>
    <p style="margin: 10px 0;"><strong>📝 Message:</strong><br>
      <span style="display: inline-block; margin-top: 5px; background: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #e0e0e0;">
        ${message || '—'}
      </span>
    </p>
  </div>
`
};

  try {
    await transporter.sendMail(mailOptions);
    if(fullName == null)  res.status(500).json({ message: "Full Name is Mandatory" });
    res.status(200).json({ message: "Message sent successfully!by UK" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
