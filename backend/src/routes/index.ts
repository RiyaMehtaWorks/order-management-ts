import { Router } from "express";
import { Container } from "inversify";
import { menuRoutes } from "./menuRoutes";
import { orderRoutes } from "./orderRoutes";

// Aggregates all API routes under a single router, mounted at /api in app.ts.
export function apiRoutes(container: Container): Router {
  const router = Router();
  router.use("/menu", menuRoutes(container));
  router.use("/orders", orderRoutes(container));
  router.get("/health", (_req, res) => res.json({ status: "ok" }));
  return router;
}
