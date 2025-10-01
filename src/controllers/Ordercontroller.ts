import { Request, Response } from "express";
import mongoose from "mongoose";
import CartItem from "../Models/CartItemModel";
import Order from "../Models/OrderModel";
import { IProduct } from "../Models/ProductModel";

// Extend Request to include user
export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role?: string;
  };
}

// 🛒 Place an Order from Cart Items
export const placeOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const cartItemsData = await CartItem.find({ userId }).populate("productId");
    if (!cartItemsData || cartItemsData.length === 0) {
      return res.status(400).json({ success: false, message: "No cart items found for this user" });
    }

    let totalPrice = 0;
    const orderItems: {
      productId: mongoose.Types.ObjectId;
      quantity: number;
      priceAtPurchase: number;
    }[] = [];

    for (const cartItem of cartItemsData) {
      const product = cartItem.productId as unknown as IProduct;
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found for cart item ${cartItem._id}` });
      }
      const priceAtPurchase = product.price;
      totalPrice += priceAtPurchase * cartItem.quantity;

      orderItems.push({
        productId: product as unknown as mongoose.Types.ObjectId,
        quantity: cartItem.quantity,
        priceAtPurchase,
      });
    }

    const createdOrder = await Order.create({
      userId,
      items: orderItems,
      totalPrice,
      status: "pending",
      createdAt: new Date(),
    });

    // Remove cart items after order creation
    const cartItemIds = cartItemsData.map((cartItem) => cartItem._id);
    await CartItem.deleteMany({ _id: { $in: cartItemIds } });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: createdOrder,
    });
  } catch (err: any) {
    console.error("Error during order creation:", err);
    return res.status(500).json({ success: false, message: err?.message || "Internal server error" });
  }
};

// 📦 Get All Orders (Admin sees all, user sees own)
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    let orders;

    if (req.user?.role === "admin") {
      // Admin sees all orders
      orders = await Order.find()
        .populate("userId", "name email")
        .populate("items.productId", "name price");
    } else {
      // Regular user sees only their own orders
      orders = await Order.find({ userId: req.user?._id })
        .populate("userId", "name email")
        .populate("items.productId", "name price");
    }

    return res.status(200).json({ success: true, data: orders });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to fetch orders", data: null });
  }
};

// 📦 Get a Single Order by ID (only if it belongs to the user or admin)
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.id;
    let order;

    if (req.user?.role === "admin") {
      order = await Order.findById(orderId).populate("items.productId", "name price").populate("userId", "name email");
    } else {
      order = await Order.findOne({ _id: orderId, userId: req.user?._id }).populate("items.productId", "name price");
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found", data: null });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to fetch order", data: null });
  }
};

// ❌ Cancel an Order (only if it belongs to the user)
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.id;
    let order;

    if (req.user?.role === "admin") {
      order = await Order.findByIdAndDelete(orderId);
    } else {
      order = await Order.findOneAndDelete({ _id: orderId, userId: req.user?._id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found", data: null });
    }

    return res.status(200).json({ success: true, message: "Order canceled", data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to cancel order", data: null });
  }
};
