// controllers/blogController.ts
import { Request, Response } from "express";
import Blog, { IBlog } from "../Models/BlogModel";

// Get all blogs
export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs: IBlog[] = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single blog by ID
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog: IBlog | null = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new blog
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newBlog: IBlog = new Blog({ title, content, author });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog: IBlog | null = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a blog
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, author } = req.body;
    const blog: IBlog | null = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true }
    );
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
