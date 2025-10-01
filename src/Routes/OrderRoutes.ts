import { Router } from "express";
import { placeOrder, getAllOrders, getOrderById, cancelOrder } from "../controllers/Ordercontroller";
import { authMiddleware } from "../middlewares/Authmiddlewares";
import { io } from "../index"; // ✅ Make sure index.ts exports io

const router = Router();

// Place Order & Emit via Socket.IO
router.post("/", authMiddleware, async (req, res) => {
  try {
    const createdOrder = await placeOrder(req, res);
    if (createdOrder) {
      io.emit("newOrder", createdOrder); // ✅ notify admins
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to place order" });
    }
  }
});

router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.delete("/:id", authMiddleware, cancelOrder);

export default router;
