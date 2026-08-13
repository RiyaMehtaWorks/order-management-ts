# `tests/` - backend test suite (Vitest)

Run all: `npm test` (from `/backend`).

- `unit/`: pure logic, no HTTP, no Express - fast feedback.
  - `validators.test.ts`: every input-validation edge case (empty items,
    bad quantity, invalid phone, short address/name, unknown status...).
  - `OrderService.test.ts`: business rules injected with in-memory
    repositories directly (bypassing HTTP) - server-side pricing, rejecting
    unavailable items, the full status state machine.
- `integration/`: spins up the real Express app (`createApp`) with a fresh
  in-memory container per test, and drives it through `supertest` exactly
  like a real HTTP client would (no server/port needed).
  - `menu.api.test.ts`: menu listing, single item, 404s.
  - `orders.api.test.ts`: full order CRUD lifecycle, status transitions,
    and validation error responses.

Together these cover: CRUD on orders, input validation, and order-status
updates, as required by the assessment brief.
