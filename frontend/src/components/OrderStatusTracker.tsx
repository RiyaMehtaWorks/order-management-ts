import { Order, OrderStatus } from "../types";

const STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "RECEIVED", label: "Order Received", icon: "🧾" },
  { key: "PREPARING", label: "Preparing", icon: "👨‍🍳" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "🛵" },
  { key: "DELIVERED", label: "Delivered", icon: "🎉" }
];

// Horizontal progress tracker. Highlights every step up to the order's
// current status; renders a distinct banner if the order was cancelled.
export default function OrderStatusTracker({ order }: { order: Order }) {
  if (order.status === "CANCELLED") {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center font-semibold text-red-600" data-testid="order-cancelled">
        This order was cancelled.
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="flex items-center justify-between" data-testid="status-tracker">
      {STEPS.map((step, idx) => {
        const isDone = idx <= currentIdx;
        return (
          <div key={step.key} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div className={`h-1 flex-1 ${idx === 0 ? "invisible" : isDone ? "bg-brand" : "bg-neutral-200"}`} />
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-colors ${
                  isDone ? "bg-brand text-white" : "bg-neutral-200 text-neutral-400"
                }`}
              >
                {step.icon}
              </div>
              <div className={`h-1 flex-1 ${idx === STEPS.length - 1 ? "invisible" : isDone ? "bg-brand" : "bg-neutral-200"}`} />
            </div>
            <span className={`mt-2 text-xs font-medium ${isDone ? "text-brand" : "text-neutral-400"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
