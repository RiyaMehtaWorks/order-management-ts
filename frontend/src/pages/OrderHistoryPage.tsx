import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/orders";
import { fetchMenu } from "../api/menu";
import { Order } from "../types";

interface Props {
  onSelectOrder: (orderId: string) => void;
  onBackToMenu: () => void;
}

const STATUS_LABELS: Record<Order["status"], string> = {
  RECEIVED: "Order Received",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<Order["status"], string> = {
  RECEIVED: "bg-blue-50 text-blue-700",
  PREPARING: "bg-orange-50 text-orange-700",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function OrderHistoryPage({
  onSelectOrder,
  onBackToMenu,
}: Props) {
  // Fetch previous orders from backend
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    error: orderError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // Fetch menu so we can get images using menuItemId
  const { data: menu = [], isLoading: menuLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
  });

  const menuById = Object.fromEntries(menu.map((item) => [item.id, item]));

  if (ordersLoading || menuLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-200" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="h-20 animate-pulse bg-neutral-100" />
              <div className="space-y-4 p-5">
                <div className="h-16 animate-pulse rounded-xl bg-neutral-100" />
                <div className="h-16 animate-pulse rounded-xl bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="text-4xl">😕</div>

          <h2 className="mt-3 text-xl font-bold text-neutral-900">
            Couldn't load your orders
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            {(orderError as Error)?.message ||
              "Something went wrong while loading your order history."}
          </p>

          <button
            onClick={onBackToMenu}
            className="clickable mt-6 rounded-lg bg-brand px-5 py-2.5 font-semibold text-white"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900">
            Order History
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            {orders.length === 0
              ? "You haven't placed any orders yet."
              : `${orders.length} previous ${
                  orders.length === 1 ? "order" : "orders"
                }`}
          </p>
        </div>

        <button
          onClick={onBackToMenu}
          className="clickable whitespace-nowrap text-sm font-semibold text-brand hover:underline"
        >
          ← Back to Menu
        </button>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">🍽️</div>

          <h2 className="mt-4 text-xl font-bold text-neutral-900">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Your previous orders will appear here.
          </p>

          <button
            onClick={onBackToMenu}
            className="clickable mt-6 rounded-lg bg-brand px-5 py-2.5 font-semibold text-white"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const totalItems = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                {/* Order header */}
                <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-neutral-900">
                          Order #{order.id.slice(0, 8)}
                        </h2>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            STATUS_STYLES[order.status]
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-neutral-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-neutral-500">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </p>

                      <p className="mt-0.5 text-lg font-extrabold text-neutral-900">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-neutral-100 px-5 sm:px-6">
                  {order.items.map((item) => {
                    const menuItem = menuById[item.menuItemId];

                    return (
                      <div
                        key={`${order.id}-${item.menuItemId}`}
                        className="flex items-center gap-4 py-4"
                      >
                        {/* Food image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {menuItem?.image ? (
                            <img
                              src={menuItem.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">
                              🍽️
                            </div>
                          )}
                        </div>

                        {/* Food details */}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-neutral-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-neutral-500">
                            ₹{item.price} × {item.quantity}
                          </p>

                          <p className="mt-1 text-xs font-medium text-neutral-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        {/* Line total */}
                        <div className="shrink-0 text-right">
                          <p className="font-bold text-neutral-900">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs text-neutral-500">Order total</p>

                    <p className="text-lg font-extrabold text-neutral-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectOrder(order.id)}
                    className="clickable rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
                  >
                    View Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
