# `types/` - shared domain types

`index.ts` defines every core shape used across the backend: `MenuItem`,
`Order`, `OrderLineItem`, `CustomerDetails`, `OrderStatus`, and the
`STATUS_FLOW` array that defines the allowed order of statuses
(`RECEIVED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED`). Both the
in-memory and MongoDB repositories return data in this exact shape, and the
frontend's `types/index.ts` mirrors it for end-to-end type safety.
