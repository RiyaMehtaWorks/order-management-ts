# `controllers/` - HTTP layer

Controllers are intentionally thin: parse/validate the request, call a
service, shape the HTTP response (`{ data: ... }` on success). All actual
logic lives in `services/`. Every handler is wrapped in try/catch that
forwards to `next(err)`, so all errors funnel through
`middlewares/errorHandler.ts` for one consistent error response shape:
`{ error: { message, details? } }`.
