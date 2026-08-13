# `models/` - Mongoose schemas

Only used when the app runs in MongoDB mode (`MONGO_URI` set). Each schema
mirrors the plain TypeScript interfaces in `types/index.ts`, so data
returned from Mongo and from the in-memory store have exactly the same
shape from the rest of the app's point of view.

- `MenuItemModel.ts` - `menuitems` collection.
- `OrderModel.ts` - `orders` collection, embeds `items[]` and `customer` as
  sub-documents (no join needed at this scale).
