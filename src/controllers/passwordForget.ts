// Import necessary modules
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer"; // You may need to install this module
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

// Import your User model and types
import User from "../models/user";
import { user } from "../types/types";

// Generate a token for password reset (make sure to use a secure secret)
const generateResetToken = (user: user): string => {
  return jwt.sign({ userId: user._id }, process.env.RESET_SECRET, {
    expiresIn: "1h",
  });
};

// Controller function for forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Generate a reset token
  const resetToken = generateResetToken(user);

  // Save the token to the user's document in the database
  user.resetToken = resetToken;
  await user.save();

  // Send an email to the user with the reset link
  const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

  // Set up nodemailer to send emails (this is a basic example, you may need to configure it further)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "temptemptemp363@gmail.com",
      pass: "xwsszplxgfilgebt",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset email:", error);
      return res.status(500).json({ error: "Failed to send reset email" });
    }
    res.status(200).json({ message: "Password reset email sent successfully" });
  });
};

// Controller function for resetting the password
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Verify the token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.RESET_SECRET);
  } catch (error: any) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  // Find the user by the decoded token
  const user = await User.findOne({
    _id: decodedToken.userId,
    resetToken: token,
  });

  if (!user) {
    return res.status(404).json({ error: "User not found or invalid token" });
  }

  // Hash the new password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update the user's password and remove the reset token
  user.password = hashedPassword;
  user.resetToken = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
};
