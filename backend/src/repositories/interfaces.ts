import { MenuItem, Order } from "../types";

// Repositories only do data access. Services depend on these interfaces,
// never on the concrete In-Memory / Mongo implementation directly - that's
// what lets us swap persistence without touching business logic.

export interface IMenuRepository {
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
}

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  update(order: Order): Promise<Order>;
}
