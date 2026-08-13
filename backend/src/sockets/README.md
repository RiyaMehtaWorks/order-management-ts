# `sockets/` - real-time order status updates

`SocketEmitter` wraps `socket.io`. `server.ts` calls `socketEmitter.init()`
once, attaching it to the raw HTTP server. `OrderService` calls
`socketEmitter.emitOrderUpdate(order)` any time an order's status changes
(both from the simulated auto-progression and a manual
`PATCH /api/orders/:id/status`), pushing the fresh order object to every
client subscribed to that order's room (`order:<id>`).

Frontend counterpart: `frontend/src/hooks/useSocket.ts` connects, joins the
room for the order being tracked, and updates React state live - no
polling needed.
