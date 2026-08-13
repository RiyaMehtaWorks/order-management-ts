import { injectable } from "inversify";
import { IOrderRepository } from "./interfaces";
import { Order } from "../types";
import { OrderModel } from "../models/OrderModel";

@injectable()
export class MongoOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    await OrderModel.create(order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await OrderModel.findOne({ id }).lean();
    return doc ? toDomain(doc) : null;
  }

  async findAll(): Promise<Order[]> {
    const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return docs.map(toDomain);
  }

  async update(order: Order): Promise<Order> {
    await OrderModel.updateOne({ id: order.id }, order);
    return order;
  }
}

function toDomain(doc: any): Order {
  return {
    id: doc.id,
    items: doc.items,
    customer: doc.customer,
    status: doc.status,
    totalAmount: doc.totalAmount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}
