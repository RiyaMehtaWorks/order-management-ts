# `container/` - InversifyJS dependency injection

- `types.ts`: symbolic tokens used as binding keys (`TYPES.MenuRepository`,
  etc.) - InversifyJS needs a token distinct from the TypeScript interface
  since interfaces don't exist at runtime.
- `inversify.config.ts`: `buildContainer(useMongo)` binds every
  interface/class to its concrete implementation. `useMongo` is decided
  once in `server.ts` from `process.env.MONGO_URI`, and that single flag
  is what switches the whole app between in-memory and MongoDB persistence.

To add a new injectable service: create the class with `@injectable()`,
add a symbol in `types.ts` if it's bound to an interface, then bind it here.
