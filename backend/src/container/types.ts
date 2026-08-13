// Symbols used as InversifyJS binding identifiers (DI tokens).
const TYPES = {
  MenuRepository: Symbol.for("MenuRepository"),
  OrderRepository: Symbol.for("OrderRepository"),
  MenuService: Symbol.for("MenuService"),
  OrderService: Symbol.for("OrderService"),
  OrderStatusSimulator: Symbol.for("OrderStatusSimulator"),
  SocketEmitter: Symbol.for("SocketEmitter"),
};

export default TYPES;
