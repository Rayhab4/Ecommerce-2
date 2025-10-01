"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.newuser = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
// Create a new user
const newuser = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Using the User interface
        const newUser = await UserModel_1.default.create({ name, email, password });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create user', error });
    }
};
exports.newuser = newuser;
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel_1.default.find();
        res.status(200).json({ success: true, data: users });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllUsers = getAllUsers;
// Get a user by ID
const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get user', error });
    }
};
exports.getUser = getUser;
// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const updatedUser = req.body;
        const user = await UserModel_1.default.findByIdAndUpdate(req.params.id, updatedUser, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
};
exports.updateUser = updateUser;
// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const user = await UserModel_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};
exports.deleteUser = deleteUser;
