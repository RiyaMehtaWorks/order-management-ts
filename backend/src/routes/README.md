# `routes/` - endpoint definitions

| Method | Path                       | Description                        |
|--------|-----------------------------|-------------------------------------|
| GET    | /api/menu                   | list all menu items                 |
| GET    | /api/menu/:id                | single menu item (404 if missing)  |
| POST   | /api/orders                  | place an order                     |
| GET    | /api/orders                  | list all orders (newest first)     |
| GET    | /api/orders/:id               | single order (for status tracking) |
| PATCH  | /api/orders/:id/status         | manually advance/cancel a status  |
| GET    | /api/health                  | health check                       |

Routes just wire an HTTP method + path to a controller method resolved from
the DI container - no logic here.
