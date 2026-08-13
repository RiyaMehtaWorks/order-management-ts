import { inject, injectable } from "inversify";
import { v4 as uuid } from "uuid";
import TYPES from "../container/types";
import { IOrderRepository, IMenuRepository } from "../repositories/interfaces";
import { CreateOrderInput, Order, OrderStatus, STATUS_FLOW } from "../types";
import { ApiError } from "../utils/ApiError";
import { OrderStatusSimulator } from "./OrderStatusSimulator";
import { SocketEmitter } from "../sockets";

@injectable()
export class OrderService {
  constructor(
    @inject(TYPES.OrderRepository)
    private orderRepository: IOrderRepository,

    @inject(TYPES.MenuRepository)
    private menuRepository: IMenuRepository,

    @inject(TYPES.OrderStatusSimulator)
    private simulator: OrderStatusSimulator,

    @inject(TYPES.SocketEmitter)
    private socketEmitter: SocketEmitter,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    // Never trust client-sent prices/names - always re-derive from the menu.
    const lineItems = [];
    for (const { menuItemId, quantity } of input.items) {
      const menuItem = await this.menuRepository.findById(menuItemId);
      if (!menuItem) {
        throw ApiError.badRequest(`Menu item '${menuItemId}' does not exist.`);
      }
      if (!menuItem.available) {
        throw ApiError.badRequest(
          `'${menuItem.name}' is currently unavailable.`,
        );
      }
      lineItems.push({
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });
    }

    const totalAmount = lineItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const now = new Date().toISOString();

    const order: Order = {
      id: uuid(),
      items: lineItems,
      customer: input.customer,
      status: "RECEIVED",
      totalAmount,
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.orderRepository.create(order);

    // Kick off the simulated real-time status pipeline.
    this.simulator.start(
      created.id,
      created.status,
      async (orderId, nextStatus) => {
        await this.updateStatus(orderId, nextStatus, true);
      },
    );

    return created;
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw ApiError.notFound(`Order '${id}' not found.`);
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    isSimulated = false,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw ApiError.notFound(`Order '${id}' not found.`);

    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      throw ApiError.conflict(
        `Order is already '${order.status}' and cannot change.`,
      );
    }

    // Manual updates must move forward in the flow (or cancel); they can't
    // skip backwards. Cancellation is allowed from any non-terminal state.
    if (!isSimulated && status !== "CANCELLED") {
      const currentIdx = STATUS_FLOW.indexOf(order.status);
      const nextIdx = STATUS_FLOW.indexOf(status);
      if (nextIdx <= currentIdx) {
        throw ApiError.badRequest(
          `Cannot move status from '${order.status}' to '${status}'.`,
        );
      }
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    const updated = await this.orderRepository.update(order);

    if (status === "CANCELLED" || status === "DELIVERED") {
      this.simulator.stop(id);
    }

    this.socketEmitter.emitOrderUpdate(updated);
    return updated;
  }
}
