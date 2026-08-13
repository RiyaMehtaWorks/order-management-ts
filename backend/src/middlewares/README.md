# `middlewares/`

- `errorHandler.ts`: catches every thrown `ApiError` (or unknown error) and
  turns it into a consistent JSON response with the right HTTP status code.
  Also exports `notFoundHandler` for unmatched routes.
