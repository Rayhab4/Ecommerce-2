import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import {routers} from "./Routes";

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger"

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Socket.IO setup
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

// Middleware
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());


// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use (routers);
// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Byakunze we", status: "200" });
});


// MongoDB connection + server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB_URL || "", {})
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err: any) => console.error("MongoDB connection error:", err));
