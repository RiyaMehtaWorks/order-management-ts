# FoodHub - Order Management

A food-delivery order management feature: browse a menu, add items to a
cart, check out, and track your order's status live (Socket.IO), built with
a Controller-Service-Repository backend (Express + TypeScript + InversifyJS

- MongoDB/in-memory) and a React + Vite + TypeScript + TanStack Query
  frontend styled with Tailwind CSS (Zomato-inspired UX).

```
order-management/
├── backend/     Express API, TypeScript, DI, Socket.IO, Vitest tests
└── frontend/    React + Vite, TanStack Query, Tailwind, Vitest + Playwright
```

Each folder (and most sub-folders) has its own `README.md` explaining what's
inside - start with `backend/src/README.md` and `frontend/src/README.md`
for the architecture, then this file for how to actually run everything.

## 1. Prerequisites

- Node.js 18+ and npm
- (Optional) A MongoDB connection string - the app works with **zero setup**
  using an in-memory store if you skip this.

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and, **optionally**, paste your MongoDB URL:

```
MONGO_URI=mongodb+srv://user:password@cluster0.mongodb.net/order-management
```

Leave `MONGO_URI` empty to just use the built-in in-memory store (menu +
orders reset on restart - perfect for quick demos).

If you did set `MONGO_URI`, seed the menu once:

```bash
npm run seed
```

Run the backend tests, then start the API:

```bash
npm test          # Vitest unit + integration (API) tests
npm run dev        # starts on http://localhost:5001
```

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL defaults to http://localhost:5001, edit if needed
npm run dev              # starts on http://localhost:5173
```

Open http://localhost:5173 in your browser.

Run the frontend component tests:

```bash
npm test
```

Run the Playwright end-to-end tests (needs both servers running - the dev
server auto-starts if it isn't already up):

```bash
npx playwright install   # first time only
npm run e2e
```

## 4. How it works, in short

1. **Menu**: `GET /api/menu` returns the seeded items; the UI groups them
   by category with an Add button that becomes a quantity stepper.
2. **Cart & checkout**: cart state lives in a React Context
   (`useCart`); checkout POSTs to `POST /api/orders`, which re-prices the
   order server-side (never trusts client-sent prices) and validates every
   field.
3. **Order tracking**: after placing an order, the UI subscribes to that
   order's Socket.IO room and receives live status pushes as the backend's
   `OrderStatusSimulator` advances the order every ~8s
   (`RECEIVED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED`) - no polling.
4. **Persistence**: one interface, two implementations (in-memory / Mongo)
   per entity, picked automatically based on `MONGO_URI` - see
   `backend/src/repositories/README.md`.

## 5. Deploying

- **Backend**: any Node host (Render, Railway, Fly.io...). Set `PORT`,
  `MONGO_URI` (recommended for a real deployment so data persists), and
  `CLIENT_ORIGIN` (your deployed frontend URL) as environment variables.
- **Frontend**: Vercel or Netlify. Set `VITE_API_URL` to your deployed
  backend URL as a build-time environment variable, then `npm run build`
  (Vercel/Netlify do this automatically from `frontend/`).
