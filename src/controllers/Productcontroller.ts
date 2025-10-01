import { Request, Response } from "express";
import cloudinary from "../cloudinaryConfig";
import Product from "../Models/ProductModel";

import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file;
  
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and price are required',
      });
    }
  
    let imageUrl = null;
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error: any , result: any ) => {
          if (error) {
            throw new Error('Image upload failed');
          }
          imageUrl = result?.secure_url;
        }
      ); 
    
      image.stream.pipe(cloudinaryResponse);
    }
    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file;
  
    let imageUrl = null;
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            throw new Error('Image upload failed');
          }
          imageUrl = result?.secure_url;
        }
      );
      image.stream.pipe(cloudinaryResponse);
    }
  
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, imageUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
