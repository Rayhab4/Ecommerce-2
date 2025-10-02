"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routers = void 0;
const express_1 = require("express");
const AuthRoutes_1 = __importDefault(require("./AuthRoutes"));
const UserRoutes_1 = __importDefault(require("./UserRoutes"));
const CartItemRoutes_1 = __importDefault(require("./CartItemRoutes"));
const ContactRoutes_1 = __importDefault(require("./ContactRoutes"));
const OrderRoutes_1 = __importDefault(require("./OrderRoutes"));
const ProductRoutes_1 = __importDefault(require("./ProductRoutes"));
const BlogRoutes_1 = __importDefault(require("./BlogRoutes"));
const routers = (0, express_1.Router)();
exports.routers = routers;
const allRoutes = [AuthRoutes_1.default, UserRoutes_1.default, OrderRoutes_1.default, ContactRoutes_1.default, CartItemRoutes_1.default, ProductRoutes_1.default, BlogRoutes_1.default];
routers.use("/api", ...allRoutes);
