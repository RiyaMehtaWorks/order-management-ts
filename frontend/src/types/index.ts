// Mirrors backend/src/types/index.ts so the frontend and backend agree on
// data shape end-to-end.

export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

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

// Client-side cart line - keyed by menu item so quantity can be bumped.
export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
}
