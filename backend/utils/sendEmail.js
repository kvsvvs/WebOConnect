const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (email, type, options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    let subject, text;
    if (type === 'verification') {
      subject = 'Verify Your Account';
      text = `Please click the following link to verify your account: ${options.verificationLink}`;
    } else if (type === 'password-reset') {
      subject = 'Reset Your Password';
      text = `Please click the following link to reset your password: ${options.resetLink}`;
    } else {
      throw new Error('Invalid email type specified.');
    }

    await transporter.sendMail({
      from: process.env.FROM,
      to: email,
      subject: subject,
      text: text,
    });

    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
