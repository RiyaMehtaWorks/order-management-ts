# `pages/`

- `HomePage.tsx`: hero banner + `MenuList` + floating `CartDrawer`. This is
  the default screen.
- `OrderStatusPage.tsx`: shown right after an order is placed. Fetches the
  order once via TanStack Query, then subscribes to live updates via
  `useOrderSocket` - the "Live"/"Connecting..." badge reflects the actual
  socket connection state. Shows the 4-step tracker, itemized order, total,
  and delivery details.
