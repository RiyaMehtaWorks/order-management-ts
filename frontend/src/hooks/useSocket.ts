import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Order } from "../types";

let socket: Socket | null = null;
function getSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || "http://localhost:5001", {
      autoConnect: true,
    });
  }
  return socket;
}

// Subscribes to live status updates for one order. Joins the `order:<id>`
// room on mount, leaves it on unmount/orderId change - see
// backend/src/sockets/README.md for the server side of this.
export function useOrderSocket(
  orderId: string | undefined,
  onUpdate: (order: Order) => void,
) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const s = getSocket();

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleUpdate = (order: Order) => {
      if (order.id === orderId) onUpdate(order);
    };

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);
    s.on("order:update", handleUpdate);
    s.emit("order:subscribe", orderId);
    if (s.connected) setConnected(true);

    return () => {
      s.emit("order:unsubscribe", orderId);
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
      s.off("order:update", handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return { connected };
}
