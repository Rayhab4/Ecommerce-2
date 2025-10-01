import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "../controllers/CartItemcontroller";
import { authMiddleware } from '../middlewares/Authmiddlewares';

const router = express.Router();

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCartItems);
router.put('/:productId', authMiddleware, updateCartItem);
router.delete('/:cartId', authMiddleware, removeCartItem);

export default router;
