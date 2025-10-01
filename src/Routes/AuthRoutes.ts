import express from 'express';
import { loginUser, registerUser,forgotPassword,resetPassword } from '../controllers/Authcontrollers'
import { getAllUsers } from "../controllers/Usercontroller";
import { authMiddleware } from '../middlewares/Authmiddlewares';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get("/", authMiddleware, getAllUsers);

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword);

// Example protected route that requires a valid token
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'You accessed a protected route!', user: req.user });
});

export default router;
