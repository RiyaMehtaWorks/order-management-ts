# `components/`

- `Navbar.tsx`: sticky header, brand logo (click = back to menu), live cart badge.
- `MenuItemCard.tsx`: one menu item - image, name, description, price, and
  an Add button that turns into a +/- quantity stepper once in the cart.
  Shows a "Sold out" badge and disables adding when `available === false`.
- `MenuList.tsx`: fetches the menu (TanStack Query), groups it by category,
  renders a responsive grid of `MenuItemCard`s. Handles loading (skeletons)
  and error states.
- `CartDrawer.tsx`: floating "View Cart" pill -> slide-over panel with line
  items (qty +/-, remove) -> "Proceed to Checkout" -> swaps to `CheckoutForm`.
- `CheckoutForm.tsx`: delivery-details form with client-side validation
  mirroring the backend's rules, submits via TanStack `useMutation` ->
  `POST /api/orders`, shows toasts on success/error.
- `OrderStatusTracker.tsx`: horizontal 4-step progress bar
  (Received -> Preparing -> Out for Delivery -> Delivered), or a red banner
  if the order was cancelled.

Every clickable element uses the shared `.clickable` class (cursor-pointer +
hover lift) and Tailwind's `hover:`/responsive prefixes for a consistent,
Zomato-inspired feel across screen sizes.
