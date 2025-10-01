import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./ProductModel";


interface IOrderItem {
  productId: mongoose.Types.ObjectId; // Ref to Product
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId; // Who placed the order
  items: IOrderItem[];
  totalPrice: number; // This should match the sum of item prices
  status: "pending" | "completed" | "canceled"; // Status of the order
  createdAt: Date;
  updatedAt: Date;
}

// Define schema for order items
const OrderItemSchema = new Schema<IOrderItem>({
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  priceAtPurchase: { 
    type: Number, 
    required: true 
  },
});

// Define the main Order schema
const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      validate: {
        // Validation to make sure the total price matches the sum of individual item prices
        validator(value: number) {
          const calculatedTotal = this.items.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);
          return value === calculatedTotal;
        },
        message: "Total price does not match the sum of item prices.",
      },
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Automatically populate product details when fetching orders (in mongoose queries)
OrderSchema.pre("findOne", function(next) {
  this.populate('items.productId');  // Populate productId for each order item
  next();
});

OrderSchema.pre("find", function(next) {
  this.populate('items.productId');  // Populate productId for each order item
  next();
});

export default mongoose.model<IOrder>("Order", OrderSchema);
