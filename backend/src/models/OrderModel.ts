import mongoose, { Schema } from "mongoose";
import { Order } from "../types";

const orderLineItemSchema = new Schema(
  {
    menuItemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { _id: false }
);

const orderSchema = new Schema<Order>({
  id: { type: String, required: true, unique: true },
  items: { type: [orderLineItemSchema], required: true },
  customer: { type: customerSchema, required: true },
  status: {
    type: String,
    enum: ["RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
    default: "RECEIVED"
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

export const OrderModel = mongoose.model<Order>("Order", orderSchema);
