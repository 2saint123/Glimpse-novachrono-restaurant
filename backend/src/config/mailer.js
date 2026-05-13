const nodemailer = require("nodemailer");

const mailUser = process.env.MAIL_USER || process.env.EMAIL_USER;
const mailPassword = process.env.MAIL_APP_PASSWORD || process.env.EMAIL_PASS;
const mailService = process.env.MAIL_SERVICE || "gmail";
const mailFrom = process.env.EMAIL_FROM || `"Glimpse Kigali" <${mailUser}>`;
const isMailConfigured = Boolean(mailUser && mailPassword);

const transporter = isMailConfigured
  ? nodemailer.createTransport({
      service: mailService,
      auth: {
        user: mailUser,
        pass: mailPassword
      }
    })
  : null;

const sendEmail = async ({ to, subject, html }) => {
  if (!to) return;
  if (!transporter) {
    console.warn(`Email skipped because MAIL_USER or MAIL_APP_PASSWORD is missing. Subject: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: mailFrom,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error("Email failed:", err.message);
  }
};

module.exports = { sendEmail };
