# `e2e/` - Playwright end-to-end tests

Real browser tests that drive the actual running app. Two servers must be
up first:

```bash
# terminal 1
cd backend && npm run dev

# terminal 2 (playwright.config.ts auto-starts this if it's not already running)
cd frontend && npm run dev
```

Then, from `/frontend`:
```bash
npx playwright install   # first time only - downloads browser binaries
npm run e2e               # headless run
npm run e2e:ui             # interactive UI mode, great for debugging
```

`order-flow.spec.ts` covers: browse -> add to cart -> checkout -> see the
live status tracker; client-side validation errors on an empty checkout
form; and the quantity +/- stepper.
