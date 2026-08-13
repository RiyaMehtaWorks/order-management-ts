import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "../api/orders";
import { useOrderSocket } from "../hooks/useSocket";
import OrderStatusTracker from "../components/OrderStatusTracker";
import { Order } from "../types";

interface Props {
  orderId: string;
  onBackToMenu: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Order Received",
  PREPARING: "Preparing your food",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};

// Fetches the order once (for the initial render), then keeps it fresh via
// a Socket.IO subscription for true real-time updates - no polling interval.
export default function OrderStatusPage({ orderId, onBackToMenu }: Props) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId)
  });

  const [order, setOrder] = useState<Order | undefined>(data);
  useEffect(() => setOrder(data), [data]);

  const { connected } = useOrderSocket(orderId, (updated) => setOrder(updated));

  if (isLoading) {
    return <div className="p-10 text-center text-neutral-500">Loading your order...</div>;
  }
  if (isError || !order) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-red-600">{(error as Error)?.message || "Order not found."}</p>
        <button onClick={onBackToMenu} className="clickable rounded-lg bg-brand px-4 py-2 font-semibold text-white">
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={onBackToMenu} className="clickable mb-6 text-sm font-medium text-brand hover:underline">
        ← Back to menu
      </button>

      <div className="rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-neutral-500">{STATUS_LABELS[order.status]}</p>
          </div>
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              connected ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
            }`}
            data-testid="live-indicator"
          >
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-neutral-400"}`} />
            {connected ? "Live" : "Connecting..."}
          </span>
        </div>

        <OrderStatusTracker order={order} />

        <div className="mt-8 space-y-2 border-t pt-4">
          {order.items.map((line) => (
            <div key={line.menuItemId} className="flex justify-between text-sm">
              <span>{line.name} x {line.quantity}</span>
              <span>₹{line.price * line.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">
          <p className="font-medium text-neutral-800">Delivering to</p>
          <p>{order.customer.name}</p>
          <p>{order.customer.address}</p>
          <p>{order.customer.phone}</p>
        </div>
      </div>
    </div>
  );
}
