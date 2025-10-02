"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Ordercontroller_1 = require("../controllers/Ordercontroller");
const Authmiddlewares_1 = require("../middlewares/Authmiddlewares");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */
/**
 * @swagger
 * /api/order/:
 *   post:
 *     summary: Place an order from cart items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: No cart items
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/order/", Authmiddlewares_1.authMiddleware, Ordercontroller_1.placeOrder);
/**
 * @swagger
 * /api/order/:
 *   get:
 *     summary: Get all orders (admin sees all, user sees own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/order/", Authmiddlewares_1.authMiddleware, Ordercontroller_1.getAllOrders);
/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get("/order/:id", Authmiddlewares_1.authMiddleware, Ordercontroller_1.getOrderById);
/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete("/order/:id", Authmiddlewares_1.authMiddleware, Ordercontroller_1.cancelOrder);
exports.default = router;
