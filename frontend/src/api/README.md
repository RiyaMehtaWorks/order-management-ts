# `api/` - typed backend client

- `client.ts`: one shared axios instance (base URL from `VITE_API_URL`)
  with a response interceptor that unwraps backend errors into plain
  `Error` objects, so calling code just does `catch (err) { err.message }`.
- `menu.ts` / `orders.ts`: one small function per endpoint, each typed with
  the shared `types/index.ts` interfaces. These are the functions TanStack
  Query calls in `hooks/`.
