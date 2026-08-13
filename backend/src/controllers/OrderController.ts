import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../container/types";
import { OrderService } from "../services/OrderService";
import { validateCreateOrderInput, validateStatusInput } from "../utils/validators";
import { OrderStatus } from "../types";

@injectable()
export class OrderController {
  constructor(@inject(TYPES.OrderService) private orderService: OrderService) {}

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validateCreateOrderInput(req.body);
      const order = await this.orderService.createOrder(input);
      res.status(201).json({ data: order });
    } catch (err) {
      next(err);
    }
  };

  getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.getOrder(req.params.id);
      res.json({ data: order });
    } catch (err) {
      next(err);
    }
  };

  getAllOrders = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({ data: orders });
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = validateStatusInput(req.body) as OrderStatus;
      const order = await this.orderService.updateStatus(req.params.id, status);
      res.json({ data: order });
    } catch (err) {
      next(err);
    }
  };
}
