const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Dein OTP-Code",
    text: `Dein Einmalpasswort (OTP) lautet: ${otp}. Es ist 5 Minuten gültig.`,
  };

  await transporter.sendMail(mailOptions);
};
