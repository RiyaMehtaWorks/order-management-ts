import { useEffect, useState } from "react";
import { Order, OrderStatus } from "../types";

const STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "RECEIVED", label: "Order Received", icon: "🧾" },
  { key: "PREPARING", label: "Preparing", icon: "👨‍🍳" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "🛵" },
  { key: "DELIVERED", label: "Delivered", icon: "🎉" },
];

const CONFETTI = [
  { left: "8%", delay: "0s", rotate: "-20deg" },
  { left: "18%", delay: "0.15s", rotate: "15deg" },
  { left: "30%", delay: "0.3s", rotate: "-35deg" },
  { left: "42%", delay: "0.1s", rotate: "25deg" },
  { left: "55%", delay: "0.25s", rotate: "-15deg" },
  { left: "68%", delay: "0.4s", rotate: "30deg" },
  { left: "80%", delay: "0.05s", rotate: "-25deg" },
  { left: "90%", delay: "0.2s", rotate: "20deg" },
];

export default function OrderStatusTracker({ order }: { order: Order }) {
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (order.status === "DELIVERED") {
      setCelebrate(true);

      const timer = setTimeout(() => {
        setCelebrate(false);
      }, 5000);

      return () => clearTimeout(timer);
    }

    setCelebrate(false);
  }, [order.status]);

  if (order.status === "CANCELLED") {
    return (
      <div
        className="rounded-xl bg-red-50 p-6 text-center font-semibold text-red-600"
        data-testid="order-cancelled"
      >
        This order was cancelled.
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="relative" data-testid="status-tracker">
      {/* Celebration */}
      {celebrate && (
        <div className="pointer-events-none absolute inset-x-0 -top-20 h-32 overflow-hidden">
          {CONFETTI.map((piece, index) => (
            <span
              key={index}
              className="absolute top-0 h-3 w-2 rounded-sm bg-brand animate-confetti"
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                transform: `rotate(${piece.rotate})`,
              }}
            />
          ))}
        </div>
      )}

      {order.status === "DELIVERED" && celebrate && (
        <div className="mb-8 flex flex-col items-center text-center animate-delivery">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-brand text-4xl text-white shadow-lg animate-delivery-pulse">
            ✓
          </div>

          <h2 className="text-2xl font-bold text-brand">Order Delivered!</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Your food has arrived. Enjoy your meal!
          </p>
        </div>
      )}

      {/* Progress tracker */}
      <div className="grid grid-cols-4" data-testid="status-tracker">
        {STEPS.map((step, idx) => {
          const isDone = idx <= currentIdx;

          return (
            <div
              key={step.key}
              className="relative flex min-w-0 flex-col items-center text-center"
            >
              {/* Connector */}
              {idx > 0 && (
                <div
                  className={`absolute left-0 right-1/2 top-5 h-1 -translate-y-1/2 ${
                    isDone ? "bg-brand" : "bg-neutral-200"
                  }`}
                />
              )}

              {idx < STEPS.length - 1 && (
                <div
                  className={`absolute left-1/2 right-0 top-5 h-1 -translate-y-1/2 ${
                    idx < currentIdx ? "bg-brand" : "bg-neutral-200"
                  }`}
                />
              )}

              {/* Step icon */}
              <div
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base transition-all duration-500 sm:h-10 sm:w-10 sm:text-lg ${
                  isDone
                    ? "bg-brand text-white"
                    : "bg-neutral-200 text-neutral-400"
                } ${
                  step.key === "DELIVERED" && order.status === "DELIVERED"
                    ? "scale-125 shadow-lg"
                    : ""
                }`}
              >
                {step.icon}
              </div>

              {/* Label */}
              <span
                className={`mt-2 w-full px-1 text-[10px] font-medium leading-tight sm:text-xs ${
                  isDone ? "text-brand" : "text-neutral-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
