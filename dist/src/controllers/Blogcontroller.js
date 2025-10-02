"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlog = exports.deleteBlog = exports.createBlog = exports.getBlogById = exports.getAllBlogs = void 0;
const BlogModel_1 = __importDefault(require("../Models/BlogModel"));
// Get all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel_1.default.find().sort({ createdAt: -1 });
        res.json(blogs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllBlogs = getAllBlogs;
// Get single blog by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await BlogModel_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json(blog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getBlogById = getBlogById;
// Create a new blog
const createBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const newBlog = new BlogModel_1.default({ title, content, author });
        await newBlog.save();
        res.status(201).json(newBlog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createBlog = createBlog;
// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await BlogModel_1.default.findByIdAndDelete(req.params.id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteBlog = deleteBlog;
// Update a blog
const updateBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const blog = await BlogModel_1.default.findByIdAndUpdate(req.params.id, { title, content, author }, { new: true });
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json(blog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateBlog = updateBlog;
