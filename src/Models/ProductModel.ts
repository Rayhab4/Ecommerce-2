import mongoose, { Schema, Document } from "mongoose";
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);