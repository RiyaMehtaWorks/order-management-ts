import { injectable } from "inversify";
import { IOrderRepository } from "./interfaces";
import { Order } from "../types";

@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders = new Map<string, Order>();

  async create(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async update(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }
}
