# `repositories/` - data access layer

Each entity (Menu, Order) has **one interface** and **two implementations**:

| Interface          | In-memory (default)         | MongoDB (if `MONGO_URI` set)  |
|---------------------|------------------------------|--------------------------------|
| `IMenuRepository`   | `InMemoryMenuRepository`     | `MongoMenuRepository`          |
| `IOrderRepository`  | `InMemoryOrderRepository`    | `MongoOrderRepository`         |

`container/inversify.config.ts` decides which implementation to bind at
startup. Everything above this layer (services, controllers) only ever
imports the *interface* from `interfaces.ts`, so it has no idea which one is
actually running - Dependency Inversion in practice, enforced via InversifyJS.

`InMemory*` repositories store data in a plain array/Map - simplest possible
persistence, perfect for local dev/demo/tests, but resets on restart.
`Mongo*` repositories use Mongoose models from `../models` and convert
Mongo documents back to plain domain objects (`toDomain`).
