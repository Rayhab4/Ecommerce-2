"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    // OTP and reset fields
    otp: { type: String, default: null },
    newPassword: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null }
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
