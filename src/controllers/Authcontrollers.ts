import { Request, Response } from 'express';
import { hashPassword, comparePasswords } from '../utils/auth';
import { generateToken } from '../utils/jwt';
import UserModel from '../Models/UserModel';
import mailerSender from '../utils/sendEmails'; // your email utility

export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

/**
 * LOGIN USER
 */
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: { email: string, password: string, role: string } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString()); 

    return res.status(200).json({
      message: 'Login successful',
      role: user.role,
      token, 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error });
  }
};

/**
 * REGISTER USER
 */
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, role }: { name: string, email: string, password: string, role: string } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = generateToken(newUser._id.toString());

    return res.status(201).json({
      message: 'Registration successful',
      role: newUser.role,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error });
  }
};

/**
 * FORGOT PASSWORD - send OTP to email
 */
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save();

    // Send OTP email
    const htmlContent = `
      <h3>Password Reset Request</h3>
      <p>Your OTP to reset your password is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `;

    await mailerSender(email, "Your Password Reset OTP", htmlContent);

    res.json({ message: "OTP sent to your email." });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * RESET PASSWORD - verify OTP and set new password
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err: any) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
