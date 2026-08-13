# `config/`

- `db.ts`: single helper to connect Mongoose to `MONGO_URI`. Called from
  `server.ts` at boot, before anything else, so the app can decide whether
  to bind Mongo or in-memory repositories.
