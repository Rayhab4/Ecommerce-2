import express from 'express';
import { loginUser, registerUser, forgotPassword, resetPassword } from '../controllers/Authcontrollers';
import { getAllUsers } from "../controllers/Usercontroller";
import { authMiddleware } from '../middlewares/Authmiddlewares';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Registration successful"
 *               role: "user"
 *               token: "jwt_token_here"
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               message: "User already exists"
 *       500:
 *         description: Server error
 */
router.post('/auth/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               role: "user"
 *               token: "jwt_token_here"
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid email or password"
 *       500:
 *         description: Server error
 */
router.post('/auth/login', loginUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset (send OTP)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OTP sent to your email."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Server error
 */
router.post('/auth/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "NewStrongPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Password reset successful!"
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid or expired OTP"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Server error
 */
router.post('/auth/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/:
 *   get:
 *     summary: Get all users (protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               - _id: "12345"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 role: "user"
 *       401:
 *         description: Unauthorized
 */
router.get("/auth/", authMiddleware, getAllUsers);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's profile
 *         content:
 *           application/json:
 *             example:
 *               message: "You accessed a protected route!"
 *               user:
 *                 _id: "12345"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *       401:
 *         description: Unauthorized
 */
router.get('/auth/profile', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'You accessed a protected route!', user: req.user });
});

export default router;
