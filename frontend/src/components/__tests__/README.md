# `components/__tests__` - Vitest + React Testing Library

Component tests focus on user-visible behaviour (what's rendered / what
happens on click), not implementation details. `CartProvider` /
`QueryClientProvider` are wrapped around each component under test since
`useCart` and `useQuery` both need their context. Run with
`npm test` from `/frontend`.
