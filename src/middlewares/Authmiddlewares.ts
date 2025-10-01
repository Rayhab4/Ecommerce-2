import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/UserModel';
import dotenv from 'dotenv';
dotenv.config();



const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in your environment variables');
}


declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email?: string;
        name?: string;
       
      };
    }
  }
}


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication token is missing or invalid format' });
      return;
    }

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await UserModel.findById(decoded._id).select('_id email name'); // or select more if needed

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
    catch (error: any) {
      console.error("Auth error:", error.message); 
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Token has expired' });
      } else {
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    }

};
