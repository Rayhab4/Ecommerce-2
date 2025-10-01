import { Request, Response } from 'express';
import UserModel from '../Models/UserModel';

export interface User {
  name: string;
  email: string;
  password: string;
}

// Create a new user
export const newuser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: User = req.body; // Using the User interface
    const newUser = await UserModel.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get a user by ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser: User = req.body; 
    const user = await UserModel.findByIdAndUpdate(req.params.id, updatedUser, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};
