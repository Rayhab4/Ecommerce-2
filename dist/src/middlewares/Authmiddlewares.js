"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in your environment variables');
}
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authentication token is missing or invalid format' });
            return;
        }
        const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await UserModel_1.default.findById(decoded._id).select('_id email name'); // or select more if needed
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Attach minimal user info to request (avoid attaching full doc)
        req.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
        };
        next();
    }
    catch (error) {
        console.error("Auth error:", error.message);
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token has expired' });
        }
        else {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
};
exports.authMiddleware = authMiddleware;
