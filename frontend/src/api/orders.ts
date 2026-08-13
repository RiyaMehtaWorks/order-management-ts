import { apiClient } from "./client";
import { CustomerDetails, Order } from "../types";

export interface CreateOrderPayload {
  items: { menuItemId: string; quantity: number }[];
  customer: CustomerDetails;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await apiClient.post<{ data: Order }>("/api/orders", payload);
  return res.data.data;
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await apiClient.get<{ data: Order[] }>("/api/orders");
  return res.data.data;
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const res = await apiClient.get<{ data: Order }>(`/api/orders/${orderId}`);
  return res.data.data;
}
