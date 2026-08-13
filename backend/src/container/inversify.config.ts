import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";

import { IMenuRepository, IOrderRepository } from "../repositories/interfaces";
import { InMemoryMenuRepository } from "../repositories/InMemoryMenuRepository";
import { InMemoryOrderRepository } from "../repositories/InMemoryOrderRepository";
import { MongoMenuRepository } from "../repositories/MongoMenuRepository";
import { MongoOrderRepository } from "../repositories/MongoOrderRepository";

import { MenuService } from "../services/MenuService";
import { OrderService } from "../services/OrderService";
import { OrderStatusSimulator } from "../services/OrderStatusSimulator";

import { MenuController } from "../controllers/MenuController";
import { OrderController } from "../controllers/OrderController";

import { SocketEmitter, socketEmitter } from "../sockets";

// Builds the DI container. `useMongo` decides, once at startup, whether the
// Mongo-backed or in-memory repositories get bound - everything else in the
// app is unaware of this decision (see repositories/README.md).
export function buildContainer(useMongo: boolean): Container {
  const container = new Container();

  if (useMongo) {
    container
      .bind<IMenuRepository>(TYPES.MenuRepository)
      .to(MongoMenuRepository);
    container
      .bind<IOrderRepository>(TYPES.OrderRepository)
      .to(MongoOrderRepository);
  } else {
    container
      .bind<IMenuRepository>(TYPES.MenuRepository)
      .to(InMemoryMenuRepository);
    container
      .bind<IOrderRepository>(TYPES.OrderRepository)
      .to(InMemoryOrderRepository);
  }

  container
    .bind<SocketEmitter>(TYPES.SocketEmitter)
    .toConstantValue(socketEmitter);
  container
    .bind<OrderStatusSimulator>(TYPES.OrderStatusSimulator)
    .to(OrderStatusSimulator)
    .inSingletonScope();

  container.bind<MenuService>(TYPES.MenuService).to(MenuService);
  container.bind<OrderService>(TYPES.OrderService).to(OrderService);

  container.bind<MenuController>(MenuController).toSelf();
  container.bind<OrderController>(OrderController).toSelf();

  return container;
}
