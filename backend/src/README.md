# Backend README (`/backend/src`)

This is a map of the backend. Read this first, then open the file you care about.

## Layered architecture (Controller -> Service -> Repository)

```
routes/        HTTP endpoints, wires a URL + method to a controller method
controllers/   Reads req, calls a service, sends the HTTP response
services/      Business logic (totals, status flow, socket broadcasts)
repositories/  Data access ONLY. Two implementations per entity:
                 - InMemory*Repository  (default, zero setup)
                 - Mongo*Repository     (used automatically if MONGO_URI is set)
models/        Mongoose schemas (only used by the Mongo repositories)
container/     InversifyJS dependency-injection wiring (types.ts = DI tokens,
                inversify.config.ts = bindings)
types/         Shared TypeScript interfaces (Order, MenuItem, ...)
utils/         Validators + ApiError (framework-agnostic, pure functions)
middlewares/   Express error handler
sockets/       Socket.IO setup - emits real-time order status events
data/          Seed menu data + a seed script for Mongo
```

## Why this structure?
- **Swappable persistence**: controllers/services never talk to Mongoose or
  arrays directly - they depend on a `MenuRepository`/`OrderRepository`
  *interface*. Whether that interface is backed by MongoDB or an in-memory
  array is decided once, at startup, in `container/inversify.config.ts`,
  based on whether `MONGO_URI` is set. This means the exact same
  service/controller code works with or without a database.
- **Testability**: because services depend on interfaces, unit tests can
  inject a fake in-memory repository instead of hitting a real DB.
- **DI (InversifyJS)**: every class is decorated with `@injectable()` and
  wired in `container/inversify.config.ts`. `app.ts` resolves controllers
  from the container instead of `new`-ing them up, which keeps classes
  decoupled from each other.

## Request lifecycle example (placing an order)
`POST /api/orders`
1. `routes/orderRoutes.ts` maps the route to `OrderController.createOrder`.
2. `controllers/OrderController.ts` calls `validateCreateOrderInput` (throws
   `ApiError` on bad input), then calls `OrderService.createOrder`.
3. `services/OrderService.ts` looks up menu items (to trust server-side
   prices, never client-sent prices), computes the total, saves via
   `OrderRepository`, starts the status simulator, and emits a socket event.
4. `middlewares/errorHandler.ts` turns any thrown `ApiError` into a clean
   JSON error response; unexpected errors become a generic 500.

See each folder's own README.md for details on that layer.
