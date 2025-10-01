import express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import productRoutes from "./Routes/ProductRoutes";
import orderRoutes from "./Routes/OrderRoutes";
import cartitemRoutes from "./Routes/CartItemRoutes";
import authRoutes from "./Routes/AuthRoutes";
import contactRoutes from "./Routes/ContactRoutes";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ create io instance
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(morgan("dev"));
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartitemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Byakunze we", status: "200" });
});

mongoose
  .connect(process.env.DB_URL || "", {})
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => console.error("MongoDB connection error:", err));
