import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'karthickdeva6800@gmail.com',
    pass: 'mjqj kbsx iuku dori',
  },
});

async function generateOTP(email: string) {
  const otp = otpGenerator.generate(6, { digits: true });
  const hashedOTP = await bcrypt.hash(otp, 10);
  const mailOptions = {
    from: { name: 'NODE OTP', address: 'karthickdeva6800@gmail.com' },
    to: email, // Dynamically set recipient email
    subject: 'OTP Verification',
    text: `Your OTP for login is ${otp}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  return { otp, hashedOTP };
}

export default generateOTP;
