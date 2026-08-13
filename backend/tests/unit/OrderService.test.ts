import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { OrderService } from "../../src/services/OrderService";
import { OrderStatusSimulator } from "../../src/services/OrderStatusSimulator";
import { InMemoryOrderRepository } from "../../src/repositories/InMemoryOrderRepository";
import { InMemoryMenuRepository } from "../../src/repositories/InMemoryMenuRepository";
import { SocketEmitter } from "../../src/sockets";
import { ApiError } from "../../src/utils/ApiError";

describe("OrderService", () => {
  let orderService: OrderService;
  let orderRepo: InMemoryOrderRepository;
  let menuRepo: InMemoryMenuRepository;

  beforeEach(() => {
    orderRepo = new InMemoryOrderRepository();
    menuRepo = new InMemoryMenuRepository();
    const simulator = new OrderStatusSimulator();
    const socketEmitter = { emitOrderUpdate: vi.fn() } as unknown as SocketEmitter;
    orderService = new OrderService(orderRepo, menuRepo, simulator, socketEmitter);
  });

  it("creates an order and computes the total from server-side menu prices", async () => {
    const order = await orderService.createOrder({
      items: [{ menuItemId: "m1", quantity: 2 }],
      customer: { name: "Jane", address: "123 Main St", phone: "1234567890" }
    });
    expect(order.status).toBe("RECEIVED");
    expect(order.totalAmount).toBe(249 * 2);
    expect(order.items[0].name).toBe("Margherita Pizza");
  });

  it("rejects an order for a non-existent menu item", async () => {
    await expect(
      orderService.createOrder({
        items: [{ menuItemId: "does-not-exist", quantity: 1 }],
        customer: { name: "Jane", address: "123 Main St", phone: "1234567890" }
      })
    ).rejects.toThrow(ApiError);
  });

  it("rejects an order for an unavailable item", async () => {
    await expect(
      orderService.createOrder({
        items: [{ menuItemId: "m10", quantity: 1 }],
        customer: { name: "Jane", address: "123 Main St", phone: "1234567890" }
      })
    ).rejects.toThrow(/unavailable/);
  });

  it("throws 404 when fetching a non-existent order", async () => {
    await expect(orderService.getOrder("nope")).rejects.toThrow(ApiError);
  });

  it("allows a forward status transition", async () => {
    const order = await orderService.createOrder({
      items: [{ menuItemId: "m1", quantity: 1 }],
      customer: { name: "Jane", address: "123 Main St", phone: "1234567890" }
    });
    const updated = await orderService.updateStatus(order.id, "PREPARING");
    expect(updated.status).toBe("PREPARING");
  });

  it("rejects a backwards status transition", async () => {
    const order = await orderService.createOrder({
      items: [{ menuItemId: "m1", quantity: 1 }],
      customer: { name: "Jane", address: "123 Main St", phone: "1234567890" }
    });
    await orderService.updateStatus(order.id, "PREPARING");
    await expect(orderService.updateStatus(order.id, "RECEIVED")).rejects.toThrow(ApiError);
  });

  it("rejects any status change after DELIVERED", async () => {
    const order = await orderService.createOrder({
      items: [{ menuItemId: "m1", quantity: 1 }],
      customer: { name: "Jane", address: "123 Main St", phone: "1234567890" }
    });
    await orderService.updateStatus(order.id, "PREPARING");
    await orderService.updateStatus(order.id, "OUT_FOR_DELIVERY");
    await orderService.updateStatus(order.id, "DELIVERED");
    await expect(orderService.updateStatus(order.id, "CANCELLED")).rejects.toThrow(ApiError);
  });

  it("allows cancellation from a non-terminal state", async () => {
    const order = await orderService.createOrder({
      items: [{ menuItemId: "m1", quantity: 1 }],
      customer: { name: "Jane", address: "123 Main St", phone: "1234567890" }
    });
    const cancelled = await orderService.updateStatus(order.id, "CANCELLED");
    expect(cancelled.status).toBe("CANCELLED");
  });
});
