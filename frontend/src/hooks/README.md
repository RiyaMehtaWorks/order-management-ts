# `hooks/`

- `useCart.tsx`: a React Context + hook for the shopping cart (add, remove,
  change quantity, totals). In-memory only (no localStorage) - simple and
  sufficient for this assessment's scope; swapping in persistence later is
  a small change confined to this one file.
- `useSocket.ts`: `useOrderSocket(orderId, onUpdate)` connects to the
  backend's Socket.IO server, joins that order's room, and calls
  `onUpdate` with the fresh order every time the backend emits a status
  change - this is what makes the order-tracking page live/real-time
  instead of polling.
