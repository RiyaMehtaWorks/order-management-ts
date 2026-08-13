import { Router } from "express";
import { Container } from "inversify";
import { OrderController } from "../controllers/OrderController";

export function orderRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get(OrderController);

  router.post("/", controller.createOrder);
  router.get("/", controller.getAllOrders);
  router.get("/:id", controller.getOrder);
  router.patch("/:id/status", controller.updateStatus);

  return router;
}
