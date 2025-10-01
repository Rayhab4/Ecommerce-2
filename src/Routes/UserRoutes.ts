import express from 'express';
import { newuser, getUser, updateUser, deleteUser } from '../controllers/Usercontroller';
import { authMiddleware } from '../middlewares/Authmiddlewares';

const router = express.Router();

// Create a new user (this route may be public for registration)
router.post('/new', newuser);

// Protect the following routes with authentication middleware
router.get('/:id', authMiddleware, getUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
