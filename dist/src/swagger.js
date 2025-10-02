"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Commerce API",
            version: "1.0.0",
            description: "API documentation for Users, Products, Orders, CartItems, Contacts, and Auth",
        },
        servers: [{ url: "http://localhost:5000" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" },
                    },
                },
                Auth: {
                    type: "object",
                    properties: {
                        token: { type: "string", description: "JWT token for authentication" },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        price: { type: "number" },
                        imageUrl: { type: "string" },
                        category: { type: "string" },
                    },
                },
                CartItem: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string" },
                        productId: { type: "string" },
                        quantity: { type: "number" },
                    },
                },
                OrderItem: {
                    type: "object",
                    properties: {
                        productId: { type: "string" },
                        quantity: { type: "number" },
                        priceAtPurchase: { type: "number" },
                    },
                },
                Order: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string" },
                        items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/OrderItem" },
                        },
                        totalPrice: { type: "number" },
                        status: { type: "string", enum: ["pending", "completed", "canceled"] },
                    },
                },
                Contact: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        phone: { type: "string" },
                        message: { type: "string" },
                    },
                },
            },
        },
    },
    // ✅ Adjust path relative to this swagger.ts file
    apis: ["./src/Routes/*.ts", "./dist/Routes/*.js"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
