# `sockets/` - real-time order status updates

`SocketEmitter` wraps `socket.io`. `server.ts` calls `socketEmitter.init()`
once, attaching it to the raw HTTP server. `OrderService` then calls
`socketEmitter.emitOrderUpdate(order)` any time an order's status changes
(both from the simulated auto-progression and from a manual
`PATCH /api/orders/:id/status` call), which pushes the fresh order object to
every client subscribed to that order's room (`order:<id>`).

Frontend counterpart: `frontend/src/hooks/useSocket.ts` connects, joins the
room for the order being tracked, and updates React state live - no
polling needed.

# `services/` - business logic (see backend/src README for architecture)

- `MenuService.ts`: fetch menu / single item, 404 if missing.
- `OrderService.ts`: the core of the app -
  - re-prices every order server-side from the menu (never trusts client
    prices - a classic e-commerce edge case),
  - rejects unavailable items,
  - computes `totalAmount`,
  - enforces the status state-machine (`RECEIVED -> PREPARING ->
    OUT_FOR_DELIVERY -> DELIVERED`, or `CANCELLED` from any non-terminal
    state; no skipping backwards, no changes after DELIVERED/CANCELLED),
  - starts the `OrderStatusSimulator` on creation, and
  - emits a socket event on every status change so subscribed clients get
    a live update.
- `OrderStatusSimulator.ts`: advances an order through the status flow on a
  timer (default every 8s) to simulate a kitchen without any manual input.
