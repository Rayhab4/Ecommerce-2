"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ProductRoutes_1 = __importDefault(require("./Routes/ProductRoutes"));
const OrderRoutes_1 = __importDefault(require("./Routes/OrderRoutes"));
const CartItemRoutes_1 = __importDefault(require("./Routes/CartItemRoutes"));
const AuthRoutes_1 = __importDefault(require("./Routes/AuthRoutes"));
const ContactRoutes_1 = __importDefault(require("./Routes/ContactRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// ✅ create io instance
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
exports.io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});
app.use((0, morgan_1.default)("dev"));
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/products", ProductRoutes_1.default);
app.use("/api/order", OrderRoutes_1.default);
app.use("/api/cart", CartItemRoutes_1.default);
app.use("/api/auth", AuthRoutes_1.default);
app.use("/api/contact", ContactRoutes_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Byakunze we", status: "200" });
});
mongoose_1.default
    .connect(process.env.DB_URL || "", {})
    .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => console.error("MongoDB connection error:", err));
