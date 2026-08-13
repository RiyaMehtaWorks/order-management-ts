import { injectable } from "inversify";
import { OrderStatus, STATUS_FLOW } from "../types";

// Simulates a kitchen/delivery pipeline: every ~8s the order automatically
// advances to the next status until DELIVERED. Cancelled/delivered orders
// are left alone. Purely in-process (setTimeout chain) - good enough for a
// demo; a production system would use a job queue instead.
@injectable()
export class OrderStatusSimulator {
  private timers = new Map<string, NodeJS.Timeout>();

  start(
    orderId: string,
    currentStatus: OrderStatus,
    onAdvance: (orderId: string, nextStatus: OrderStatus) => Promise<void>,
    stepMs = 8000,
  ) {
    this.stop(orderId); // clear any pre-existing timer, just in case
    const idx = STATUS_FLOW.indexOf(currentStatus);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return; // terminal/unknown

    const timer = setTimeout(async () => {
      const nextStatus = STATUS_FLOW[idx + 1];
      await onAdvance(orderId, nextStatus);
      if (nextStatus !== "DELIVERED") {
        this.start(orderId, nextStatus, onAdvance, stepMs);
      } else {
        this.timers.delete(orderId);
      }
    }, stepMs);

    this.timers.set(orderId, timer);
  }

  stop(orderId: string) {
    const t = this.timers.get(orderId);
    if (t) {
      clearTimeout(t);
      this.timers.delete(orderId);
    }
  }
}
