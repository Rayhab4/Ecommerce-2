"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Ordercontroller_1 = require("../controllers/Ordercontroller");
const Authmiddlewares_1 = require("../middlewares/Authmiddlewares");
const index_1 = require("../index"); // ✅ Make sure index.ts exports io
const router = (0, express_1.Router)();
// Place Order & Emit via Socket.IO
router.post("/", Authmiddlewares_1.authMiddleware, async (req, res) => {
    try {
        const createdOrder = await (0, Ordercontroller_1.placeOrder)(req, res);
        if (createdOrder) {
            index_1.io.emit("newOrder", createdOrder); // ✅ notify admins
        }
    }
    catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Failed to place order" });
        }
    }
});
router.get("/", Authmiddlewares_1.authMiddleware, Ordercontroller_1.getAllOrders);
router.get("/:id", Authmiddlewares_1.authMiddleware, Ordercontroller_1.getOrderById);
router.delete("/:id", Authmiddlewares_1.authMiddleware, Ordercontroller_1.cancelOrder);
exports.default = router;
