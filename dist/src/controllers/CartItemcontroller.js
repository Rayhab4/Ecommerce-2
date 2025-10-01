"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItem = exports.updateCartItem = exports.getCartItems = exports.addToCart = void 0;
const CartItemModel_1 = __importDefault(require("../Models/CartItemModel"));
const ProductModel_1 = __importDefault(require("../Models/ProductModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
// ➕ Add to Cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { items } = req.body; // Now this will handle both single and multiple items
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        // If items is not an array, treat it as a single item
        const cartItems = Array.isArray(items) ? items : [items];
        const cartItemsToAdd = [];
        for (let item of cartItems) {
            const { productId, quantity } = item;
            if (!isValidObjectId(productId)) {
                return res.status(400).json({ success: false, message: `Invalid productId: ${productId}` });
            }
            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
            }
            const product = await ProductModel_1.default.findById(productId);
            if (!product)
                return res.status(404).json({ success: false, message: `Product ${productId} not found` });
            // Check if item already exists in user's cart
            const existingItem = await CartItemModel_1.default.findOne({ userId, productId });
            if (existingItem) {
                existingItem.quantity += quantity;
                await existingItem.save();
                cartItemsToAdd.push(existingItem);
            }
            else {
                const newCartItem = new CartItemModel_1.default({ userId, productId, quantity });
                await newCartItem.save();
                cartItemsToAdd.push(newCartItem);
            }
        }
        return res.status(200).json({ success: true, message: "Items added to cart", data: cartItemsToAdd });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.addToCart = addToCart;
// 📥 Get Cart Items for Authenticated User
const getCartItems = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const items = await CartItemModel_1.default.find({ userId }).populate("productId");
        return res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCartItems = getCartItems;
// ✏️ Update Quantity of a Cart Item
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        if (!isValidObjectId(productId))
            return res.status(400).json({ success: false, message: "Invalid productId" });
        if (!Number.isInteger(quantity) || quantity <= 0)
            return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
        const item = await CartItemModel_1.default.findOneAndUpdate({ userId, productId }, { quantity }, { new: true });
        if (!item)
            return res.status(404).json({ success: false, message: "Cart item not found" });
        return res.status(200).json({ success: true, message: "Cart item updated", data: item });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCartItem = updateCartItem;
// ❌ Remove Item from Cart
const removeCartItem = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { cartId } = req.params;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        if (!isValidObjectId(cartId))
            return res.status(400).json({ success: false, message: "Invalid cartId" });
        // Fix: Use _id instead of cartId
        const deletedItem = await CartItemModel_1.default.findOneAndDelete({ userId, _id: cartId });
        if (!deletedItem)
            return res.status(404).json({ success: false, message: "Cart item not found" });
        return res.status(200).json({ success: true, message: "Cart item removed", data: deletedItem });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.removeCartItem = removeCartItem;
