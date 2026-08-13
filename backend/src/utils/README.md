# `utils/` - framework-agnostic helpers

- `ApiError.ts`: one error class (`statusCode` + `message` + optional
  `details`) thrown anywhere in the app and turned into a JSON response by
  `middlewares/errorHandler.ts`.
- `validators.ts`: pure functions that validate raw request bodies
  (`validateCreateOrderInput`, `validateStatusInput`) and throw a
  `ApiError.badRequest(...)` on the first problem found. Pure + no
  Express/DB imports, so they're trivially unit-testable
  (see `tests/unit/validators.test.ts`).
