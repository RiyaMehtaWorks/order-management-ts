import mongoose, { Schema } from "mongoose";
import { MenuItem } from "../types";

// Mongoose schema mirroring the `MenuItem` domain type. Only used when
// MONGO_URI is configured (see repositories/MongoMenuRepository.ts).
const menuItemSchema = new Schema<MenuItem>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, required: true, default: true }
});

export const MenuItemModel = mongoose.model<MenuItem>("MenuItem", menuItemSchema);
