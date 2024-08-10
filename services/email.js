const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

// Create a transporter using your email service provider credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: true,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSCODE,
  },
  tls: {
      rejectUnauthorized: false
  }
});

exports.sendWelcomeEmail = async (recipientEmail, templateData, next) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../views/email_verification_template.ejs"
    );

    const emailTemplate = await ejs.renderFile(templatePath, templateData);
    // console.log("Email: ", process.env.EMAIL_USER)

    const mailOptions = {
      from: `"ResiLink" ${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: "Welcome to ResiLink! 👋",
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Verification email sent to ${recipientEmail}`);
  } catch (error) {
    next(error)
  }
};

exports.sendOTPRequest = async (recipientEmail, templateData, next) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../views/otp_template.ejs"
    );

    const emailTemplate = await ejs.renderFile(templatePath, templateData);
    // console.log("Email: ", process.env.EMAIL_USER)

    const mailOptions = {
      from: `"ResiLink" ${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: "OTP request",
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Verification email sent to ${recipientEmail}`);
  } catch (error) {
    next(error)
  }
};

exports.sendPasswordResetEmail = async (recipientEmail, templateData, next) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../views/password_reset_template.ejs"
    );

    const emailTemplate = await ejs.renderFile(templatePath, templateData);
    // console.log("Email: ", process.env.EMAIL_USER)

    const mailOptions = {
      from: `"ResiLink" ${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: "Password Reset OTP",
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Verification email sent to ${recipientEmail}`);
  } catch (error) {
    next(error)
  }
};

