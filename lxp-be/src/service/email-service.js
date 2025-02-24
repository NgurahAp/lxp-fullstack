import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // atau smtp provider lain
  port: 587,
  secure: false,
  auth: {
    user: "ngurahpratama2002@gmail.com",
    pass: "hjvp ulzq mnpi wnya", // Gunakan App Password jika menggunakan Gmail
  },
});

export const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Welcome to Our Platform!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome ${userName}!</h2>
        <p>Thank you for registering with our platform.</p>
        <p>We're excited to have you on board!</p>
        <p>Best regards,<br>Your Platform Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // You might want to log this error but not throw it
    // so registration still succeeds even if email fails
  }
};
