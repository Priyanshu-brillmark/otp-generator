require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/send-otp', async (req, res) => {
  const { to_email, otp } = req.body;

  if (!to_email || !otp) {
    return res.status(400).json({ ok: false, error: 'Missing to_email or otp' });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({ ok: false, error: 'Server: SMTP not configured. Set SMTP_USER and SMTP_PASS in .env' });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: to_email,
      subject: process.env.OTP_SUBJECT || 'Your OTP Code',
      text: `Your OTP is: ${otp}\n\nValid for this session only.`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for this session only.</p>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    const msg = err.message || '';
    const isBadCreds = /535|BadCredentials|Username and Password not accepted/i.test(msg);
    const error = isBadCreds
      ? 'Gmail login failed. Use an App Password (not your normal password). See: https://support.google.com/mail/answer/185833'
      : msg || 'Failed to send email';
    res.status(500).json({ ok: false, error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
