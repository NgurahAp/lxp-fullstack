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
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Welcome to Our Platform!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6e6e6; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS307VAYEymROboEunLGhmpYYDjR3HhF9Gnzw&s" alt="Company Logo" style="max-width: 150px;">
        </div>
        
        <h2 style="color: #333; text-align: center;">Welcome to Our Platform!</h2>
        
        <p style="color: #555; font-size: 16px;">Hello ${userName},</p>
        
        <p style="color: #555; font-size: 16px;">Thank you for joining our platform! We're excited to have you as part of our community.</p>
        
        <p style="color: #555; font-size: 16px;">With your new account, you can:</p>
        
        <ul style="color: #555; font-size: 16px;">
          <li>Access all our premium features</li>
          <li>Connect with other users</li>
          <li>Create and share content</li>
          <li>Customize your profile and settings</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Get Started Now</a>
        </div>
        
        <p style="color: #555; font-size: 16px;">If you have any questions or need assistance, our support team is always ready to help you.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e6e6e6; color: #777; font-size: 14px;">
          <p>Need help? Contact our support team at <a href="mailto:support@yourcompany.com" style="color: #4A90E2;">support@yourcompany.com</a>.</p>
          <p>Best regards,<br>Your Platform Team</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e6e6e6; text-align: center; color: #999; font-size: 12px;">
          <p>Follow us on social media:</p>
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>Address: 123 Business Street, City, Country</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  userEmail,
  userName,
  resetToken
) => {
  // The frontend URL where your reset password page is located
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6e6e6; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS307VAYEymROboEunLGhmpYYDjR3HhF9Gnzw&s" alt="Company Logo" style="max-width: 150px;">
        </div>
        
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        
        <p style="color: #555; font-size: 16px;">Hello ${userName},</p>
        
        <p style="color: #555; font-size: 16px;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        
        <p style="color: #555; font-size: 16px;">To reset your password, click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        
        <p style="color: #555; font-size: 16px;">Or copy and paste this link into your browser:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 14px;">${resetUrl}</p>
        
        <p style="color: #555; font-size: 16px;">This password reset link will expire in 1 hour for security reasons.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e6e6e6; color: #777; font-size: 14px;">
          <p>If you need any assistance, please contact our support team at <a href="mailto:support@yourcompany.com" style="color: #4A90E2;">support@yourcompany.com</a>.</p>
          <p>Best regards,<br>Your Platform Team</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e6e6e6; text-align: center; color: #999; font-size: 12px;">
          <p>This is an automated email, please do not reply directly to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};
