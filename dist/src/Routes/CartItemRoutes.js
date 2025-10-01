"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CartItemcontroller_1 = require("../controllers/CartItemcontroller");
const Authmiddlewares_1 = require("../middlewares/Authmiddlewares");
const router = express_1.default.Router();
router.post('/', Authmiddlewares_1.authMiddleware, CartItemcontroller_1.addToCart);
router.get('/', Authmiddlewares_1.authMiddleware, CartItemcontroller_1.getCartItems);
router.put('/:productId', Authmiddlewares_1.authMiddleware, CartItemcontroller_1.updateCartItem);
router.delete('/:cartId', Authmiddlewares_1.authMiddleware, CartItemcontroller_1.removeCartItem);
exports.default = router;
