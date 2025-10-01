import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in your environment variables.');
}
export const generateToken = (_id: string): string => {
  return jwt.sign(
    { _id },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET as string); 
  } catch (error) {
    return null;
  }
};
