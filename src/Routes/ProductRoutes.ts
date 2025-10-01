import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/Productcontroller";
import { authMiddleware } from '../middlewares/Authmiddlewares';

const router = express.Router();

router.post('/', authMiddleware, createProduct);
router.get('/', authMiddleware, getAllProducts);
router.get('/:id', authMiddleware, getProductById);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
