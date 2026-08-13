import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Order } from "../types";

// Thin wrapper around Socket.IO so services can emit events without
// importing socket.io directly (keeps services testable/decoupled).
//
// Rooms: every order gets its own room named `order:<id>`. The client joins
// that room on the order-status page, so updates are pushed only to
// clients actually watching that order (not broadcast to everyone).
export class SocketEmitter {
  private io: SocketIOServer | null = null;

  init(server: HttpServer, clientOrigin: string) {
    this.io = new SocketIOServer(server, {
      cors: { origin: clientOrigin.split(","), methods: ["GET", "POST"] }
    });

    this.io.on("connection", (socket) => {
      socket.on("order:subscribe", (orderId: string) => {
        if (typeof orderId === "string" && orderId.trim()) {
          socket.join(`order:${orderId}`);
        }
      });
      socket.on("order:unsubscribe", (orderId: string) => {
        if (typeof orderId === "string") socket.leave(`order:${orderId}`);
      });
    });

    return this.io;
  }

  emitOrderUpdate(order: Order) {
    this.io?.to(`order:${order.id}`).emit("order:update", order);
  }
}

// Singleton instance shared between server.ts (init) and the DI container
// (bound as a constant value so services can inject it).
export const socketEmitter = new SocketEmitter();
