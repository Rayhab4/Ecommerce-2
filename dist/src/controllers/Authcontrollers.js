"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.registerUser = exports.loginUser = void 0;
const auth_1 = require("../utils/auth");
const jwt_1 = require("../utils/jwt");
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const sendEmails_1 = __importDefault(require("../utils/sendEmails")); // your email utility
/**
 * LOGIN USER
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await (0, auth_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = (0, jwt_1.generateToken)(user._id.toString());
        return res.status(200).json({
            message: 'Login successful',
            role: user.role,
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Login failed', error });
    }
};
exports.loginUser = loginUser;
/**
 * REGISTER USER
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await UserModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newUser = new UserModel_1.default({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await newUser.save();
        const token = (0, jwt_1.generateToken)(newUser._id.toString());
        return res.status(201).json({
            message: 'Registration successful',
            role: newUser.role,
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Registration failed', error });
    }
};
exports.registerUser = registerUser;
/**
 * FORGOT PASSWORD - send OTP to email
 */
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
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
        await (0, sendEmails_1.default)(email, "Your Password Reset OTP", htmlContent);
        res.json({ message: "OTP sent to your email." });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.forgotPassword = forgotPassword;
/**
 * RESET PASSWORD - verify OTP and set new password
 */
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await UserModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!user.otp || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(newPassword);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
        res.json({ message: "Password reset successful!" });
    }
    catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.resetPassword = resetPassword;
