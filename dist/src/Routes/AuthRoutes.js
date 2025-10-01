"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authcontrollers_1 = require("../controllers/Authcontrollers");
const Usercontroller_1 = require("../controllers/Usercontroller");
const Authmiddlewares_1 = require("../middlewares/Authmiddlewares");
const router = express_1.default.Router();
// Public routes
router.post('/register', Authcontrollers_1.registerUser);
router.post('/login', Authcontrollers_1.loginUser);
router.get("/", Authmiddlewares_1.authMiddleware, Usercontroller_1.getAllUsers);
router.post('/forgot-password', Authcontrollers_1.forgotPassword);
router.post('/reset-password', Authcontrollers_1.resetPassword);
// Example protected route that requires a valid token
router.get('/profile', Authmiddlewares_1.authMiddleware, (req, res) => {
    res.status(200).json({ message: 'You accessed a protected route!', user: req.user });
});
exports.default = router;
