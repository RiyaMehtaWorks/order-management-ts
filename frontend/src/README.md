# `frontend/src` - source map

```
api/          Typed functions that call the backend REST API (axios)
components/   Small reusable pieces (menu card, cart drawer, checkout form...)
hooks/        useCart (cart state), useSocket (live order updates)
pages/        HomePage (menu+cart+checkout), OrderStatusPage (live tracking)
types/        Shared TS interfaces mirroring the backend
App.tsx       Tiny hand-rolled router between HomePage <-> OrderStatusPage
main.tsx      App entry point - sets up TanStack Query + CartProvider
```

## Data flow
1. `HomePage` uses TanStack Query (`useQuery`) to fetch `/api/menu` via
   `api/menu.ts` and renders `MenuList` -> `MenuItemCard`.
2. Adding items updates the `useCart` context; `CartDrawer` reads from it.
3. Checkout (`CheckoutForm`) validates delivery details client-side, then
   calls `useMutation` -> `api/orders.ts#createOrder` -> `POST /api/orders`.
4. On success, `App` switches to `OrderStatusPage`, passing the new
   `orderId`. That page fetches the order once via TanStack Query, then
   calls `useOrderSocket` to receive live status pushes over Socket.IO -
   no polling.

## Styling
Tailwind CSS, with a Zomato-inspired look: red brand accent
(`bg-brand`/`text-brand`), rounded cards with soft shadows, and a
`.clickable` utility class (see `index.css`) applied to every interactive
element so it always shows `cursor-pointer` and a small hover lift -
consistent "this is tappable" affordance across the app. Layouts use
Tailwind's responsive prefixes (`sm:`/`md:`/`lg:`) so the menu grid, cart
drawer, and checkout form all adapt from mobile to desktop.
