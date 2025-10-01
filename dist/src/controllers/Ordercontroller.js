"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrderById = exports.getAllOrders = exports.placeOrder = void 0;
const CartItemModel_1 = __importDefault(require("../Models/CartItemModel"));
const OrderModel_1 = __importDefault(require("../Models/OrderModel"));
// 🛒 Place an Order from Cart Items
const placeOrder = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const cartItemsData = await CartItemModel_1.default.find({ userId }).populate("productId");
        if (!cartItemsData || cartItemsData.length === 0) {
            return res.status(400).json({ success: false, message: "No cart items found for this user" });
        }
        let totalPrice = 0;
        const orderItems = [];
        for (const cartItem of cartItemsData) {
            const product = cartItem.productId;
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found for cart item ${cartItem._id}` });
            }
            const priceAtPurchase = product.price;
            totalPrice += priceAtPurchase * cartItem.quantity;
            orderItems.push({
                productId: product,
                quantity: cartItem.quantity,
                priceAtPurchase,
            });
        }
        const createdOrder = await OrderModel_1.default.create({
            userId,
            items: orderItems,
            totalPrice,
            status: "pending",
            createdAt: new Date(),
        });
        // Remove cart items after order creation
        const cartItemIds = cartItemsData.map((cartItem) => cartItem._id);
        await CartItemModel_1.default.deleteMany({ _id: { $in: cartItemIds } });
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: createdOrder,
        });
    }
    catch (err) {
        console.error("Error during order creation:", err);
        return res.status(500).json({ success: false, message: err?.message || "Internal server error" });
    }
};
exports.placeOrder = placeOrder;
// 📦 Get All Orders (Admin sees all, user sees own)
const getAllOrders = async (req, res) => {
    try {
        let orders;
        if (req.user?.role === "admin") {
            // Admin sees all orders
            orders = await OrderModel_1.default.find()
                .populate("userId", "name email")
                .populate("items.productId", "name price");
        }
        else {
            // Regular user sees only their own orders
            orders = await OrderModel_1.default.find({ userId: req.user?._id })
                .populate("userId", "name email")
                .populate("items.productId", "name price");
        }
        return res.status(200).json({ success: true, data: orders });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message || "Failed to fetch orders", data: null });
    }
};
exports.getAllOrders = getAllOrders;
// 📦 Get a Single Order by ID (only if it belongs to the user or admin)
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        let order;
        if (req.user?.role === "admin") {
            order = await OrderModel_1.default.findById(orderId).populate("items.productId", "name price").populate("userId", "name email");
        }
        else {
            order = await OrderModel_1.default.findOne({ _id: orderId, userId: req.user?._id }).populate("items.productId", "name price");
        }
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found", data: null });
        }
        return res.status(200).json({ success: true, data: order });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message || "Failed to fetch order", data: null });
    }
};
exports.getOrderById = getOrderById;
// ❌ Cancel an Order (only if it belongs to the user)
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        let order;
        if (req.user?.role === "admin") {
            order = await OrderModel_1.default.findByIdAndDelete(orderId);
        }
        else {
            order = await OrderModel_1.default.findOneAndDelete({ _id: orderId, userId: req.user?._id });
        }
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found", data: null });
        }
        return res.status(200).json({ success: true, message: "Order canceled", data: order });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message || "Failed to cancel order", data: null });
    }
};
exports.cancelOrder = cancelOrder;
