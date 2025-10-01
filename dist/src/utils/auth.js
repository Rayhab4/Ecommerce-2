"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 10;
const hashPassword = async (password) => {
    const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
// Compare password with hashed password
const comparePasswords = async (password, hashedPassword) => {
    return bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePasswords = comparePasswords;
