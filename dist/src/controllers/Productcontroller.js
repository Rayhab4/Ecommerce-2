"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const cloudinaryConfig_1 = __importDefault(require("../cloudinaryConfig"));
const ProductModel_1 = __importDefault(require("../Models/ProductModel"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const createProduct = async (req, res) => {
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
            const cloudinaryResponse = await cloudinaryConfig_1.default.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error) {
                    throw new Error('Image upload failed');
                }
                imageUrl = result?.secure_url;
            });
            image.stream.pipe(cloudinaryResponse);
        }
        const product = await ProductModel_1.default.create({
            name,
            description,
            price,
            imageUrl,
            category,
        });
        res.status(201).json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (_req, res) => {
    try {
        const products = await ProductModel_1.default.find();
        res.status(200).json({ success: true, data: products });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const product = await ProductModel_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const image = req.file;
        let imageUrl = null;
        if (image) {
            const cloudinaryResponse = await cloudinaryConfig_1.default.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error) {
                    throw new Error('Image upload failed');
                }
                imageUrl = result?.secure_url;
            });
            image.stream.pipe(cloudinaryResponse);
        }
        const updated = await ProductModel_1.default.findByIdAndUpdate(req.params.id, { name, description, price, category, imageUrl }, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const deleted = await ProductModel_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product deleted' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.deleteProduct = deleteProduct;
