// Shared domain types used across repositories, services and controllers.

export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

// The order in which a status is allowed to naturally progress.
// Used by the simulator and by manual status-update validation.
export const STATUS_FLOW: OrderStatus[] = [
  "RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
}

export interface OrderLineItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderLineItem[];
  customer: CustomerDetails;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// DTO the client sends to place an order.
export interface CreateOrderInput {
  items: { menuItemId: string; quantity: number }[];
  customer: CustomerDetails;
}
