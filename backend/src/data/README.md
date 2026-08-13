# `data/` - seed / fixture data

- `menuData.ts`: the hard-coded list of menu items (name, description,
  price, image, category, availability). Single source of truth for menu
  content - both the in-memory repository and the Mongo seed script read
  from here.
- `seed.ts`: one-off script (`npm run seed`) that pushes `menuData` into
  your MongoDB `menuitems` collection. Only needed in Mongo mode - the
  in-memory mode already has this data loaded automatically.
