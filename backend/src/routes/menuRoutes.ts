import { Router } from "express";
import { Container } from "inversify";
import { MenuController } from "../controllers/MenuController";

export function menuRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get(MenuController);

  router.get("/", controller.getMenu);
  router.get("/:id", controller.getMenuItem);

  return router;
}
