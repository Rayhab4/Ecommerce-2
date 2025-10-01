import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referring to the User model
      required: true,
      index: true,  // Adding an index for faster user-based queries
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Referring to the Product model
      required: true,
      index: true,  // Adding an index for faster product-based queries
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"], // Validating quantity
      max: [100, "Quantity cannot exceed 100"], // Optional: limit for max quantity
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICartItem>("CartItem", cartItemSchema);
