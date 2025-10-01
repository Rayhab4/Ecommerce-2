import express,{ Request, Response } from "express";
import CartItem from "../Models/CartItemModel";
import Product from "../Models/ProductModel";
import mongoose from "mongoose";

interface CartItemInput {
  productId: string;
  quantity: number;
}
export interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// ➕ Add to Cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { items } = req.body; // Now this will handle both single and multiple items

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    
    // If items is not an array, treat it as a single item
    const cartItems = Array.isArray(items) ? items : [items];

    const cartItemsToAdd = [];

    for (let item of cartItems) {
      const { productId, quantity }: CartItemInput = item;

      if (!isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: `Invalid productId: ${productId}` });
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
      }

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: `Product ${productId} not found` });

      // Check if item already exists in user's cart
      const existingItem = await CartItem.findOne({ userId, productId });

      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
        cartItemsToAdd.push(existingItem);
      } else {
        const newCartItem = new CartItem({ userId, productId, quantity });
        await newCartItem.save();
        cartItemsToAdd.push(newCartItem);
      }
    }

    return res.status(200).json({ success: true, message: "Items added to cart", data: cartItemsToAdd });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// 📥 Get Cart Items for Authenticated User
export const getCartItems = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const items = await CartItem.find({ userId }).populate("productId");
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Quantity of a Cart Item
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!isValidObjectId(productId)) return res.status(400).json({ success: false, message: "Invalid productId" });
    if (!Number.isInteger(quantity) || quantity <= 0) return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });

    const item = await CartItem.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true }
    );

    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });

    return res.status(200).json({ success: true, message: "Cart item updated", data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Remove Item from Cart
export const removeCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const { cartId } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!isValidObjectId(cartId)) return res.status(400).json({ success: false, message: "Invalid cartId" });

    // Fix: Use _id instead of cartId
    const deletedItem = await CartItem.findOneAndDelete({ userId, _id: cartId });

    if (!deletedItem) return res.status(404).json({ success: false, message: "Cart item not found" });

    return res.status(200).json({ success: true, message: "Cart item removed", data: deletedItem });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};